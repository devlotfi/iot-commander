import { createContext } from "react";
import type { AppRxDatabase } from "../rxdb/rxdb";

interface RxDBContext {
  rxdb: AppRxDatabase;
}

export const RxDBContextInitialValue: RxDBContext = {
  rxdb: {} as AppRxDatabase,
};

export const RxDBContext = createContext(RxDBContextInitialValue);
