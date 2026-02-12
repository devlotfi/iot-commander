import { Button, useOverlayState } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { RxDBContext } from "../context/rxdb-context";
import EmptySVG from "../assets/empty.svg";
import LoadingScreen from "../components/loading-screen";
import ErrorScreen from "../components/error-screen";
import { useTranslation } from "react-i18next";
import SectionHeader from "../components/section-header";
import { Plus } from "lucide-react";
import AddConnectionModal from "../components/connection/add-connection-modal";
import ConnectionComponent from "../components/connection/connection-component";

export const Route = createFileRoute("/connections")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const { rxdb } = useContext(RxDBContext);

  const addConnectionModalState = useOverlayState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["CONNECTIONS"],
    queryFn: async () => {
      const data = await rxdb.connections.find().exec();
      return data;
    },
  });

  return (
    <>
      <AddConnectionModal state={addConnectionModalState}></AddConnectionModal>

      <div className="flex flex-1 flex-col items-center">
        <div className="flex flex-1 flex-col max-w-screen-md w-full">
          <div className="flex justify-between items-center z-10 py-[1rem] px-[1rem]">
            <SectionHeader icon="satellite-dish">
              {t("connections")}
            </SectionHeader>

            <Button
              isIconOnly
              variant="outline"
              className="size-[3rem] text-foreground bg-[color-mix(in_srgb,var(--surface),transparent_85%)]"
              onPress={() => addConnectionModalState.open()}
            >
              <Plus className="size-[2rem]"></Plus>
            </Button>
          </div>

          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : isError ? (
            <ErrorScreen></ErrorScreen>
          ) : data && data.length ? (
            <div className="flex flex-col flex-1 mt-[0.5rem] gap-[1rem] pl-[1rem] pr-[2.5rem] pb-[5rem]">
              {data.map((connection) => (
                <ConnectionComponent
                  key={connection.id}
                  connection={connection}
                ></ConnectionComponent>
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
                {t("noConnections.title")}
              </div>
              <div className="flex text-[13pt] opacity-70">
                {t("noConnections.subTitle")}
              </div>
              <Button
                variant="primary"
                onPress={() => addConnectionModalState.open()}
              >
                <Plus></Plus>
                {t("addConnection")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
