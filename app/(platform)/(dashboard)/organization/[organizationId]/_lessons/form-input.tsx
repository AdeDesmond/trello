/*

"use client";

import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

interface FormInputProps {
  errors?: Record<string, any>;
}

export const FormInput = function ({ errors }: FormInputProps) {
  const { pending } = useFormStatus();
  return (
    <div>
      <Input
        type="text"
        name="title"
        id="title"
        required
        placeholder="enter a board title"
        disabled={pending}
      />
      {errors?.title ? (
        <div>
          {errors.title.map((error: string) => (
            <p key={error} className="text-rose-500">
              {" "}
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

*/
