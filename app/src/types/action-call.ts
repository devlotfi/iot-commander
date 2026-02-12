export enum KnownErrors {
  INVALID_MESSAGE_FORMAT = "INVALID_MESSAGE_FORMAT",
  INVALID_MESSAGE_TYPE = "INVALID_MESSAGE_TYPE",
  ACTION_NOT_FOUND = "ACTION_NOT_FOUND",
  PARAMETER_VALIDATION_ERROR = "PARAMETER_VALIDATION_ERROR",
  RESULT_VALIDATION_ERROR = "RESULT_VALIDATION_ERROR",
  INVALID_CHANNEL = "INVALID_CHANNEL",
}

export enum ValueType {
  INT = "INT",
  FLOAT = "FLOAT",
  DOUBLE = "DOUBLE",
  BOOL = "BOOL",
  STRING = "STRING",
  ENUM = "ENUM",
}

export enum Channel {
  DATA = "DATA",
  DISCOVERY = "DISCOVERY",
}

export enum MessageType {
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
}

export enum ResponseStatus {
  OK = "OK",
  ERROR = "ERROR",
}

export interface Variable {
  name: string;
  type: ValueType;
  enumDefinition?: string[];
}

export interface Action {
  name: string;
  autoFetch: boolean;
  parameters: Variable[];
  results: Variable[];
}

export type AllowedTypes = number | boolean | string;

export interface ActionData {
  [key: string]: AllowedTypes;
}

export interface ActionRequest<T = ActionData> {
  requestId: string;
  type: MessageType.REQUEST;
  action: string;
  parameters: T;
}

export interface ActionOkResponse<T = ActionData> {
  requestId: string;
  type: MessageType.RESPONSE;
  status: ResponseStatus.OK;
  results: T;
}

export interface ActionErrorResponse {
  requestId: string;
  type: MessageType.RESPONSE;
  status: ResponseStatus.ERROR;
  code: KnownErrors | string;
}

export type ActionResponse<T = ActionData> =
  | ActionOkResponse<T>
  | ActionErrorResponse;
