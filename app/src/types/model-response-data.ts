import type { FunctionCall } from "@google/genai";
import type { HandlerData } from "./handler-call";
import type { FunctionMeta } from "../utils/gemini-schema";

export interface ModelResponseData {
  functionCall: FunctionCall;
  originalFunction: FunctionMeta;
  data: HandlerData;
}
