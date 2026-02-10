import { Button, cn, Popover } from "@heroui/react";
import { Cable, ChevronsLeft, CircleOff, Unplug } from "lucide-react";
import LogoSVG from "../assets/logo.svg";
import { useContext } from "react";
import { AppContext } from "../context/app-context";
import { MqttContext } from "../context/mqtt-context";
import DataRow from "./data-row";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const { connectionData } = useContext(MqttContext);

  return (
    <div className="flex justify-between items-center h-[4rem] px-[1rem] rounded-bl-4xl rounded-br-4xl md:rounded-none bg-[color-mix(in_srgb,var(--surface),transparent_85%)] border-b">
      <div className="flex items-center gap-[1rem]">
        <Button
          isIconOnly
          variant="outline"
          className="hidden lg:flex bg-[color-mix(in_srgb,var(--surface),transparent_80%)]"
          size="lg"
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronsLeft
            className={cn(
              "h-[1.5rem] w-[1.5rem] text-foreground duration-300",
              !sidebarOpen && "rotate-180",
            )}
          />
        </Button>
        <img src={LogoSVG} alt="logo" className="h-[3.3rem]" />
        <div
          className="flex font-bold text-[17pt]"
          style={{ fontFamily: "Doto" }}
        >
          IOT COMMANDER
        </div>
      </div>

      <div className="flex">
        <Popover>
          <Button
            isIconOnly
            variant="outline"
            className={cn(
              "size-[2.5rem] text-foreground",
              connectionData
                ? connectionData.isConnected
                  ? "bg-[color-mix(in_srgb,var(--success),transparent_60%)]"
                  : "bg-[color-mix(in_srgb,var(--danger),transparent_60%)]"
                : "bg-[color-mix(in_srgb,var(--surface),transparent_60%)]",
            )}
          >
            {connectionData ? (
              connectionData.isConnected ? (
                <Cable className="size-[1.4rem]"></Cable>
              ) : (
                <Unplug className="size-[1.4rem]"></Unplug>
              )
            ) : (
              <CircleOff className="size-[1.4rem]"></CircleOff>
            )}
          </Button>

          <Popover.Content className="max-w-64 min-w-64">
            <Popover.Dialog>
              {connectionData ? (
                connectionData.isConnected ? (
                  <>
                    <Popover.Heading className="text-success">
                      {t("connected")}
                    </Popover.Heading>
                    <div className="flex flex-col mt-2 text-sm text-muted">
                      <DataRow
                        name={t("name")}
                        value={connectionData.info.name}
                        fold
                      ></DataRow>
                      {connectionData.info.username ? (
                        <DataRow
                          name={t("username")}
                          value={connectionData.info.username}
                          fold
                        ></DataRow>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <Popover.Heading className="text-danger">
                      {t("connected")}
                    </Popover.Heading>
                    <div className="flex flex-col mt-2 text-sm text-muted">
                      <DataRow
                        name={t("name")}
                        value={connectionData.info.name}
                        fold
                      ></DataRow>
                      {connectionData.info.username ? (
                        <DataRow
                          name={t("username")}
                          value={connectionData.info.username}
                          fold
                        ></DataRow>
                      ) : null}
                    </div>
                  </>
                )
              ) : (
                <>
                  <Popover.Heading className="text-foreground">
                    {t("disconnected")}
                  </Popover.Heading>
                  <div className="flex flex-col mt-2 text-sm text-muted">
                    You are not connected to any broker
                  </div>
                </>
              )}
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}
