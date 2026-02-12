import { Button, Spinner } from "@heroui/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext, useEffect, useState } from "react";
import { MqttContext } from "../context/mqtt-context";
import { useTranslation } from "react-i18next";
import { Plug } from "lucide-react";
import ServerSVG from "../assets/server.svg";
import SectionHeader from "../components/section-header";
import type { Device } from "../types/device";
import { MessageType, type ActionRequest } from "../types/action-call";
import { v4 as uuid } from "uuid";
import EmptySVG from "../assets/empty.svg";
import DeviceComponent from "../components/device-component";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function DeviceList() {
  const { t } = useTranslation();
  const { connectionData } = useContext(MqttContext);
  if (!connectionData) throw new Error("No connection");

  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    connectionData.client.subscribe(connectionData.info.responseDiscoveryTopic);

    const handleMessage = (_: string, message: Buffer) => {
      try {
        const msg = message.toString();
        const payload: Device = JSON.parse(msg);
        console.log(payload);

        setDevices((devices) => {
          if (devices.find((device) => device.id === payload.id))
            return devices;
          return [...devices.map((device) => ({ ...device })), payload];
        });
      } catch (error) {
        console.error(error);
      }
    };
    connectionData.client.on("message", handleMessage);

    return () => {
      connectionData.client.removeListener("message", handleMessage);
      connectionData.client.unsubscribe(
        connectionData.info.responseDiscoveryTopic,
      );
    };
  }, [connectionData.client, connectionData.info.responseDiscoveryTopic]);

  useEffect(() => {
    const request: ActionRequest = {
      requestId: uuid(),
      type: MessageType.REQUEST,
      action: "__DISCOVERY__",
      parameters: {},
    };

    connectionData.client.publish(
      connectionData.info.discoveryTopic,
      JSON.stringify(request),
    );
  }, [connectionData.client, connectionData.info.discoveryTopic]);

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-1 flex-col max-w-screen-lg w-full">
        <div className="flex justify-between items-center z-10 py-[1rem] px-[1rem]">
          <SectionHeader icon="cpu">{t("devices")}</SectionHeader>
          <Spinner color="accent" size="lg"></Spinner>
        </div>

        {devices.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[1rem] p-[1rem] pb-[5rem]">
            {devices.map((device, index) => (
              <DeviceComponent
                key={`${device.id}-${index}`}
                device={device}
              ></DeviceComponent>
            ))}
            {devices.map((device, index) => (
              <DeviceComponent
                key={`${device.id}-${index}`}
                device={device}
              ></DeviceComponent>
            ))}
            {devices.map((device, index) => (
              <DeviceComponent
                key={`${device.id}-${index}`}
                device={device}
              ></DeviceComponent>
            ))}
            {devices.map((device, index) => (
              <DeviceComponent
                key={`${device.id}-${index}`}
                device={device}
              ></DeviceComponent>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 text-center justify-center items-center flex-col gap-[1rem] px-[0.5rem]">
            <img
              src={EmptySVG}
              alt="device"
              className="h-[12rem] md:h-[15rem]"
            />
            <div className="flex text-[18pt] font-bold">
              {t("noDevices.title")}
            </div>
            <div className="flex text-[13pt] opacity-70">
              {t("noDevices.subTitle")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RouteComponent() {
  const { t } = useTranslation();
  const { connectionData } = useContext(MqttContext);
  const navigate = useNavigate();

  if (!connectionData)
    return (
      <div className="flex flex-1 text-center justify-center items-center flex-col gap-[1rem] px-[0.5rem]">
        <img src={ServerSVG} alt="device" className="h-[12rem] md:h-[15rem]" />
        <div className="flex text-[18pt] font-bold">{t("disconnected")}</div>
        <div className="flex text-[13pt] opacity-70">
          {t("noConnections.subTitle")}
        </div>
        <Button
          variant="primary"
          onPress={() => navigate({ to: "/connections" })}
        >
          <Plug></Plug>
          {t("connect")}
        </Button>
      </div>
    );

  return <DeviceList></DeviceList>;
}
