import mqtt from "mqtt";
import { createContext, type SetStateAction } from "react";
import type { ConnectionDocType } from "../rxdb/connection";

export interface ConnectionData {
  client: mqtt.MqttClient;
  isConnected: boolean;
  info: ConnectionDocType;
}

interface MqttContext {
  connectionData: ConnectionData | null;
  setConnectionData: (value: SetStateAction<ConnectionData | null>) => void;
  mqttConnect: (connection: ConnectionDocType, password?: string) => void;
  mqttDisconnect: () => void;
}

export const MqttContextInitialValue: MqttContext = {
  connectionData: null,
  setConnectionData() {},
  mqttConnect() {},
  mqttDisconnect() {},
};

export const MqttContext = createContext(MqttContextInitialValue);
