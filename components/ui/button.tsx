import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
      primary:
        "bg-white text-black font-semibold hover:bg-zinc-200 shadow-[0_0_40px_-15px_rgba(255,255,255,0.4)] active:scale-[0.97]",
      secondary:
        "border border-white/10 bg-white/5 text-zinc-300 font-medium hover:bg-white/10 hover:text-white active:scale-[0.97]",
      ghost:
        "text-zinc-400 hover:text-white hover:bg-white/5",
    };

    const sizes: Record<string, string> = {
      sm: "h-9 px-4 text-xs rounded-lg",
      default: "h-11 px-6 text-sm rounded-lg",
      lg: "h-12 sm:h-14 px-8 text-sm rounded-full",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
