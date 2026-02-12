import { cn } from "@heroui/react";
import type { ComponentProps } from "react";
import {
  ValueType,
  type AllowedTypes,
  type Variable,
} from "../../types/action-call";

interface VariableRowProps extends ComponentProps<"div"> {
  variable: Variable;
  value?: AllowedTypes;
}

export default function VariableRow({
  variable,
  value,
  className,
  ...props
}: VariableRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-[0.3rem] md:flex-row md:gap-[0.5rem] md:mb-0",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 justify-between items-center gap-[0.7rem]">
        <div className="flex gap-[0.5rem]">
          <div className="flex text-[12pt] text-accent gap-[0.5rem]">
            <div className="flex">{variable.type} </div>
            {variable.type === ValueType.ENUM && variable.enumDefinition ? (
              <div className="flex">({variable.enumDefinition.join(", ")})</div>
            ) : null}
          </div>
          <div className="flex text-[12pt] opacity-80">{variable.name}</div>
        </div>
        <div className="flex h-[1px] flex-1 bg-separator"></div>
      </div>
      {value ? (
        <div className="flex items-center text-[12pt] break-all">{value}</div>
      ) : null}
    </div>
  );
}
