"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  className?: string;
}

function Select({
  value,
  onValueChange,
  children,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
        className={cn(
          "flex h-11 w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-zinc-100 transition-colors focus-visible:border-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-zinc-500"
        )}
      >
        {placeholder && (
          <option value="" disabled className="bg-zinc-900 text-zinc-500">
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function SelectOption({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <option value={value} className="bg-zinc-900 text-zinc-100">
      {children}
    </option>
  );
}

export { Select, SelectOption };
