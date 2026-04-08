import { ComponentProps } from "react";
import { cn } from "@/libs/utils";

interface ToggleProps extends ComponentProps<"button"> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export function Toggle({
  pressed = false,
  onPressedChange,
  className,
  children,
  onClick,
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={(e) => {
        onPressedChange?.(!pressed);
        onClick?.(e);
      }}
      className={cn(
        "font-label rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        pressed
          ? "bg-primary text-on-primary shadow-sm"
          : "text-on-surface-variant hover:text-on-surface",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
