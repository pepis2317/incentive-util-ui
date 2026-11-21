"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export const Combobox = ComboboxPrimitive.Root;

export const ComboboxValue = (props: ComboboxPrimitive.Value.Props) => (
  <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
);

export const ComboboxTrigger = (props: ComboboxPrimitive.Trigger.Props) => {
  const { className, children, ...rest } = props;

  return (
    <ComboboxPrimitive.Trigger
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      data-slot="combobox-trigger"
      {...rest}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className="text-muted-foreground size-4 pointer-events-none"
      />
    </ComboboxPrimitive.Trigger>
  );
};

export const ComboboxClear = (props: ComboboxPrimitive.Clear.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Clear
      aria-label="Clear"
      className={cn("", className)}
      data-slot="combobox-clear"
      render={<InputGroupButton size="icon-xs" variant="ghost" />}
      {...rest}
    >
      <XIcon
        aria-hidden="true"
        className="pointer-events-none"
      />
    </ComboboxPrimitive.Clear>
  );
};

export const ComboboxInput = (
  props: ComboboxPrimitive.Input.Props & {
    /** Shows the button that opens the list. */
    showTrigger?: boolean;
    /** Shows a button that clears the input. */
    showClear?: boolean;
  }
) => {
  const {
    className,
    children,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...rest
  } = props;

  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...rest}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger ? (
          <InputGroupButton
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            data-slot="input-group-button"
            disabled={disabled}
            render={<ComboboxTrigger />}
            size="icon-xs"
            variant="ghost"
          />
        ) : null}
        {showClear ? <ComboboxClear disabled={disabled} /> : null}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
};

export const ComboboxContent = (
  props: ComboboxPrimitive.Popup.Props &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
    >
) => {
  const {
    className,
    side = "bottom",
    sideOffset = 6,
    align = "start",
    alignOffset = 0,
    anchor,
    ...rest
  } = props;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          className={cn("bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 overflow-hidden rounded-lg shadow-md ring-1 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none data-[side=inline-start]:slide-in-from-end-2 data-[side=inline-end]:slide-in-from-start-2 group/combobox-content relative max-h-(--available-height) w-(--anchor-width) min-w-[calc(var(--anchor-width)+--spacing(7))] max-w-(--available-width) origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)", className)}
          data-chips={!!anchor}
          data-slot="combobox-content"
          {...rest}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};

export const ComboboxList = (props: ComboboxPrimitive.List.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.List
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 p-1 data-empty:p-0 overflow-y-auto overscroll-contain",
        className
      )}
      data-slot="combobox-list"
      {...rest}
    />
  );
};

export const ComboboxItem = (props: ComboboxPrimitive.Item.Props) => {
  const { className, children, ...rest } = props;

  return (
    <ComboboxPrimitive.Item
      className={cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground gap-2 rounded-md py-1 pe-8 ps-1.5 text-sm [&_svg:not([class*='size-'])]:size-4 relative flex w-full cursor-default select-none items-center outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="combobox-item"
      {...rest}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={<span className="pointer-events-none absolute end-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon
          aria-hidden="true"
          className="pointer-events-none"
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
};

export const ComboboxGroup = (props: ComboboxPrimitive.Group.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Group
      className={cn("", className)}
      data-slot="combobox-group"
      {...rest}
    />
  );
};

export const ComboboxLabel = (props: ComboboxPrimitive.GroupLabel.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.GroupLabel
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      data-slot="combobox-label"
      {...rest}
    />
  );
};

export const ComboboxCollection = (
  props: ComboboxPrimitive.Collection.Props
) => (
  <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
);

export const ComboboxEmpty = (props: ComboboxPrimitive.Empty.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Empty
      className={cn("text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex", className)}
      data-slot="combobox-empty"
      {...rest}
    />
  );
};

export const ComboboxSeparator = (props: ComboboxPrimitive.Separator.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      data-slot="combobox-separator"
      {...rest}
    />
  );
};

export const ComboboxChips = (
  props: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
    ComboboxPrimitive.Chips.Props
) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Chips
      className={cn("dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-8 flex-wrap items-center gap-1 rounded-lg border bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1", className)}
      data-slot="combobox-chips"
      {...rest}
    />
  );
};

export const ComboboxChip = (
  props: ComboboxPrimitive.Chip.Props & {
    /** Shows a button that removes the chip. */
    showRemove?: boolean;
  }
) => {
  const { className, children, showRemove = true, ...rest } = props;

  return (
    <ComboboxPrimitive.Chip
      className={cn(
        "bg-muted text-foreground flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pe-0 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className
      )}
      data-slot="combobox-chip"
      {...rest}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          // Named for the chip when its text is plain; a richer chip names
          // its own remove through `showRemove={false}` and a button of yours.
          aria-label={
            typeof children === "string" ? `Remove ${children}` : "Remove"
          }
          className="-ms-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          render={<Button size="icon-xs" variant="ghost" />}
        >
          <XIcon
            aria-hidden="true"
            className="pointer-events-none"
          />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
};

export const ComboboxChipsInput = (props: ComboboxPrimitive.Input.Props) => {
  const { className, ...rest } = props;

  return (
    <ComboboxPrimitive.Input
      className={cn(
        "min-w-16 flex-1 outline-none",
        className
      )}
      data-slot="combobox-chip-input"
      {...rest}
    />
  );
};

export const useComboboxAnchor = () =>
  React.useRef<HTMLDivElement | null>(null);
