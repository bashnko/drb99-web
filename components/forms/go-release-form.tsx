"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_OPTIONS, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

export interface GoReleaseFormData {
  repoUrl: string;
  binaryName: string;
  packageName: string;
  description: string;
  author: string;
  platforms: string[];
  notes: string;
}

interface GoReleaseFormProps {
  data: GoReleaseFormData;
  onChange: (data: GoReleaseFormData) => void;
}

const inputClasses = "py-3 px-4 h-auto rounded-none transition-all";

export function GoReleaseForm({ data, onChange }: GoReleaseFormProps) {
  const update = <Key extends keyof GoReleaseFormData>(
    key: Key,
    value: GoReleaseFormData[Key]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const updateBinaryName = (binaryName: string) => {
    onChange({
      ...data,
      binaryName,
      packageName: binaryName,
    });
  };

  const togglePlatform = (platformId: PlatformId, checked: boolean) => {
    const platforms = checked
      ? [...new Set([...data.platforms, platformId])]
      : data.platforms.filter((platform) => platform !== platformId);

    update("platforms", platforms);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="go-repo-url" className="text-sm" style={{ color: "var(--muted-foreground)" }}>Repository URL</Label>
          <Input
            id="go-repo-url"
            placeholder="github.com/user/repo"
            value={data.repoUrl}
            onChange={(event) => update("repoUrl", event.target.value)}
            className={inputClasses}
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="go-binary-name" className="text-sm" style={{ color: "var(--muted-foreground)" }}>Binary Name</Label>
          <Input
            id="go-binary-name"
            placeholder="mytool"
            value={data.binaryName}
            onChange={(event) => updateBinaryName(event.target.value)}
            className={inputClasses}
            style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
      </div>

      <Separator style={{ background: "var(--border)" }} />

      <div className="space-y-3">
        <Label className="text-sm" style={{ color: "var(--muted-foreground)" }}>Target Platforms</Label>
        <div className="grid grid-cols-3 gap-4">
          {PLATFORM_OPTIONS.map((platform) => {
            const isChecked = data.platforms.includes(platform.id);

            return (
              <div
                key={platform.id}
                role="button"
                tabIndex={0}
                onClick={() => togglePlatform(platform.id, !isChecked)}
                onKeyDown={(event) => {
                  if (event.key === " " || event.key === "Enter") {
                    event.preventDefault();
                    togglePlatform(platform.id, !isChecked);
                  }
                }}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-none border p-4 transition-all outline-none focus-visible:ring-2"
                style={{
                  borderColor: isChecked ? "var(--ring)" : "var(--border)",
                  background: isChecked ? "var(--accent)" : "transparent",
                }}
              >
                {platform.id === "linux" && <img src="https://files.svgcdn.io/flat-color-icons/linux.svg" alt="Linux" className={cn("w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm" : "opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0")} />}
                {platform.id === "darwin" && <img src="https://files.svgcdn.io/qlementine-icons/mac-16.svg" alt="macOS" className={cn("platform-icon-mac w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm" : "opacity-50 grayscale group-hover:opacity-80")} />}
                {platform.id === "windows" && <img src="https://files.svgcdn.io/devicon/windows8.svg" alt="Windows" className={cn("w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm" : "opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0")} />}
                <span className="text-xs font-medium transition-colors" style={{ color: isChecked ? "var(--foreground)" : "var(--muted-foreground)" }}>{platform.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const INITIAL_GO_RELEASE_DATA: GoReleaseFormData = {
  repoUrl: "",
  binaryName: "",
  packageName: "",
  description: "",
  author: "",
  platforms: [],
  notes: "",
};
