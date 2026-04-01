import type { PropsWithChildren } from "react";
import {
  GeminiContext,
  GeminiContextInitialValue,
} from "../context/gemini-content";
import { useQuery } from "@tanstack/react-query";
import { Constants } from "../constants";
import { GoogleGenAI } from "@google/genai";

export default function GeminiProvider({ children }: PropsWithChildren) {
  const { data } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["GEMINI_SECRET"],
    queryFn: async () => {
      const apiSecret = localStorage.getItem(
        Constants.GEMINI_SECRET_STORAGE_KEY,
      );
      return {
        apiSecret,
        ai: apiSecret ? new GoogleGenAI({ apiKey: apiSecret }) : null,
      };
    },
  });

  return (
    <GeminiContext.Provider
      value={{
        ai: data?.ai || GeminiContextInitialValue.ai,
        apiSecret: data?.apiSecret || null,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
}
