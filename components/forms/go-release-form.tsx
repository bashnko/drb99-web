"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_OPTIONS, type PlatformId } from "@/lib/platforms";

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
          <Label htmlFor="go-repo-url">Repository URL</Label>
          <Input
            id="go-repo-url"
            placeholder="github.com/user/repo"
            value={data.repoUrl}
            onChange={(event) => update("repoUrl", event.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="go-binary-name">Binary Name</Label>
          <Input
            id="go-binary-name"
            placeholder="mytool"
            value={data.binaryName}
            onChange={(event) => updateBinaryName(event.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Target Platforms</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
