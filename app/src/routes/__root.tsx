import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import BottomTabs from "../components/bottom-tabs";
import { ScrollShadow } from "@heroui/react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="flex flex-1">
        <Sidebar></Sidebar>
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar></Navbar>
          <ScrollShadow
            className="flex h-[calc(100dvh-4rem-5rem)] md:h-[calc(100dvh-4rem)] min-w-0 overflow-x-hidden overflow-y-auto"
            style={{
              scrollbarColor:
                "color-mix(in srgb, var(--accent), transparent 30%) color-mix(in srgb, var(--surface), transparent 80%)",
              scrollbarWidth: "thin",
            }}
          >
            <Outlet />
          </ScrollShadow>
          <BottomTabs></BottomTabs>
        </div>
      </div>
    </React.Fragment>
  );
}
