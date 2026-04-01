import { Avatar, Card } from "@heroui/react";
import { type Content } from "@google/genai";
import { Check, User } from "lucide-react";

export default function UserMessage({ content }: { content: Content }) {
  return (
    content.parts?.map((part, index) => {
      return (
        <div key={index} className="flex items-center justify-end gap-[0.5rem]">
          <Card
            className="p-[0.5rem] border-none"
            style={{
              background:
                "color-mix(in srgb, var(--accent), transparent 70%) !important",
              border:
                "color-mix(in srgb, var(--accent), transparent 50%) solid 1px",
              boxShadow:
                "color-mix(in srgb, var(--accent), transparent 80%) 0px -3px 0px inset",
            }}
          >
            <Card.Content>
              {part.text ? <div className="flex">{part.text}</div> : null}

              {part.functionResponse ? (
                <div className="flex items-center gap-[0.5rem]">
                  <div className="flex">Function called</div>
                  <Check className="text-accent"></Check>
                </div>
              ) : null}
            </Card.Content>
          </Card>

          <Avatar>
            <Avatar.Fallback>
              <User></User>
            </Avatar.Fallback>
          </Avatar>
        </div>
      );
    }) || null
  );
}
