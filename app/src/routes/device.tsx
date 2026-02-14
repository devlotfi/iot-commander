import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useContext } from "react";
import { MqttContext } from "../context/mqtt-context";
import ChipSVG from "../assets/chip.svg";
import EmptySVG from "../assets/empty.svg";
import { Card, Tabs } from "@heroui/react";
import DataRow from "../components/data-row";
import { ResponseStatus, type Action } from "../types/action-call";
import { useQuery } from "@tanstack/react-query";
import { mqttRequest } from "../utils/mqtt-request";
import AutoFetchAction from "../components/action/auto-fetch-action";
import LoadingScreen from "../components/loading-screen";
import ManualFetchAction from "../components/action/manual-fetch-action";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/device")({
  component: RouteComponent,
});

function EmptyList() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[1rem] items-center py-[3rem]">
      <img src={EmptySVG} alt="empty" className="h-[10rem]" />
      <div className="flex uppercase font-bold text-[20pt] doto-font">
        {t("empty")}
      </div>
    </div>
  );
}

function DeviceSchema() {
  const { t } = useTranslation();
  const { connectionData } = useContext(MqttContext);
  const { device } = Route.useRouteContext();
  if (!connectionData || !device) throw new Error("Missing data");

  const { data, isLoading } = useQuery({
    queryKey: ["SCHEMA"],
    queryFn: async () => {
      const res = await mqttRequest<{
        actions: Action[];
      }>({
        client: connectionData.client,
        requestTopic: device.requestTopic,
        responseTopic: device.responseTopic,
        action: "__SCHEMA__",
        parameters: {},
      });
      console.log("res", res);

      if (res.status === ResponseStatus.ERROR) throw new Error(res.code);

      return res.results.actions;
    },
  });

  if (isLoading || !data) return <LoadingScreen></LoadingScreen>;

  const autoFetchAction = data.filter((action) => action.autoFetch);
  const manualActions = data.filter((action) => !action.autoFetch);

  return (
    <Tabs className="mt-[3rem]">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          <Tabs.Tab id="auto-fetch">
            {t("autoFetch")}
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="manual-fetch">
            {t("manual")}
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="auto-fetch">
        <div className="flex flex-col gap-[1rem]">
          {autoFetchAction.length ? (
            autoFetchAction.map((action, index) => (
              <AutoFetchAction
                key={`${action.name}-${index}`}
                action={action}
              ></AutoFetchAction>
            ))
          ) : (
            <EmptyList></EmptyList>
          )}
        </div>
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="manual-fetch">
        <div className="flex flex-col gap-[1rem]">
          {manualActions.length ? (
            manualActions.map((action, index) => (
              <ManualFetchAction
                key={`${action.name}-${index}`}
                action={action}
              ></ManualFetchAction>
            ))
          ) : (
            <EmptyList></EmptyList>
          )}
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

function RouteComponent() {
  const { connectionData } = useContext(MqttContext);
  const { device } = Route.useRouteContext();

  if (!connectionData || !device) return <Navigate to="/"></Navigate>;

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-1 flex-col max-w-screen-md w-full px-[1rem] pb-[5rem]">
        <div className="flex flex-col pt-[5rem] pb-[2rem] gap-[2rem]">
          <div className="flex relative justify-center items-center">
            <img src={ChipSVG} alt="chip" className="h-[7rem] z-10" />
            <div className="flex absolute h-[10rem] w-[15rem] rounded-full bg-accent blur-2xl opacity-20"></div>
          </div>

          <div className="flex justify-center font-bold text-[20pt] z-10 doto-font">
            {device.name}
          </div>
        </div>

        <Card>
          <Card.Content>
            <DataRow name="ID" value={device.id}></DataRow>
            <DataRow name="Request topic" value={device.requestTopic}></DataRow>
            <DataRow
              name="Response topic"
              value={device.responseTopic}
            ></DataRow>
          </Card.Content>
        </Card>

        <DeviceSchema></DeviceSchema>
      </div>
    </div>
  );
}
