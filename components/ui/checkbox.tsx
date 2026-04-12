"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

function Checkbox({ id, checked = false, onCheckedChange, className, disabled }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      id={id}
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange?.(!checked);
      }}
      className={cn(
        "peer h-[18px] w-[18px] shrink-0 rounded-[4px] border border-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        checked
          ? "bg-white border-white text-black"
          : "bg-transparent hover:border-white/40",
        className
      )}
    >
      {checked && (
        <svg
          className="h-full w-full text-black p-[2px]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

export { Checkbox };
