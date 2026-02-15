import "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import PWAProvider from "./provider/pwa-provider";
import { ThemeProvider } from "./provider/theme-provider";
import AppProvider from "./provider/app-provider";
import NotFound from "./components/not-found";
import RxDBProvider from "./provider/rxdb-provider";
import MqttProvider from "./provider/mqtt-provider";

const history = createHashHistory();

const router = createRouter({
  routeTree,
  history,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex flex-col md:flex-row min-h-dvh min-w-dvw max-h-dvh max-w-dvw overflow-hidden bg-main">
      <QueryClientProvider client={queryClient}>
        <Toast.Provider placement="top"></Toast.Provider>
        <PWAProvider>
          <ThemeProvider>
            <AppProvider>
              <RxDBProvider>
                <MqttProvider>
                  <RouterProvider router={router}></RouterProvider>
                </MqttProvider>
              </RxDBProvider>
            </AppProvider>
          </ThemeProvider>
        </PWAProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>,
);
