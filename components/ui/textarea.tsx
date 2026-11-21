"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import type React from "react";
import { cn } from "@/lib/utils";

export const Textarea = (props: React.ComponentProps<"textarea">) => {
  const { className, ...rest } = props;

  return (
    // Base UI's field control, drawn as a textarea: inside a `Field` it takes
    // the field's state (`aria-invalid` from its `invalid`), as Input does.
    <FieldPrimitive.Control
      className={cn(
        "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 aria-invalid:ring-3 md:text-sm field-sizing-content flex min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="textarea"
      render={<textarea />}
      // The control's props are typed for an `<input>`; these are a
      // textarea's, which it passes on to the element it renders.
      {...(rest as FieldPrimitive.Control.Props)}
    />
  );
};
