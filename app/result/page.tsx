"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Copy, FileCode2, Check, DownloadCloud, Code2, Pencil, Lock } from "lucide-react";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface SessionData {
  workflow: "go-release" | "npm-wrapper";
  summary: {
    repo_url: string;
    binary_name: string;
    version?: string;
    platforms: string[];
    asset_urls?: Record<string, string>;
    [key: string]: unknown;
  };
  files: Record<string, string>;
}

const GENERATED_RESULT_KEY = "generated-result";
let cachedGeneratedResultRaw: string | null = null;
let cachedGeneratedResultParsed: SessionData | null = null;

const subscribeToGeneratedResult = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === GENERATED_RESULT_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
};

const readGeneratedResult = (): SessionData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(GENERATED_RESULT_KEY);
  if (!raw) {
    cachedGeneratedResultRaw = null;
    cachedGeneratedResultParsed = null;
    return null;
  }

  if (raw === cachedGeneratedResultRaw) {
    return cachedGeneratedResultParsed;
  }

  try {
    cachedGeneratedResultRaw = raw;
    cachedGeneratedResultParsed = JSON.parse(raw) as SessionData;
    return cachedGeneratedResultParsed;
  } catch (err) {
    console.error("Failed to parse session data", err);
    cachedGeneratedResultRaw = null;
    cachedGeneratedResultParsed = null;
    return null;
  }
};

const getLanguage = (filename: string) => {
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
};

export default function ResultPage() {
  const resultData = useSyncExternalStore(
    subscribeToGeneratedResult,
    readGeneratedResult,
    () => null
  );
  const [activeFile, setActiveFile] = useState<string>("");
  const [editedContents, setEditedContents] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const fileContents = {
    ...(resultData?.files ?? {}),
    ...editedContents,
  };
  const defaultFile = Object.keys(resultData?.files ?? {})[0] ?? "";
  const selectedFile = activeFile && fileContents[activeFile] !== undefined ? activeFile : defaultFile;

  useEffect(() => {
    // Workaround for Monaco Editor crash in Firefox: "can't access property 'offsetNode', hitResult is null"
    if (typeof window !== "undefined" && typeof document.caretPositionFromPoint === "function") {
      const originalCaretPositionFromPoint = document.caretPositionFromPoint.bind(document);
      document.caretPositionFromPoint = (x: number, y: number) => {
        const result = originalCaretPositionFromPoint(x, y);
        if (result === null) {
          return { offsetNode: document.body, offset: 0 } as any;
        }
        return result;
      };
    }
  }, []);

  useEffect(() => {
    if (!editorRef.current || !selectedFile) return;

    const layoutEditor = () => editorRef.current?.layout();
    const frame = requestAnimationFrame(layoutEditor);

    window.addEventListener("resize", layoutEditor);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layoutEditor);
    };
  }, [isEditing, selectedFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && selectedFile) {
      setEditedContents((prev) => ({ ...prev, [selectedFile]: value }));
    }
  };

  const handleCopy = () => {
    if (!selectedFile || !fileContents[selectedFile]) return;
    navigator.clipboard.writeText(fileContents[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
  
    const zip = new JSZip();
    
    
    
    Object.entries(fileContents).forEach(([filename, content]) => {
      zip.file(filename, content);
    });

  
    const binaryName = resultData?.summary?.binary_name || "generated-package";
    
    try {
   
      const blob = await zip.generateAsync({ type: "blob" });
      
    
      saveAs(blob, `${binaryName}.zip`);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
    }
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.layout();
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-50 flex flex-col items-center justify-center font-sans gap-6">
        <p className="text-zinc-400 text-sm">No generated result found. Go back and generate a package first.</p>
        <Link href="/generate">
          <Button variant="primary" size="sm">Go to Generate</Button>
        </Link>
      </div>
    );
  }

  const isNpmWrapper = resultData.workflow === "npm-wrapper";

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-50 font-sans selection:bg-zinc-800">

      <div className="w-full px-6 lg:px-10 py-6 flex flex-col flex-1 min-h-0 gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium tracking-tight text-white">Generated Output</h1>
            <p className="text-zinc-400 text-sm">Review, edit, and copy your generated files</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-sm font-medium text-zinc-300">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Workflow: {isNpmWrapper ? "NPM Wrapper" : "Go Release"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
          <Link href="/generate" className="inline-flex">
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to edit
            </Button>
          </Link>
          <Button variant="primary" size="sm" className="gap-2 w-full sm:w-auto" onClick={handleDownloadZip}>
            <DownloadCloud className="w-4 h-4" />
            Download ZIP
          </Button>
        </div>

        {/* Main 2-Column Grid */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[800px] lg:min-h-[85vh] pb-6 lg:pb-8">

          {/* Left Panel - Input Summary */}
          <Card className="flex flex-col lg:w-[320px] shrink-0 min-h-0 lg:h-full lg:max-h-full">
            <CardHeader className="shrink-0">
              <CardTitle>Input Summary</CardTitle>
              <CardDescription>Values used for generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 overflow-y-auto min-h-0 flex-1">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Repository URL</p>
                <p className="text-sm font-mono text-zinc-300 truncate" title={resultData.summary.repo_url}>
                  {resultData.summary.repo_url || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Binary Name</p>
                <div className="inline-flex items-center gap-2 rounded-md bg-white/[0.04] px-2 py-1">
                  <Code2 className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-mono text-zinc-200">{resultData.summary.binary_name || "N/A"}</span>
                </div>
              </div>

              {isNpmWrapper && resultData.summary.version && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Version</p>
                  <p className="text-sm font-mono text-zinc-300">{resultData.summary.version}</p>
                </div>
              )}

              <Separator className="bg-white/[0.08]" />

              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Target Platforms ({resultData.summary.platforms?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {resultData.summary.platforms?.map((platform) => {
                    let iconUrl = "";
                    const p = platform.toLowerCase();
                    if (p.includes("linux")) iconUrl = "https://files.svgcdn.io/flat-color-icons/linux.svg";
                    else if (p.includes("darwin") || p.includes("mac")) iconUrl = "https://files.svgcdn.io/qlementine-icons/mac-16.svg";
                    else if (p.includes("windows")) iconUrl = "https://files.svgcdn.io/devicon/windows8.svg";

                    return (
                      <span key={platform} className="inline-flex items-center gap-1.5 text-xs font-mono rounded bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 text-zinc-300">
                        {iconUrl && (
                          <img 
                            src={iconUrl} 
                            alt={platform} 
                            className={`w-3.5 h-3.5 ${p.includes("darwin") || p.includes("mac") ? "invert opacity-80" : ""}`} 
                          />
                        )}
                        {platform}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Display Asset URLs if NPM wrapper workflow and asset_urls exist */}
              {isNpmWrapper && resultData.summary.asset_urls && Object.keys(resultData.summary.asset_urls).length > 0 && (
                <>
                  <Separator className="bg-white/[0.08]" />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Asset URLs</p>
                    <div className="space-y-2">
                      {Object.entries(resultData.summary.asset_urls).map(([key, url]) => (
                        <div key={key} className="space-y-1">
                          <p className="text-[10px] text-zinc-500 uppercase">{key}</p>
                          <p className="text-xs font-mono text-zinc-300 truncate" title={url as string}>
                            {url as string || "None provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </CardContent>
          </Card>

          {/* Right Panel - Workspace */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-[600px] lg:min-h-[85vh] min-w-0 rounded-xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden shadow-2xl">

            {/* File Explorer Sidebar */}
            <div className="w-full h-[30%] lg:h-auto lg:w-64 shrink-0 lg:shrink border-b lg:border-b-0 lg:border-r border-white/[0.08] flex flex-col bg-[#09090b] min-h-0">
              <div className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.08] flex items-center justify-between shrink-0">
                <span>Explorer</span>
              </div>
              <div className="flex-1 overflow-y-auto py-2 min-h-0">
                <div className="px-2 pb-1">
                  <div className="px-2 py-1 text-xs font-medium text-zinc-400 flex items-center gap-1.5 opacity-80">
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                    generated
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {Object.keys(resultData.files || {}).map((filename) => (
                      <button
                        key={filename}
                        onClick={() => setActiveFile(filename)}
                        className={`w-full flex items-center gap-2 px-6 py-1.5 text-sm transition-colors ${selectedFile === filename
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                          }`}
                      >
                        <FileCode2 className={`w-4 h-4 ${selectedFile === filename ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span className="truncate">{filename}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0c0c0e]">
              <div className="shrink-0 flex flex-col gap-3 px-4 py-3 border-b border-white/[0.08] bg-[#09090b] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-zinc-300 px-3 py-1.5 bg-white/[0.04] rounded-md border border-white/[0.04]">
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  {selectedFile || "Select a file"}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!isEditing && selectedFile ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                      <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                      Click Edit to modify this file
                    </div>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-zinc-400 hover:text-white"
                    onClick={handleCopy}
                    disabled={!selectedFile}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 gap-2 border transition-all ${isEditing
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15 hover:text-emerald-200"
                        : "border-amber-400/40 bg-amber-400/10 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.08)] hover:border-amber-300/60 hover:bg-amber-400/15 hover:text-amber-100"
                      }`}
                    onClick={() => setIsEditing((prev) => !prev)}
                    disabled={!selectedFile}
                  >
                    {isEditing ? <Pencil className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {isEditing ? "Editing" : "Edit"}
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0 min-w-0 bg-[#111317]">
                {selectedFile ? (
                  <div className="h-full w-full overflow-hidden">
                    <Editor
                      height="100%"
                      language={getLanguage(selectedFile)}
                      theme="vs-dark"
                      value={fileContents[selectedFile] || ""}
                      onMount={handleEditorMount}
                      onChange={isEditing ? handleEditorChange : undefined}
                      options={{
                        automaticLayout: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineHeight: 24,
                        padding: { top: 24, bottom: 24 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        readOnly: !isEditing,
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                      }}
                      loading={
                        <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                          Loading editor...
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                    No file selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
