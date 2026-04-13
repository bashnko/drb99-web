"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const PLATFORMS = [
    { id: "linux", label: "Linux" },
    { id: "darwin", label: "macOS" },
    { id: "windows", label: "Windows" },
];

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
            {/* Main Settings */}
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
                        onChange={(e) => {
                            onChange({
                              ...data,
                              binaryName: e.target.value,
                              packageName: e.target.value,
                            });
                        }}
                    />
                </div>
            </div>

            <Separator />

            {/* Description & Author (Commented out for now) */}
            {/* 
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
      */}

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

            {/* Output mode section removed as requested */}

            {/* Notes section removed as requested */}
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
