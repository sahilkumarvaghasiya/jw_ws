import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-gold text-white hover:bg-gold-dark shadow-md hover:shadow-lg hover:-translate-y-0.5",
  secondary:
    "bg-dark text-white hover:bg-dark/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 dark:bg-muted dark:text-foreground dark:hover:bg-[#1e1e1e]",
  outline:
    "border border-border bg-transparent hover:bg-muted hover:border-gold/50",
  ghost: "hover:bg-muted text-foreground",
  danger: "bg-error text-white hover:bg-error/90 shadow-md",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
