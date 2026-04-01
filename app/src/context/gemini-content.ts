import { GoogleGenAI } from "@google/genai";
import { createContext } from "react";

interface GeminiContext {
  ai: GoogleGenAI | null;
  apiSecret: string | null;
}

export const GeminiContextInitialValue: GeminiContext = {
  ai: null,
  apiSecret: null,
};

export const GeminiContext = createContext(GeminiContextInitialValue);
