import { Alert } from "@heroui/react";
import ErrorSVG from "../assets/error.svg";
import { useTranslation } from "react-i18next";

export default function ErrorScreen() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <div className="flex flex-col gap-[1rem]">
        <img src={ErrorSVG} alt="error" className="h-[13rem]" />
        <Alert color="danger">{t("errorOccured")}</Alert>
      </div>
    </div>
  );
}
