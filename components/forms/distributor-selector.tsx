"use client";

import { cn } from "@/lib/utils";
import type { DistributorType } from "@/lib/app-context";

interface DistributorOption {
  id: DistributorType;
  label: string;
  description: string;
  iconPath: string;
}

const DISTRIBUTORS: DistributorOption[] = [
  {
    id: "npm_wrapper",
    label: "NPM Wrapper",
    description: "Create an npm wrapper around your Go binary",
    iconPath: "/icons/npm-wrapper.svg",
  },
  {
    id: "goreleaser",
    label: "GoReleaser",
    description: "Generate GoReleaser configuration",
    iconPath: "/icons/go-releaser.svg",
  }
];

interface DistributorSelectorProps {
  selected: Set<DistributorType>;
  onChange: (type: DistributorType) => void;
}

export function DistributorSelector({ selected, onChange }: DistributorSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {DISTRIBUTORS.map((distributor) => {
        const isSelected = selected.has(distributor.id);

        return (
          <button
            key={distributor.id}
            onClick={() => onChange(distributor.id)}
            className={cn(
              "group flex min-h-32 flex-col justify-between border px-4 py-4 text-left transition-colors",
              isSelected
                ? "border-zinc-500 bg-zinc-900 text-zinc-100"
                : "border-zinc-800 bg-zinc-950 text-zinc-100 hover:border-zinc-500"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <img
                src={distributor.iconPath}
                alt={distributor.label}
                className={cn(
                  "h-7 w-7 object-contain",
                  isSelected ? "opacity-95" : "opacity-70"
                )}
              />
              <span
                className={cn(
                  "inline-block border px-1.5 py-0.5 text-[10px] uppercase tracking-wide",
                  isSelected
                    ? "border-zinc-500 text-zinc-300"
                    : "border-zinc-700 text-zinc-500 group-hover:border-zinc-500"
                )}
              >
                {isSelected ? "Selected" : "Select"}
              </span>
            </div>

            <div className="text-left">
              <h3
                className={cn(
                  "text-sm font-medium transition-colors",
                  isSelected ? "text-zinc-100" : "text-zinc-100"
                )}
              >
                {distributor.label}
              </h3>
              <p className={cn("mt-1 text-xs", isSelected ? "text-zinc-400" : "text-zinc-500")}>
                {distributor.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function getDistributorLabel(type: DistributorType): string {
  return DISTRIBUTORS.find((d) => d.id === type)?.label || type;
}
