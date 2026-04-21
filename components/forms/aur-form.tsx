"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface AurFormData {
  repoUrl: string;
  binaryName: string;
  version: string;
  license: string;
  description: string;
}

export const INITIAL_AUR_FORM_DATA: AurFormData = {
  repoUrl: "",
  binaryName: "",
  version: "",
  license: "MIT",
  description: "",
};

interface AurFormProps {
  data: AurFormData;
  onChange: (data: AurFormData) => void;
}

export function AurForm({ data, onChange }: AurFormProps) {
  const safeData: AurFormData = {
    repoUrl: data.repoUrl ?? "",
    binaryName: data.binaryName ?? "",
    version: data.version ?? "",
    license: data.license ?? "MIT",
    description: data.description ?? "",
  };

  const update = <Key extends keyof AurFormData>(key: Key, value: AurFormData[Key]) => {
    onChange({ ...safeData, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="aur-repo-url" className="text-sm text-zinc-400">Repository URL</Label>
          <Input
            id="aur-repo-url"
            placeholder="github.com/user/repo"
            value={safeData.repoUrl}
            onChange={(event) => update("repoUrl", event.target.value)}
            className="h-auto bg-zinc-900/50 border-zinc-800 px-4 py-3 text-white rounded-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="aur-binary-name" className="text-sm text-zinc-400">Binary Name</Label>
          <Input
            id="aur-binary-name"
            placeholder="mytool"
            value={safeData.binaryName}
            onChange={(event) => update("binaryName", event.target.value)}
            className="h-auto bg-zinc-900/50 border-zinc-800 px-4 py-3 text-white rounded-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="aur-version" className="text-sm text-zinc-400">Version</Label>
          <Input
            id="aur-version"
            placeholder="v1.0.0"
            value={safeData.version}
            onChange={(event) => update("version", event.target.value)}
            className="h-auto bg-zinc-900/50 border-zinc-800 px-4 py-3 text-white rounded-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="aur-license" className="text-sm text-zinc-400">License</Label>
          <Input
            id="aur-license"
            placeholder="MIT"
            value={safeData.license}
            onChange={(event) => update("license", event.target.value)}
            className="h-auto bg-zinc-900/50 border-zinc-800 px-4 py-3 text-white rounded-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="aur-description" className="text-sm text-zinc-400">Description</Label>
        <textarea
          id="aur-description"
          placeholder="AUR package for mytool"
          value={safeData.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          className={cn(
            "w-full rounded-none border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500",
            "transition-all resize-y focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          )}
        />
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-2 text-xs text-zinc-500">
        <p>AUR generation produces <span className="text-zinc-300">PKGBUILD</span> and <span className="text-zinc-300">.github/workflows/aur.yaml</span>.</p>
        <p>Version is required because the package template is versioned off the repository tag.</p>
      </div>
    </div>
  );
}
