import type { RxDatabase } from "rxdb";
import type { ConnectionCollection } from "./connection";

export type DatabaseCollections = {
  connections: ConnectionCollection;
};

export type AppRxDatabase = RxDatabase<DatabaseCollections>;
