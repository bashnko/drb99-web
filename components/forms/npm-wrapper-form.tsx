"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectOption } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface NpmWrapperFormData {
  packageName: string;
  cliCommandName: string;
  binarySourceUrl: string;
  version: string;
  installDirectory: string;
  platformTarget: string;
  postInstallScript: string;
  postInstallEnabled: boolean;
  description: string;
  notes: string;
}

interface NpmWrapperFormProps {
  data: NpmWrapperFormData;
  onChange: (data: NpmWrapperFormData) => void;
}

export function NpmWrapperForm({ data, onChange }: NpmWrapperFormProps) {
  const update = <K extends keyof NpmWrapperFormData>(
    key: K,
    value: NpmWrapperFormData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Row 1 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="npm-package-name">Package Name</Label>
          <Input
            id="npm-package-name"
            placeholder="@scope/cli-wrapper"
            value={data.packageName}
            onChange={(e) => update("packageName", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-cli-command">CLI Command Name</Label>
          <Input
            id="npm-cli-command"
            placeholder="mytool"
            value={data.cliCommandName}
            onChange={(e) => update("cliCommandName", e.target.value)}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="npm-binary-url">Binary Source URL</Label>
          <Input
            id="npm-binary-url"
            placeholder="https://github.com/user/repo/releases/download/..."
            value={data.binarySourceUrl}
            onChange={(e) => update("binarySourceUrl", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-version">Version</Label>
          <Input
            id="npm-version"
            placeholder="1.0.0"
            value={data.version}
            onChange={(e) => update("version", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Row 3 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="npm-install-dir">Install Directory</Label>
          <Input
            id="npm-install-dir"
            placeholder="/usr/local/bin"
            value={data.installDirectory}
            onChange={(e) => update("installDirectory", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-platform-target">Platform Target</Label>
          <Select
            value={data.platformTarget}
            onValueChange={(v) => update("platformTarget", v)}
            placeholder="Select target platform"
          >
            <SelectOption value="linux-amd64">Linux (amd64)</SelectOption>
            <SelectOption value="linux-arm64">Linux (arm64)</SelectOption>
            <SelectOption value="darwin-amd64">macOS (amd64)</SelectOption>
            <SelectOption value="darwin-arm64">macOS (arm64)</SelectOption>
            <SelectOption value="windows-amd64">Windows (amd64)</SelectOption>
            <SelectOption value="windows-arm64">Windows (arm64)</SelectOption>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Post Install Script */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="npm-postinstall-toggle">Post Install Script</Label>
          <button
            type="button"
            id="npm-postinstall-toggle"
            role="switch"
            aria-checked={data.postInstallEnabled}
            onClick={() => update("postInstallEnabled", !data.postInstallEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 ${
              data.postInstallEnabled ? "bg-white" : "bg-white/10"
            }`}
          >
            <span
              className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-transform ${
                data.postInstallEnabled
                  ? "translate-x-5 bg-black"
                  : "translate-x-0 bg-zinc-400"
              }`}
            />
          </button>
        </div>
        {data.postInstallEnabled && (
          <div className="space-y-2.5 animate-in">
            <Label htmlFor="npm-postinstall-script">Script Content</Label>
            <Textarea
              id="npm-postinstall-script"
              placeholder="#!/bin/sh&#10;chmod +x ./bin/mytool"
              value={data.postInstallScript}
              onChange={(e) => update("postInstallScript", e.target.value)}
              className="min-h-[80px] font-mono text-xs"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-2.5">
        <Label htmlFor="npm-description">Description</Label>
        <Input
          id="npm-description"
          placeholder="A short description for the npm package"
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2.5">
        <Label htmlFor="npm-notes">Extra Notes</Label>
        <Textarea
          id="npm-notes"
          placeholder="Any additional configuration or notes..."
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>
    </div>
  );
}

export const INITIAL_NPM_WRAPPER_DATA: NpmWrapperFormData = {
  packageName: "",
  cliCommandName: "",
  binarySourceUrl: "",
  version: "",
  installDirectory: "",
  platformTarget: "",
  postInstallScript: "",
  postInstallEnabled: false,
  description: "",
  notes: "",
};
