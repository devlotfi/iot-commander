import { cn } from "@heroui/react";
import type { ComponentProps } from "react";

interface DataRowProps extends ComponentProps<"div"> {
  name: string;
  value: string;
}

export default function DataRow({
  name,
  value,
  className,
  ...props
}: DataRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:gap-[0.5rem] mb-[0.3rem] md:mb-0",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 justify-between items-center gap-[0.7rem]">
        <div className="flex text-[12pt] opacity-80">{name}:</div>
        <div className="flex h-[1px] flex-1 bg-separator"></div>
      </div>
      <div className="flex text-[12pt] break-all">{value}</div>
    </div>
  );
}
