import { CircleOff } from "lucide-react";

export default function EmptyActionRow() {
  return (
    <div className="flex items-center gap-[1rem] opacity-70">
      <CircleOff className="text-accent size-[1.5rem]"></CircleOff>
      <div className="flex text-accent font-medium">Empty</div>
    </div>
  );
}
