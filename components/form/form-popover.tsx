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
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { usePremiumModal } from "@/hooks/use-premium-modal";

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
  const premiumModal = usePremiumModal();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created");
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
      premiumModal.onOpen();
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;
    if (title) {
      execute({ title, image });
    }
  };
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
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2r absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
