import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, checked = false, onChange, id, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onChange}
        className={cn(
          "h-4 w-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer transition-colors",
          checked ? "bg-black border-black" : "bg-white hover:border-gray-400",
          className
        )}
        {...props}
      >
        {checked && (
          <Check className="h-3 w-3 text-white" strokeWidth={2} />
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };