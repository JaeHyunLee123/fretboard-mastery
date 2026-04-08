import { cn } from "@/libs/utils";
import { ComponentProps } from "react";

interface CardProps extends ComponentProps<"div"> {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, className, elevated = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        elevated ? "bg-surface-container-high" : "bg-surface-container-low",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
