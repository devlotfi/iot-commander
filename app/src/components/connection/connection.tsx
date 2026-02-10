import { Button, Card, useOverlayState } from "@heroui/react";
import { useContext } from "react";
import { MqttContext } from "../../context/mqtt-context";
import type { ConnectionDocType } from "../../rxdb/connection";
import DeleteConnectionModal from "./delete-connection-modal";
import EditConnectionModal from "./edit-connection-modal";
import DataRow from "../data-row";
import { useMutation } from "@tanstack/react-query";
import PasswordModal from "./password-modal";
import { useTranslation } from "react-i18next";
import { Pen, Trash } from "lucide-react";

interface ConnectionProps {
  connection: ConnectionDocType;
}

export default function Connection({ connection }: ConnectionProps) {
  const { t } = useTranslation();
  const { connectionData, mqttConnect, mqttDisconnect } =
    useContext(MqttContext);

  const editState = useOverlayState();
  const deleteState = useOverlayState();
  const passwordState = useOverlayState();

  const { mutate: mutateConnect, isPending: isPendingConnect } = useMutation({
    mutationFn: async (password?: string) => {
      await mqttConnect(connection, password);
    },
  });
  const { mutate: mutateDisconnect, isPending: isPendingDisconnect } =
    useMutation({
      mutationFn: async () => {
        await mqttDisconnect();
      },
    });

  return (
    <Card className="flex-row relative overflow-visible bg-[color-mix(in_srgb,var(--surface),transparent_80%)] border border-border">
      <Card.Content>
        <DeleteConnectionModal
          state={deleteState}
          connection={connection}
        ></DeleteConnectionModal>
        <EditConnectionModal
          state={editState}
          connection={connection}
        ></EditConnectionModal>
        {connection.username ? (
          <PasswordModal
            state={passwordState}
            onSubmit={(password) => mutateConnect(password)}
          ></PasswordModal>
        ) : null}

        <div className="flex flex-col md:flex-row pr-[1.5rem] gap-[1rem]">
          <div className="flex flex-col flex-1">
            <div className="flex font-bold text-[15pt] break-all">
              {connection.name}
            </div>
            <DataRow name="URL" value={connection.url}></DataRow>
            <DataRow name="Topic" value={connection.discoveryTopic}></DataRow>
            <DataRow
              name="Response topic"
              value={connection.responseDiscoveryTopic}
            ></DataRow>

            {connection.username ? (
              <>
                <div className="flex font-bold text-[12pt]">
                  {t("authenthication")}
                </div>
                <DataRow
                  name={t("username")}
                  value={connection.username}
                ></DataRow>
              </>
            ) : null}
          </div>

          <div className="flex md:flex-col gap-[0.3rem]">
            <Button
              isIconOnly
              variant="outline"
              className="bg-[color-mix(in_srgb,var(--surface),transparent_80%)]"
              onPress={() => editState.open()}
            >
              <Pen></Pen>
            </Button>
            <Button
              isIconOnly
              variant="danger-soft"
              onPress={() => deleteState.open()}
            >
              <Trash></Trash>
            </Button>
          </div>
        </div>
      </Card.Content>

      <div className="flex items-center">
        <h1>lol</h1>
      </div>
    </Card>
  );
}
