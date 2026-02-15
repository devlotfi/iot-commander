import { CircleOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmptyActionRow() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-[1rem] opacity-60">
      <CircleOff className="size-[1.5rem]"></CircleOff>
      <div className="flex font-medium">{t("empty")}</div>
    </div>
  );
}
