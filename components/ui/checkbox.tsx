import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer",
          className
        )}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
