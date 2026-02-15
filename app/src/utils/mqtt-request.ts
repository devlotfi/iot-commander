import { v4 as uuid } from "uuid";
import {
  MessageType,
  type ActionData,
  type ActionRequest,
  type ActionResponse,
} from "../types/action-call";
import type { MqttClient } from "mqtt";

export function mqttRequest<T = ActionData>({
  client,
  requestTopic,
  responseTopic,
  action,
  parameters,
  timeoutMs = 10000,
}: {
  client: MqttClient;
  requestTopic: string;
  responseTopic: string;
  action: string;
  parameters: ActionData;
  timeoutMs?: number;
}): Promise<ActionResponse<T>> {
  return new Promise((resolve, reject) => {
    const requestId = uuid();
    let finished = false;

    const cleanup = () => {
      if (finished) return;
      finished = true;

      clearTimeout(timeout);
      client.removeListener("message", handler);
      client.unsubscribe(responseTopic);
    };

    const handler = (_topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());

        if (payload.requestId !== requestId) return;

        cleanup();

        if (payload.status === "ERROR") {
          reject(payload);
        } else {
          resolve(payload);
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`MQTT request timeout (${timeoutMs}ms)`));
    }, timeoutMs);

    client.on("message", handler);

    // Wait for subscribe to succeed before publishing
    client.subscribe(responseTopic, (err: Error | null) => {
      if (err) {
        cleanup();
        reject(err);
        return;
      }

      client.publish(
        requestTopic,
        JSON.stringify({
          requestId,
          type: MessageType.REQUEST,
          action,
          parameters,
        } as ActionRequest),
      );
    });
  });
}
