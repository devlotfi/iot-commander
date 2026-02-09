import { createContext } from "react";

interface AppContext {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export const AppContextInitialValue: AppContext = {
  sidebarOpen: true,
  setSidebarOpen() {},
};

export const AppContext = createContext(AppContextInitialValue);
