import type { AppTranslation } from "../types/app-translation";

export const EN: AppTranslation = {
  devices: "Devices",
  connections: "Connections",
  settings: "Settings",
  add: "Add",
  edit: "Edit",
  delete: "Delete",
  noConnection: "Not connected",

  deleteConfirmation: "Are you sure you want to delete this item?",
  cancel: "Cancel",

  addDevice: "Add device",
  editDevice: "Edit device",
  deleteDevice: "Delete device",
  name: "Name",
  macAddress: "MAC address",
  ipAddressIOptional: "IP address (optional: used for ping)",

  addConnection: "Add connection",
  editConnection: "Edit connection",
  deleteConnection: "Delete connection",
  authenthication: "Authentication",
  useAuthenthication: "Use authentication",
  username: "Username",
  connectionAuthenthication: "Connection authentication",
  password: "Password",
  connect: "Connect",
  connected: "Connected",
  disconnected: "Disconnected",
  close: "Close",

  theme: "Theme",
  system: "System",
  light: "Light",
  dark: "Dark",
  language: "Language",

  loading: "Loading...",
  error: "Error",
  errorOccured: "An error occurred",
  noContent: "No content",
  connectionError:
    "An error occurred during the connection. Please check your credentials and network.",
  noResponse: "No response",
  timeoutMessage: "The timeout has expired and no response was received",
  wolSent: "The WOL (Wake-on-LAN) was sent",
  install: "Install",

  notFound: "Not found",
  landingPage: "Home page",

  noDevices: {
    title: "No devices",
    subTitle: "Start by adding devices",
  },
  noConnections: {
    title: "No connections",
    subTitle: "Start by adding MQTT broker connections",
  },
};
