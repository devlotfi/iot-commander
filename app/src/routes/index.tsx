import { Spinner } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SectionHeader from "../components/section-header";
import DeviceComponent from "../components/device-component";
import SearchSVG from "../components/svg/SearchSVG";
import RequiredConnectionProvider from "../provider/required-connection-provider";
import { useDiscoverDevices } from "../hooks/use-dsicover-devices";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function DeviceList() {
  const { t } = useTranslation();
  const { devices } = useDiscoverDevices();

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex flex-1 flex-col max-w-screen-lg w-full">
        <div className="flex justify-between items-center z-10 py-[1rem] px-[2rem]">
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
          </div>
        ) : (
          <div className="flex flex-1 text-center justify-center items-center flex-col gap-[1rem] px-[0.5rem]">
            <SearchSVG className="h-[12rem] md:h-[15rem]" />
            <div className="flex text-[18pt] font-bold uppercase">
              {t("searching")}...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <RequiredConnectionProvider>
      <DeviceList></DeviceList>
    </RequiredConnectionProvider>
  );
}
