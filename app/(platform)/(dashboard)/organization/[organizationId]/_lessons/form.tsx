"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

export const Form = function () {
  const initialState = {
    errors: {},
    message: null,
  };
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "success!");
    },
    onError: (error) => {
      console.log(error, "error!");
    },
  });
  const onSubmit = (formdata: FormData) => {
    const title = formdata.get("title") as string;
    execute({ title });
  };
  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors} id="title" label="Board title" />
      </div>
      <FormSubmit> Save </FormSubmit>
    </form>
  );
};
