"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Copy, FileCode2, Check, DownloadCloud, Code2 } from "lucide-react";
import Link from "next/link";

interface SessionData {
  workflow: "go-release" | "npm-wrapper";
  summary: {
    repo_url: string;
    binary_name: string;
    version?: string;
    platforms: string[];
    asset_urls?: Record<string, string>;
    [key: string]: any;
  };
  files: Record<string, string>;
}

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
  const [resultData, setResultData] = useState<SessionData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFile, setActiveFile] = useState<string>("");
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("generated-result");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SessionData;
        setResultData(parsed);
        setFileContents(parsed.files);
        const keys = Object.keys(parsed.files);
        if (keys.length > 0) {
          setActiveFile(keys[0]);
        }
      } catch (err) {
        console.error("Failed to parse session data", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFileContents((prev) => ({ ...prev, [activeFile]: value }));
    }
  };

  const handleCopy = () => {
    if (!fileContents[activeFile]) return;
    navigator.clipboard.writeText(fileContents[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-50 flex items-center justify-center font-sans">
        <div className="text-zinc-500 text-sm">Loading workspace...</div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-zinc-800">
      {/* Top Navbar Actions */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-[#09090b]">
        <Link href="/generate" className="inline-flex">
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to edit
          </Button>
        </Link>
        <Button variant="primary" size="sm" className="gap-2">
          <DownloadCloud className="w-4 h-4" />
          Download ZIP
        </Button>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium tracking-tight text-white">Generated Output</h1>
            <p className="text-zinc-400 text-sm">Review, edit, and copy your generated files</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-sm font-medium text-zinc-300">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Workflow: {isNpmWrapper ? "NPM Wrapper" : "Go Release"}
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* Left Panel - Input Summary */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Input Summary</CardTitle>
              <CardDescription>Values used for generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  {resultData.summary.platforms?.map((platform) => (
                    <span key={platform} className="text-xs font-mono rounded bg-white/[0.04] border border-white/[0.08] px-2 py-1 text-zinc-300">
                      {platform}
                    </span>
                  ))}
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
          <div className="flex flex-col lg:flex-row h-[70vh] min-h-[600px] rounded-xl border border-white/[0.08] bg-[#0c0c0e] overflow-hidden shadow-2xl">

            {/* File Explorer Sidebar */}
            <div className="w-full lg:w-64 border-r border-white/[0.08] flex flex-col bg-[#09090b]">
              <div className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/[0.08] flex items-center justify-between">
                <span>Explorer</span>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
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
                        className={`w-full flex items-center gap-2 px-6 py-1.5 text-sm transition-colors ${activeFile === filename
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                          }`}
                      >
                        <FileCode2 className={`w-4 h-4 ${activeFile === filename ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span className="truncate">{filename}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e] relative">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08] bg-[#09090b]">
                <div className="flex items-center gap-2 text-sm text-zinc-300 px-3 py-1.5 bg-white/[0.04] rounded-md border border-white/[0.04]">
                  <FileCode2 className="w-4 h-4 text-emerald-400" />
                  {activeFile || "Select a file"}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-zinc-400 hover:text-white"
                    onClick={handleCopy}
                    disabled={!activeFile}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 text-zinc-400 hover:text-white" disabled>
                    <Download className="w-3.5 h-3.5" />
                    <span className="sr-only sm:not-sr-only">Download File</span>
                  </Button>
                </div>
              </div>

              <div className="flex-1 w-full relative">
                {activeFile ? (
                  <Editor
                    height="100%"
                    language={getLanguage(activeFile)}
                    theme="vs-dark"
                    value={fileContents[activeFile] || ""}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineHeight: 1.6,
                      padding: { top: 24, bottom: 24 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                    }}
                    className="absolute inset-0"
                    loading={
                      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                        Loading editor...
                      </div>
                    }
                  />
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
