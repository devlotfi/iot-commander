import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import BottomTabs from "../components/bottom-tabs";

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
          <div className="flex h-[calc(100dvh-4rem-5rem)] md:h-[calc(100dvh-4rem)] min-w-0 rounded-4xl md:rounded-none md:rounded-tl-4xl bg-[color-mix(in_srgb,var(--surface),transparent_95%)] border overflow-x-hidden overflow-y-auto">
            <Outlet />
          </div>
          <BottomTabs></BottomTabs>
        </div>
      </div>
    </React.Fragment>
  );
}
