import Error404SVG from "../assets/error-404.svg";
import { Button, Separator } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col justify-center items-center px-[1rem]">
      <div className="flex flex-col items-center gap-[1rem]">
        <img src={Error404SVG} alt="404" className="h-[10rem]" />
        <div className="flex text-[13pt] font-medium text-center">
          {t("notFound")}
        </div>
        <Separator></Separator>

        <Button
          fullWidth
          variant="outline"
          onPress={() =>
            navigate({
              to: "/",
            })
          }
        >
          <Home></Home>
          {t("landingPage")}
        </Button>
      </div>
    </div>
  );
}
