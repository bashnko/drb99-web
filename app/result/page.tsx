"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Editor, type OnMount } from "@monaco-editor/react";
import { ArrowLeft, Check, Copy, DownloadCloud, FileCode2, Lock, Pencil } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { AurForm } from "@/components/forms/aur-form";
import { GoReleaseForm } from "@/components/forms/go-release-form";
import { NpmWrapperForm } from "@/components/forms/npm-wrapper-form";
import { generatePackage } from "@/lib/api";
import { useAppContext, type DistributorType } from "@/lib/app-context";
import { getDistributorLabel } from "@/components/forms/distributor-selector";
import { mapPlatform, mapPlatformsList } from "@/lib/platforms";

interface GeneratedResult {
  files: Record<string, string>;
  summary: Record<string, unknown>;
}

interface DistributorViewState {
  result: GeneratedResult | null;
  activeFile: string;
  editedContents: Record<string, string>;
  isEditing: boolean;
}

type ViewStateMap = Partial<Record<DistributorType, DistributorViewState>>;

function getLanguage(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "json":
      return "json";
    case "js":
    case "ts":
      return "javascript";
    case "md":
      return "markdown";
    case "yml":
    case "yaml":
      return "yaml";
    default:
      return "plaintext";
  }
}

function createDefaultViewState(): DistributorViewState {
  return {
    result: null,
    activeFile: "",
    editedContents: {},
    isEditing: false,
  };
}

function isDistributorType(value: string | null): value is DistributorType {
  return value === "npm_wrapper" || value === "goreleaser" || value === "github_actions" || value === "aur";
}

function getCurrentFileContent(viewState: DistributorViewState, filename: string) {
  if (!viewState.result || !filename) {
    return "";
  }

  return viewState.editedContents[filename] ?? viewState.result.files[filename] ?? "";
}

function ResultPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const {
    repoUrl,
    selectedDistributors,
    aurData,
    setAurData,
    npmWrapperData,
    setNpmWrapperData,
    goReleaserData,
    setGoReleaserData,
    prefillIssue,
  } = useAppContext();

  const distributors = useMemo(
    () => Array.from(selectedDistributors),
    [selectedDistributors]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewStates, setViewStates] = useState<ViewStateMap>({});

  useEffect(() => {
    if (!repoUrl || distributors.length === 0) {
      router.replace("/generate");
    }
  }, [repoUrl, distributors, router]);

  const drbParam = searchParams.get("drb");
  const firstDistributor = distributors[0] ?? null;
  const activeDistributor: DistributorType | null = isDistributorType(drbParam) && distributors.includes(drbParam)
    ? drbParam
    : firstDistributor;

  useEffect(() => {
    if (!activeDistributor) return;

    if (drbParam !== activeDistributor) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("drb", activeDistributor);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [activeDistributor, drbParam, pathname, router, searchParams]);

  useEffect(() => {
    if (!editorRef.current) return;

    const layoutEditor = () => editorRef.current?.layout();
    const frame = requestAnimationFrame(layoutEditor);
    window.addEventListener("resize", layoutEditor);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layoutEditor);
    };
  }, [activeDistributor, viewStates]);

  const currentViewState = activeDistributor
    ? viewStates[activeDistributor] ?? createDefaultViewState()
    : createDefaultViewState();

  const handleSidebarSelect = (distributor: DistributorType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("drb", distributor);
    router.push(`${pathname}?${params.toString()}`);
  };

  const setCurrentViewState = (updater: (prev: DistributorViewState) => DistributorViewState) => {
    if (!activeDistributor) return;

    setViewStates((prev) => {
      const current = prev[activeDistributor] ?? createDefaultViewState();
      return {
        ...prev,
        [activeDistributor]: updater(current),
      };
    });
  };

  const handleGenerateCurrent = async () => {
    if (!activeDistributor) return;

    try {
      setIsGenerating(true);
      setError(null);

      const features = {
        npm_wrapper: activeDistributor === "npm_wrapper",
        goreleaser: activeDistributor === "goreleaser",
        github_actions:
          activeDistributor === "github_actions" ||
          activeDistributor === "goreleaser",
        aur: activeDistributor === "aur",
      };

      const payload: Record<string, unknown> = {
        repo_url: repoUrl,
        features,
      };

      if (activeDistributor === "npm_wrapper") {
        Object.assign(payload, {
          binary_name: npmWrapperData.cliCommandName,
          package_name: npmWrapperData.packageName,
          license: npmWrapperData.license || "MIT",
          description: npmWrapperData.description,
          version: npmWrapperData.version,
          platforms: mapPlatformsList(npmWrapperData.platforms),
          mode: "manual",
          asset_urls: Object.fromEntries(
            npmWrapperData.platforms.map((platform) => [
              mapPlatform(platform),
              npmWrapperData.assetUrls[platform] ?? "",
            ])
          ),
        });
      }

      if (activeDistributor === "goreleaser") {
        Object.assign(payload, {
          binary_name: goReleaserData.binaryName,
          platforms: mapPlatformsList(goReleaserData.platforms),
        });
      }

      if (activeDistributor === "github_actions") {
        Object.assign(payload, {
          binary_name: npmWrapperData.cliCommandName || goReleaserData.binaryName,
          platforms: mapPlatformsList(
            npmWrapperData.platforms.length > 0 ? npmWrapperData.platforms : goReleaserData.platforms
          ),
        });
      }

      if (activeDistributor === "aur") {
        Object.assign(payload, {
          binary_name: aurData.binaryName,
          version: aurData.version,
          license: aurData.license || "MIT",
          description: aurData.description,
        });
      }

      const result = await generatePackage(payload);
      const generated = {
        files: result.files as Record<string, string>,
        summary: payload,
      };
      const firstFile = Object.keys(generated.files)[0] ?? "";

      setCurrentViewState(() => ({
        result: generated,
        activeFile: firstFile,
        editedContents: {},
        isEditing: false,
      }));
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Failed to generate package");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleEditing = () => {
    setCurrentViewState((prev) => ({
      ...prev,
      isEditing: !prev.isEditing,
    }));
  };

  const handleSelectFile = (filename: string) => {
    setCurrentViewState((prev) => ({
      ...prev,
      activeFile: filename,
    }));
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeDistributor || !currentViewState.activeFile || value === undefined) return;

    setCurrentViewState((prev) => ({
      ...prev,
      editedContents: {
        ...prev.editedContents,
        [prev.activeFile]: value,
      },
    }));
  };

  const handleCopy = () => {
    if (!currentViewState.activeFile) return;

    const content = getCurrentFileContent(currentViewState, currentViewState.activeFile);
    if (!content) return;

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadZip = async () => {
    if (!currentViewState.result) return;

    const zip = new JSZip();

    Object.keys(currentViewState.result.files).forEach((filename) => {
      zip.file(filename, getCurrentFileContent(currentViewState, filename));
    });

    const binaryName = (currentViewState.result.summary?.binary_name as string) || "generated-package";
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${binaryName}-${activeDistributor}.zip`);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
  };

  const renderForm = () => {
    if (!activeDistributor) return null;

    if (activeDistributor === "npm_wrapper") {
      return <NpmWrapperForm data={npmWrapperData} onChange={setNpmWrapperData} />;
    }

    if (activeDistributor === "goreleaser") {
      return <GoReleaseForm data={goReleaserData} onChange={setGoReleaserData} />;
    }

    if (activeDistributor === "aur") {
      return <AurForm data={aurData} onChange={setAurData} />;
    }

    return (
      <div className="border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
        GitHub Actions generator has no extra form fields. Use Generate to create workflow files.
      </div>
    );
  };

  if (!repoUrl || distributors.length === 0 || !activeDistributor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  const hasResult = Boolean(currentViewState.result);
  const fileList = hasResult ? Object.keys(currentViewState.result!.files) : [];
  const selectedFile = currentViewState.activeFile || fileList[0] || "";

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-64 shrink-0 border-r border-zinc-800">
        <div className="flex h-12 items-center border-b border-zinc-800 px-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/generate")}
            className="h-8 px-2 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>

        <nav>
          {distributors.map((distributor) => {
            const isActive = activeDistributor === distributor;
            const generated = Boolean(viewStates[distributor]?.result);

            return (
              <button
                key={distributor}
                onClick={() => handleSidebarSelect(distributor)}
                className={`flex h-14 w-full items-center justify-between border-b border-zinc-800 px-4 text-left text-sm ${
                  isActive ? "bg-zinc-900 text-zinc-100" : "bg-transparent text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span>{getDistributorLabel(distributor)}</span>
                <span className={`h-1.5 w-1.5 ${generated ? "bg-emerald-400" : "bg-zinc-700"}`} />
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-zinc-800 px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-sm font-medium uppercase tracking-wide text-zinc-300">
                {getDistributorLabel(activeDistributor)}
              </h1>
              <p className="text-xs text-zinc-500">{repoUrl}</p>
            </div>

            <div className="flex items-center gap-2">
              {hasResult && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 gap-2 border border-zinc-700 text-zinc-300 hover:text-white"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleEditing}
                    className="h-8 gap-2 border border-zinc-700 text-zinc-300 hover:text-white"
                  >
                    {currentViewState.isEditing ? <Pencil className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {currentViewState.isEditing ? "Editing" : "Read only"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadZip}
                    className="h-8 gap-2 border border-zinc-700 text-zinc-300 hover:text-white"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Download
                  </Button>
                </>
              )}

              <Button
                onClick={handleGenerateCurrent}
                disabled={isGenerating}
                className="h-8 border border-zinc-100 bg-zinc-100 px-4 text-zinc-900 hover:bg-white disabled:opacity-40"
              >
                {isGenerating ? "Generating..." : hasResult ? "Regenerate" : "Generate"}
              </Button>
            </div>
          </div>
        </header>

        {prefillIssue && (
          <div className="border-b border-amber-900 bg-amber-950/30 px-5 py-2 text-xs text-amber-300">
            Prefill notice: {prefillIssue}
          </div>
        )}

        {error && (
          <div className="border-b border-red-900 bg-red-950/30 px-5 py-2 text-xs text-red-300">{error}</div>
        )}

        <section className="flex min-h-0 flex-1">
          {!hasResult ? (
            <div className="w-full overflow-auto p-5">{renderForm()}</div>
          ) : (
            <>
              <div className="w-64 shrink-0 border-r border-zinc-800">
                <div className="border-b border-zinc-800 px-4 py-2 text-xs uppercase tracking-wide text-zinc-500">
                  Files
                </div>
                <div>
                  {fileList.map((filename) => (
                    <button
                      key={filename}
                      onClick={() => handleSelectFile(filename)}
                      className={`flex h-10 w-full items-center gap-2 border-b border-zinc-800 px-3 text-left text-sm ${
                        selectedFile === filename
                          ? "bg-zinc-900 text-zinc-100"
                          : "text-zinc-300 hover:bg-zinc-900"
                      }`}
                    >
                      <FileCode2 className="h-4 w-4" />
                      <span className="truncate">{filename}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile)}
                  theme="vs-dark"
                  value={getCurrentFileContent(currentViewState, selectedFile)}
                  onMount={handleEditorMount}
                  onChange={currentViewState.isEditing ? handleEditorChange : undefined}
                  options={{
                    automaticLayout: true,
                    minimap: { enabled: false },
                    readOnly: !currentViewState.isEditing,
                    fontSize: 13,
                  }}
                />
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-500">
          Loading result view...
        </div>
      }
    >
      <ResultPageContent />
    </React.Suspense>
  );
}
