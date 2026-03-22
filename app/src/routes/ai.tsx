import { createFileRoute } from "@tanstack/react-router";
import RequiredConnectionProvider from "../provider/required-connection-provider";
import { useContext } from "react";
import { MqttContext } from "../context/mqtt-context";
import {
  ResponseStatus,
  type IOTCAction,
  type IOTCQuery,
} from "../types/handler-call";
import { useDiscoverDevices } from "../hooks/use-dsicover-devices";
import { useQueries } from "@tanstack/react-query";
import { mqttQuery } from "../utils/mqtt-query";
import { deviceSchemasToGeminiFunctions } from "../test";

export const Route = createFileRoute("/ai")({
  component: RouteComponent,
});

function AIDasboard() {
  const { devices } = useDiscoverDevices();
  const { connectionData } = useContext(MqttContext);
  if (!connectionData) throw new Error("No connection");

  const deviceSchemaQueries = useQueries({
    queries: devices.map((device) => ({
      queryKey: ["SCHEMA", device.id],
      queryFn: async () => {
        const res = await mqttQuery<{
          queries: IOTCQuery[];
          actions: IOTCAction[];
        }>({
          client: connectionData.client,
          requestTopic: device.requestTopic,
          responseTopic: device.responseTopic,
          query: "__SCHEMA__",
        });
        console.log("res", res);

        if (res.status === ResponseStatus.ERROR) throw new Error(res.code);

        return {
          id: device.id,
          name: device.name,
          requestTopic: device.requestTopic,
          responseTopic: device.responseTopic,
          ...res.results,
        };
      },
    })),
  });

  return (
    <div className="flex flex-col">
      <div>Hello "/ai"! {JSON.stringify(devices)}</div>
      <div className="flex">Schema</div>
      <div className="flex">
        {JSON.stringify(deviceSchemaQueries.map((query) => query.data))}
      </div>

      <div className="flex">Gemini</div>
      <div className="flex">
        {JSON.stringify(
          deviceSchemasToGeminiFunctions(
            deviceSchemaQueries
              .map((query) => query.data)
              .filter((item) => item !== undefined),
          ),
        )}
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <RequiredConnectionProvider>
      <AIDasboard></AIDasboard>
    </RequiredConnectionProvider>
  );
}
