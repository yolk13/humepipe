import React from "react";

import { cn } from "@/components/cn";

const fieldControl =
  "w-full rounded-none border-2 border-outline bg-transparent p-xs text-body-lg text-ink transition-colors duration-150 placeholder-transparent focus:border-royal focus:outline-none";

function floatLabel(labelBg: string) {
  return cn(
    "pointer-events-none absolute left-xs z-10 px-1 text-label-md uppercase tracking-wider text-ink-muted transition-all duration-150",
    labelBg,
  );
}

interface FieldInputProps extends React.ComponentProps<"input"> {
  label: string;
  labelBg?: string;
}

export function FieldInput({ label, id, className, labelBg = "bg-surface-lowest", ...props }: FieldInputProps) {
  return (
    <div className="relative pt-sm">
      <input
        id={id}
        placeholder=" "
        className={cn(fieldControl, "peer", className)}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          floatLabel(labelBg),
          "top-1/2 -translate-y-1/2",
          "peer-focus:-translate-y-[150%] peer-focus:scale-90 peer-focus:text-royal",
          "peer-[:not(:placeholder-shown)]:-translate-y-[150%] peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-royal",
        )}
      >
        {label}
      </label>
    </div>
  );
}

interface FieldTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  labelBg?: string;
}

export function FieldTextarea({ label, id, className, labelBg = "bg-surface-lowest", ...props }: FieldTextareaProps) {
  return (
    <div className="relative pt-sm">
      <textarea
        id={id}
        placeholder=" "
        className={cn(fieldControl, "peer resize-none", className)}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          floatLabel(labelBg),
          "top-2",
          "peer-focus:text-royal peer-[:not(:placeholder-shown)]:text-royal",
        )}
      >
        {label}
      </label>
    </div>
  );
}

interface FieldSelectProps extends React.ComponentProps<"select"> {
  label: string;
  labelBg?: string;
  controlBg?: string;
}

export function FieldSelect({
  label,
  id,
  className,
  labelBg = "bg-surface-lowest",
  controlBg = "bg-surface-lowest",
  children,
  ...props
}: FieldSelectProps) {
  return (
    <div className="relative pt-sm">
      <select
        id={id}
        className={cn(
          fieldControl,
          "appearance-none pr-lg",
          controlBg,
          className,
        )}
        {...props}
      >
        <option value="" disabled hidden />
        {children}
      </select>
      <label htmlFor={id} className={cn(floatLabel(labelBg), "top-2 text-royal")}>
        {label}
      </label>
      <span
        className="pointer-events-none absolute right-xs top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      >
        ▾
      </span>
    </div>
  );
}
