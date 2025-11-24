import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * LoadingButton component extends Button with loading state
 * Automatically disables the button and shows a loading spinner when isLoading is true
 * Provides clear visual feedback during async operations
 */
const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, loadingText, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          isLoading && "cursor-wait",
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isLoading ? loadingText || children : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
