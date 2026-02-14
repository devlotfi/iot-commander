import { CircleOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EmptyActionRow() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-[1rem] opacity-70">
      <CircleOff className="text-accent size-[1.5rem]"></CircleOff>
      <div className="flex text-accent font-medium">{t("empty")}</div>
    </div>
  );
}
