import { Button } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <Button variant="primary">lo segseg seges</Button>
      <div className="flex flex-col">
        <div className="flex text-[200pt]">lolllll</div>
        <div className="flex text-[200pt]">lolllll</div>
        <div className="flex text-[200pt]">lolllll</div>
        <div className="flex text-[200pt]">lolllll</div>
        <div className="flex text-[200pt]">lolllll</div>
      </div>
    </div>
  );
}
