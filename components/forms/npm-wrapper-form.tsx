"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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


          <Input
            id="npm-cli-command"
            placeholder="mytool"
            value={data.cliCommandName}

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
