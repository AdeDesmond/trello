"use client";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface FormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const FormPopover = ({
  children,
  side,
  sideOffset = 0,
  align,
}: FormPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="text-xs max-w-80 pt-3"
      >
        <div className="text-sm font-medium text-neutral-600 text-center pb-4">
          Create new board
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2r absolute top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form>
          <div className="space-y-4">
            <FormInput id="title" label="Board title" type="text" />
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};
