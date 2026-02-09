import { Button, cn } from "@heroui/react";
import { ChevronsLeft } from "lucide-react";
import LogoSVG from "../assets/logo.svg";
import { useContext } from "react";
import { AppContext } from "../context/app-context";

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);

  return (
    <div className="flex justify-between items-center h-[4rem] px-[1rem] rounded-bl-4xl rounded-br-4xl md:rounded-none bg-[color-mix(in_srgb,var(--surface),transparent_85%)] border-b">
      <div className="flex items-center gap-[1rem]">
        <Button
          isIconOnly
          variant="outline"
          className="hidden lg:flex rounded-full bg-[color-mix(in_srgb,var(--surface),transparent_80%)]"
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
    </div>
  );
}
