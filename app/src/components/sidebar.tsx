import { motion } from "motion/react";
import { useContext, type PropsWithChildren } from "react";
import { AppContext } from "../context/app-context";
import {
  Button,
  cn,
  Tooltip,
  useMediaQuery,
  type ButtonProps,
} from "@heroui/react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import {
  useMatch,
  useNavigate,
  type FileRouteTypes,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function SidebarButton({
  path,
  icon,
  children,
  className,
  ...props
}: Omit<ButtonProps, "children"> &
  PropsWithChildren<{
    path: FileRouteTypes["to"];
    icon: IconName;
  }>) {
  const navigate = useNavigate();
  const isActive = useMatch({ from: path, shouldThrow: false });
  const { sidebarOpen } = useContext(AppContext);
  const isLarge = useMediaQuery("(min-width: 1024px)");

  return (
    <Tooltip delay={0} isDisabled={isLarge && sidebarOpen}>
      <Button
        variant="ghost"
        className={cn(
          "justify-between h-auto p-[0.4rem] border border-transparent",
          "transition-all duration-300",
          sidebarOpen ? "lg:w-full" : "gap-0 w-auto",
          isActive &&
            "bg-[color-mix(in_srgb,var(--surface),transparent_80%)] border-border",
          className,
        )}
        onPress={() => {
          navigate({ to: path });
        }}
        {...props}
      >
        <>
          <div
            className={cn(
              "flex justify-center items-center min-h-[2.2rem] min-w-[2.2rem] rounded-2xl",
              "transition-colors duration-300",
              isActive && "bg-accent",
            )}
          >
            <DynamicIcon
              name={icon}
              color={
                isActive ? "var(--accent-foreground)" : "var(--foreground)"
              }
              className="h-[1.5rem] w-[1.5rem] transition-colors duration-300"
            />
          </div>

          <motion.div
            initial={false}
            animate={{
              width: sidebarOpen ? "auto" : 0,
              opacity: sidebarOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex overflow-hidden flex-1 justify-center text-center"
          >
            <div
              className={cn(
                "whitespace-nowrap text-[11pt] font-medium text-foreground",
                "transition-colors duration-300",
                isActive && "text-accent",
              )}
            >
              {children}
            </div>
          </motion.div>
        </>
      </Button>

      <Tooltip.Content showArrow placement="right">
        <Tooltip.Arrow />
        {children}
      </Tooltip.Content>
    </Tooltip>
  );
}

export default function Sidebar() {
  const { t } = useTranslation();
  const { sidebarOpen } = useContext(AppContext);

  return (
    <div
      className={cn(
        "hidden md:flex flex-col min-w-[5rem] duration-500 transition-[width]",
        sidebarOpen ? "lg:w-[16rem]" : "w-[5rem]",
      )}
    >
      <div className="flex flex-col flex-1 justify-center items-center gap-[0.5rem] p-[0.7rem]">
        <SidebarButton path="/" icon={"computer"}>
          {t("devices")}
        </SidebarButton>
        <SidebarButton path="/connections" icon={"satellite-dish"}>
          {t("connections")}
        </SidebarButton>
        <SidebarButton path="/settings" icon={"settings"}>
          {t("settings")}
        </SidebarButton>
      </div>
    </div>
  );
}
