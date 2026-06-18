import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/cn";

type SearchInputProps = {
  className?: string;
  id: string;
  inputClassName?: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
};

export const SearchInput = ({
  className,
  id,
  inputClassName,
  label,
  onChange,
  placeholder,
  value,
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full self-start", className)}>
      <Label className="sr-only" htmlFor={id}>
        {label}
      </Label>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        className={cn("h-10 rounded-2xl pl-9", inputClassName)}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
};
