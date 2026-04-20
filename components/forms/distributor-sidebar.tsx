"use client";

import { cn } from "@/lib/utils";
import type { DistributorType } from "@/lib/app-context";
import { getDistributorLabel } from "./distributor-selector";

interface DistributorSidebarProps {
  distributors: DistributorType[];
  active: DistributorType | null;
  onSelect: (type: DistributorType) => void;
}

export function DistributorSidebar({ distributors, active, onSelect }: DistributorSidebarProps) {
  return (
    <div className="w-full lg:w-56 border-b lg:border-b-0 lg:border-r border-zinc-800">
      <div className="flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white">Distributors</h3>
        </div>
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible p-4">
          {distributors.map((distributor) => {
            const isActive = active === distributor;
            return (
              <button
                key={distributor}
                onClick={() => onSelect(distributor)}
                className={cn(
                  "shrink:0 lg:shirnk px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                {getDistributorLabel(distributor)}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
