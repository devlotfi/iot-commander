import { cn } from "@heroui/react";
import { type IconName, DynamicIcon } from "lucide-react/dynamic";
import type { ComponentProps } from "react";

export default function SectionTitle({
  children,
  icon,
  className,
  iconWrapperProps: {
    className: classNameIconWrapper,
    ...iconWrapperProps
  } = {},
  labelProps: { className: classNameLabel, ...labelProps } = {},
  ...props
}: {
  icon: IconName;
  iconWrapperProps?: ComponentProps<"div">;
  labelProps?: ComponentProps<"div">;
} & ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-[1rem] pb-[1rem]", className)}
      {...props}
    >
      <div
        className={cn(
          "flex justify-center items-center rounded-2xl size-[2.5rem] bg-[color-mix(in_srgb,var(--surface),transparent_85%)] border",
          classNameIconWrapper,
        )}
        style={{
          boxShadow:
            "color-mix(in srgb, var(--surface), transparent 80%) 0px -3px 0px inset",
        }}
        {...iconWrapperProps}
      >
        <DynamicIcon
          name={icon}
          className="text-accent size-[1.6rem]"
        ></DynamicIcon>
      </div>
      <div
        className={cn("flex font-bold text-[16pt] uppercase", classNameLabel)}
        {...labelProps}
      >
        {children}
      </div>
    </div>
  );
}
