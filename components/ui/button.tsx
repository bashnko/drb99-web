import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-white text-black font-semibold hover:bg-zinc-200 shadow-[0_0_40px_-15px_rgba(255,255,255,0.4)] active:scale-[0.97]",
  secondary:
    "border border-white/10 bg-white/5 text-zinc-300 font-medium hover:bg-white/10 hover:text-white active:scale-[0.97]",
  ghost: "text-zinc-400 hover:text-white hover:bg-white/5",
} as const;

const buttonSizes = {
  sm: "h-9 rounded-lg px-4 text-xs",
  default: "h-11 rounded-lg px-6 text-sm",
  lg: "h-12 rounded-full px-8 text-sm sm:h-14",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
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
