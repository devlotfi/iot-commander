import { Button, Card, Surface, toast, useOverlayState } from "@heroui/react";
import {
  ResponseStatus,
  type Action,
  type ActionData,
  type ActionErrorResponse,
} from "../../types/action-call";
import { useContext, useState } from "react";
import { MqttContext } from "../../context/mqtt-context";
import { useRouteContext } from "@tanstack/react-router";
import VariableRow from "./variable-row";
import { Check, InfoIcon, Play } from "lucide-react";
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
  const [results, setResults] = useState<ActionData>({});
  if (!connectionData || !device) throw new Error("Missing data");
  const { mutate, isPending } = useMutation({
    mutationFn: async (parameters: ActionData) => {
      const res = await mqttRequest({
        client: connectionData.client,
        requestTopic: device.requestTopic,
        responseTopic: device.responseTopic,
        action: action.name,
        parameters,
      });

      if (res.status === ResponseStatus.ERROR) throw new Error(res.code);
      console.log("res", res.results);

      return res.results;
    },
    onSuccess(data) {
      setResults(data);
      toast("Action successful", {
        indicator: <Check />,
        variant: "success",
      });
    },
    onError(error: ActionErrorResponse) {
      toast(`Error: ${error.code}`, {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
  });

  return (
    <>
      {action.parameters.length ? (
        <ActionParamsModal
          state={state}
          action={action}
          onSubmit={(actionData) => {
            mutate(actionData);
            state.close();
          }}
        ></ActionParamsModal>
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
                  mutate({});
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
              action.parameters.map((parameter, index) => (
                <VariableRow
                  key={`${parameter.name}-${index}`}
                  variable={parameter}
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
                  value={
                    results[result.name]
                      ? JSON.stringify(results[result.name])
                      : "N/A"
                  }
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
