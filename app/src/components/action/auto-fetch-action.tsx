import { Card, Skeleton, Surface } from "@heroui/react";
import { ResponseStatus, type Action } from "../../types/action-call";
import { useQuery } from "@tanstack/react-query";
import { mqttRequest } from "../../utils/mqtt-request";
import { useContext } from "react";
import { MqttContext } from "../../context/mqtt-context";
import { useRouteContext } from "@tanstack/react-router";
import VariableRow from "./variable-row";
import EmptyActionRow from "./empty-action-row";
import { Braces, SquareFunction } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AutoFetchActionProps {
  action: Action;
}

export default function AutoFetchAction({ action }: AutoFetchActionProps) {
  const { t } = useTranslation();
  const { connectionData } = useContext(MqttContext);
  const { device } = useRouteContext({ from: "/device" });
  if (!connectionData || !device) throw new Error("Missing data");

  const { data, isLoading } = useQuery({
    queryKey: ["ACTION_AUTO_FETCH", action.name],
    queryFn: async () => {
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

  if (isLoading || !data)
    return (
      <Card>
        <Card.Content className="gap-[1rem]">
          <Skeleton className="h-3 w-1/2 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
        </Card.Content>
      </Card>
    );

  return (
    <Card className="p-[0.5rem] md:p-[1rem]">
      <Card.Content>
        <div className="flex items-center gap-[0.5rem] text-[13pt] font-bold pl-[0.5rem] pb-[0.5rem]">
          <SquareFunction className="size-[13pt]"></SquareFunction>
          <div className="flex">{action.name}</div>
        </div>

        <div className="flex items-center gap-[0.5rem] text-[11pt] pl-[0.5rem] opacity-70">
          <Braces className="size-[13pt]"></Braces>
          <div className="flex">{t("results")}</div>
        </div>
        <Surface className="flex flex-col gap-[0.5rem] p-[0.5rem]">
          {action.results.length ? (
            action.results.map((result, index) => (
              <VariableRow
                key={`${result.name}-${index}`}
                variable={result}
                value={
                  data[result.name] !== undefined
                    ? JSON.stringify(data[result.name])
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
  );
}
