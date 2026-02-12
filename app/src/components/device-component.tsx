import { Card } from "@heroui/react";
import type { Device } from "../types/device";
import { Cpu } from "lucide-react";
import DataRow from "./data-row";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface DeviceComponentProps {
  device: Device;
}

export default function DeviceComponent({ device }: DeviceComponentProps) {
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <Card
      className="hover:border-accent cursor-pointer duration-200 transition-colors"
      onClick={() => {
        router.update({
          context: {
            device,
          },
        });
        navigate({ to: "/device" });
      }}
    >
      <Cpu
        aria-label="Dollar sign icon"
        className="text-primary size-6"
        role="img"
      />
      <Card.Header>
        <Card.Title>{device.name}</Card.Title>
      </Card.Header>
      <Card.Content>
        <DataRow name="ID" value={device.id} fold></DataRow>
        <DataRow
          name="Request topic"
          value={device.requestTopic}
          fold
        ></DataRow>
        <DataRow
          name="Response topic"
          value={device.responseTopic}
          fold
        ></DataRow>
      </Card.Content>
    </Card>
  );
}
