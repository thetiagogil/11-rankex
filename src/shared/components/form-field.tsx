import type { ReactNode } from "react";

import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/cn";

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  htmlFor?: string;
  icon?: ReactNode;
  label: ReactNode;
  labelClassName?: string;
  required?: boolean;
};

export function FormField({
  children,
  className,
  description,
  descriptionClassName,
  htmlFor,
  icon,
  label,
  labelClassName,
  required = false,
}: FormFieldProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <Label
        className={cn(
          icon &&
            "[&_svg]:text-primary inline-flex w-full items-center gap-2 [&_svg]:size-3.5",
          labelClassName,
        )}
        htmlFor={htmlFor}
        required={required}
      >
        {icon}
        {label}
      </Label>
      {children}
      {description ? (
        <p className={cn("text-muted-foreground text-xs", descriptionClassName)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
