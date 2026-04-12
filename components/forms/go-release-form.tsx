"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectOption } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const PLATFORMS = [
  { id: "linux-amd64", label: "Linux (amd64)" },
  { id: "linux-arm64", label: "Linux (arm64)" },
  { id: "darwin-amd64", label: "macOS (amd64)" },
  { id: "darwin-arm64", label: "macOS (arm64)" },
  { id: "windows-amd64", label: "Windows (amd64)" },
  { id: "windows-arm64", label: "Windows (arm64)" },
];

export interface GoReleaseFormData {
  repoUrl: string;
  binaryName: string;
  version: string;
  packageName: string;
  description: string;
  author: string;
  platforms: string[];
  outputMode: string;
  notes: string;
}

interface GoReleaseFormProps {
  data: GoReleaseFormData;
  onChange: (data: GoReleaseFormData) => void;
}

export function GoReleaseForm({ data, onChange }: GoReleaseFormProps) {
  const update = <K extends keyof GoReleaseFormData>(
    key: K,
    value: GoReleaseFormData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const togglePlatform = (platformId: string, checked: boolean) => {
    const next = checked
      ? [...new Set([...data.platforms, platformId])]
      : data.platforms.filter((p) => p !== platformId);
    update("platforms", next);
  };

  return (
    <div className="space-y-8">
      {/* Row 1 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="go-repo-url">Repository URL</Label>
          <Input
            id="go-repo-url"
            placeholder="github.com/user/repo"
            value={data.repoUrl}
            onChange={(e) => update("repoUrl", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="go-binary-name">Binary Name</Label>
          <Input
            id="go-binary-name"
            placeholder="mytool"
            value={data.binaryName}
            onChange={(e) => update("binaryName", e.target.value)}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="go-version">Version</Label>
          <Input
            id="go-version"
            placeholder="1.0.0"
            value={data.version}
            onChange={(e) => update("version", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="go-package-name">Package Name</Label>
          <Input
            id="go-package-name"
            placeholder="@scope/package-name"
            value={data.packageName}
            onChange={(e) => update("packageName", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Description & Author */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="go-description">Description</Label>
          <Input
            id="go-description"
            placeholder="A brief description of your tool"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="go-author">Author</Label>
          <Input
            id="go-author"
            placeholder="Your Name <email@example.com>"
            value={data.author}
            onChange={(e) => update("author", e.target.value)}
          />
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <Label>Target Platforms</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const isChecked = data.platforms.includes(platform.id);
            return (
              <div
                key={platform.id}
                role="button"
                tabIndex={0}
                onClick={() => togglePlatform(platform.id, !isChecked)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    togglePlatform(platform.id, !isChecked);
                  }
                }}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
              >
                <Checkbox
                  id={`go-platform-${platform.id}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    togglePlatform(platform.id, checked)
                  }
                />
                <span className="text-sm text-zinc-300">{platform.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Output Mode */}
      <div className="space-y-2.5 sm:max-w-xs">
        <Label htmlFor="go-output-mode">Output Mode</Label>
        <Select
          value={data.outputMode}
          onValueChange={(v) => update("outputMode", v)}
          placeholder="Select output mode"
        >
          <SelectOption value="zip">ZIP Archive</SelectOption>
          <SelectOption value="tar">Tar Archive</SelectOption>
          <SelectOption value="directory">Directory</SelectOption>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2.5">
        <Label htmlFor="go-notes">Notes / Extra Configuration</Label>
        <Textarea
          id="go-notes"
          placeholder="Any extra flags, build tags, or configuration..."
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>
    </div>
  );
}

export const INITIAL_GO_RELEASE_DATA: GoReleaseFormData = {
  repoUrl: "",
  binaryName: "",
  version: "",
  packageName: "",
  description: "",
  author: "",
  platforms: [],
  outputMode: "",
  notes: "",
};
