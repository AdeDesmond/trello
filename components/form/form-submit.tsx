"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface FormSubmitProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "link"
    | "ghost"
    | "primary"
    | "secondary";
}

export const FormSubmit = ({
  children,
  disabled,
  className,
}: FormSubmitProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      type="submit"
      disabled={pending || disabled}
      variant={"primary"}
      className={cn("w-full", className)}
    >
      {children}
    </Button>
  );
};
