import { Button, Card, Surface, useOverlayState } from "@heroui/react";
import { ResponseStatus, type Action } from "../../types/action-call";
import { useContext } from "react";
import { MqttContext } from "../../context/mqtt-context";
import { useRouteContext } from "@tanstack/react-router";
import VariableRow from "./variable-row";
import { Play } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mqttRequest } from "../../utils/mqtt-request";
import EmptyActionRow from "./empty-action-row";
import ActionParamsModal from "./action-params-modal";

interface ManualFetchActionProps {
  action: Action;
}

export default function ManualFetchAction({ action }: ManualFetchActionProps) {
  const { connectionData } = useContext(MqttContext);
  const { device } = useRouteContext({ from: "/device" });
  const state = useOverlayState();
  if (!connectionData || !device) throw new Error("Missing data");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await mqttRequest({
        client: connectionData.client,
        requestTopic: device.requestTopic,
        responseTopic: device.responseTopic,
        action: action.name,
        parameters: {},
      });

      if (res.status === ResponseStatus.ERROR) throw new Error(res.code);
      console.log("res", res.results);

      return res.results;
    },
  });

  return (
    <>
      {action.parameters.length ? (
        <ActionParamsModal state={state} action={action}></ActionParamsModal>
      ) : null}

      <Card className="p-[0.5rem] md:p-[1rem]">
        <Card.Content>
          <div className="flex items-center justify-between">
            <div className="flex text-[13pt] font-bold pb-[1rem]">
              {action.name}
            </div>

            <Button
              isIconOnly
              variant="primary"
              isPending={isPending}
              style={{
                boxShadow:
                  "color-mix(in srgb, var(--accent), transparent 30%) 0 0 3rem 0",
              }}
              onPress={() => {
                if (action.parameters.length) {
                  state.open();
                } else {
                  mutate();
                }
              }}
            >
              <Play></Play>
            </Button>
          </div>

          <div className="flex text-[12pt] font-medium opacity-70">
            Parameters
          </div>
          <Surface className="flex flex-col gap-[0.5rem] p-[0.5rem]">
            {action.parameters.length ? (
              action.parameters.map((result, index) => (
                <VariableRow
                  key={`${result.name}-${index}`}
                  variable={result}
                ></VariableRow>
              ))
            ) : (
              <EmptyActionRow></EmptyActionRow>
            )}
          </Surface>

          <div className="flex text-[12pt] font-medium opacity-70">Results</div>
          <Surface className="flex flex-col gap-[0.5rem] p-[0.5rem]">
            {action.results.length ? (
              action.results.map((result, index) => (
                <VariableRow
                  key={`${result.name}-${index}`}
                  variable={result}
                  value={"N/A"}
                ></VariableRow>
              ))
            ) : (
              <EmptyActionRow></EmptyActionRow>
            )}
          </Surface>
        </Card.Content>
      </Card>
    </>
  );
}
