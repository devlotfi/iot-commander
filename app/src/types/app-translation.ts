export interface AppTranslation {
  devices: string;
  connections: string;
  settings: string;
  add: string;
  edit: string;
  delete: string;
  noConnection: string;

  deleteConfirmation: string;
  cancel: string;

  addDevice: string;
  editDevice: string;
  deleteDevice: string;
  name: string;
  macAddress: string;
  ipAddressIOptional: string;

  addConnection: string;
  editConnection: string;
  deleteConnection: string;
  authenthication: string;
  useAuthenthication: string;
  username: string;
  connectionAuthenthication: string;
  password: string;
  connect: string;
  connected: string;
  disconnected: string;
  close: string;

  theme: string;
  system: string;
  light: string;
  dark: string;
  language: string;

  loading: string;
  error: string;
  errorOccured: string;
  noContent: string;
  connectionError: string;
  noResponse: string;
  timeoutMessage: string;
  wolSent: string;
  install: string;

  notFound: string;
  landingPage: string;

  noDevices: {
    title: string;
    subTitle: string;
  };
  noConnections: {
    title: string;
    subTitle: string;
  };
}
