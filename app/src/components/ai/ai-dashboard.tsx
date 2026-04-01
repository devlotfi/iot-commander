import { useContext, useEffect, useRef, useState } from "react";
import { MqttContext } from "../../context/mqtt-context";
import {
  ResponseStatus,
  type IOTCAction,
  type IOTCQuery,
} from "../../types/handler-call";
import { useDiscoverDevices } from "../../hooks/use-dsicover-devices";
import { useMutation, useQueries } from "@tanstack/react-query";
import { mqttQuery } from "../../utils/mqtt-query";
import { deviceSchemasToGeminiFunctions } from "../../utils/gemini-schema";
import {
  Avatar,
  Button,
  Card,
  ListBox,
  ScrollShadow,
  Select,
  Spinner,
  toast,
} from "@heroui/react";
import { type Content, type Part } from "@google/genai";
import { GeminiContext } from "../../context/gemini-content";
import SectionHeader from "../../components/section-header";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import ValidatedTextField from "../../components/validated-text-field";
import { BrainCircuit, InfoIcon, Mic, Send, Trash } from "lucide-react";
import AISVG from "../../components/svg/AISVG";
import type { DeviceSchema } from "../../types/device";
import UserMessage from "./user-message";
import ModelMessage from "./model-message";
import type { ModelResponseData } from "../../types/model-response-data";

export default function AIDasboard() {
  const { t } = useTranslation();
  const { devices } = useDiscoverDevices();
  const { connectionData } = useContext(MqttContext);
  const { ai } = useContext(GeminiContext);
  if (!connectionData) throw new Error("No connection");
  if (!ai) throw new Error("No ai client");

  const scrollRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<Content[]>([]);
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [contents]);

  /* const { data } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["GEMINI_MODELS"],
    queryFn: async () => {
      const models = await ai.models.list();
      console.log(JSON.stringify(models));
    },
  }); */

  const deviceSchemaQueries = useQueries({
    queries: devices.map((device) => ({
      queryKey: ["SCHEMA", device.id],
      queryFn: async () => {
        const res = await mqttQuery<{
          queries: IOTCQuery[];
          actions: IOTCAction[];
        }>({
          client: connectionData.client,
          requestTopic: device.requestTopic,
          responseTopic: device.responseTopic,
          query: "__SCHEMA__",
        });
        console.log("res", res);

        if (res.status === ResponseStatus.ERROR) throw new Error(res.code);

        return {
          id: device.id,
          name: device.name,
          requestTopic: device.requestTopic,
          responseTopic: device.responseTopic,
          ...res.results,
        } as DeviceSchema;
      },
    })),
  });

  const { functions, lookup } = deviceSchemasToGeminiFunctions(
    deviceSchemaQueries
      .map((query) => query.data)
      .filter((item) => item !== undefined),
  );

  const promptMutation = useMutation({
    mutationFn: async ({ prompt }: { prompt: string }) => {
      const userContent: Content = {
        role: "user",
        parts: [{ text: prompt }] as Part[],
      };
      contentsRef.current = [...contentsRef.current, userContent];
      setContents((contents) => [...contents, userContent]);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: contentsRef.current,
        config: {
          tools: [
            {
              functionDeclarations: functions,
            },
          ],
        },
      });
      if (response.candidates && response.candidates[0].content) {
        const content = response.candidates[0].content;
        console.log(JSON.stringify(response.candidates[0].content));
        contentsRef.current = [...contentsRef.current, content];
        setContents((contents) => [...contents, content]);
      } else {
        console.log("missing data");
      }

      console.log(JSON.stringify(contentsRef.current));
    },
    onError(error) {
      console.error(error);
      toast(`${t("error")}`, {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
  });

  const respondToModelMutation = useMutation({
    mutationFn: async ({ data }: { data: ModelResponseData[] }) => {
      const userContent: Content = {
        role: "user",
        parts: data.map(
          (data) =>
            ({
              functionResponse: {
                name: data.functionCall.name,
                response: data.data,
              },
            }) as Part,
        ),
      };
      console.log("rsponding", userContent);

      contentsRef.current = [...contentsRef.current, userContent];
      setContents((contents) => [...contents, userContent]);
      console.log("responding");

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: contentsRef.current,
        config: {
          tools: [
            {
              functionDeclarations: functions,
            },
          ],
        },
      });
      if (response.candidates && response.candidates[0].content) {
        const content = response.candidates[0].content;
        console.log(JSON.stringify(response.candidates[0].content));
        contentsRef.current = [...contentsRef.current, content];
        setContents((contents) => [...contents, content]);
      } else {
        console.log("missing data");
      }

      console.log(JSON.stringify(contentsRef.current));
    },
    onError(error) {
      console.error(error);
      toast(`${t("error")}`, {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      prompt: "",
    },
    async onSubmit(values, formikHelpers) {
      formikHelpers.resetForm();
      console.log(values);
      promptMutation.mutate(values);
    },
  });

  const renderChat = () => {
    return contents.map((content, index) => {
      if (content.role === "user") {
        return <UserMessage key={index} content={content}></UserMessage>;
      } else if (content.role === "model") {
        return (
          <ModelMessage
            key={index}
            content={content}
            lookup={lookup}
            devices={devices}
            respondToModel={(data) => respondToModelMutation.mutate({ data })}
          ></ModelMessage>
        );
      } else {
        console.error("Unknown role");
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center">
      <div className="flex items-center justify-between p-[1rem] w-full max-w-screen-md">
        <SectionHeader
          icon="brain-circuit"
          className="hidden sm:flex py-0"
          iconWrapperProps={{
            style: {
              boxShadow: "",
            },
          }}
        >
          {t("aiChat")}
        </SectionHeader>

        <div className="flex flex-1 justify-between sm:flex-none sm:justify-normal items-center gap-[0.5rem]">
          <Select aria-label="model" placeholder="Select one">
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="test" textValue="Test">
                  Test
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          <Button
            isIconOnly
            variant="outline"
            size="lg"
            className="bg-[color-mix(in_srgb,var(--surface),transparent_70%)] text-danger"
            onPress={() => setContents([])}
          >
            <Trash></Trash>
          </Button>
        </div>
      </div>
      <ScrollShadow
        ref={scrollRef}
        className="flex flex-col flex-1 w-full items-center px-[1rem]"
      >
        {contents.length ? (
          <div className="flex flex-col w-full gap-[1rem] max-w-screen-md">
            {renderChat()}

            {promptMutation.isPending ? (
              <div className="flex items-center justify-start gap-[0.5rem]">
                <Avatar color="accent">
                  <Avatar.Fallback>
                    <BrainCircuit></BrainCircuit>
                  </Avatar.Fallback>
                </Avatar>

                <Card>
                  <Card.Content>
                    <Spinner color="accent" size="md"></Spinner>
                  </Card.Content>
                </Card>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col flex-1 justify-center items-center w-full max-w-screen-md">
            <div className="flex flex-col items-center gap-[1rem] text-center">
              <AISVG className="h-[14rem]" />
              <div className="flex text-[18pt] font-bold uppercase">
                {t("welcome")}
              </div>
              <div className="flex text-[13pt] opacity-85">
                {t("useTheAIChat")}
              </div>
            </div>
          </div>
        )}
      </ScrollShadow>

      <form
        className="flex max-w-screen-md w-full p-[1rem]"
        onSubmit={formik.handleSubmit}
      >
        <ValidatedTextField
          formik={formik}
          name="prompt"
          inputGroupProps={{
            className: "rounded-3xl",
          }}
          inputProps={{
            className: "py-[1rem]",
            placeholder: t("typeSomething"),
          }}
          prefixProps={{
            className: "px-[0.5rem]",
          }}
          suffixProps={{
            className: "px-[0.5rem]",
          }}
          prefix={
            <Button
              isIconOnly
              variant="outline"
              className="bg-[color-mix(in_srgb,var(--surface),transparent_70%)] rounded-2xl text-foreground"
            >
              <Mic className="size-[1.3rem]"></Mic>
            </Button>
          }
          suffix={
            <Button
              isIconOnly
              isPending={promptMutation.isPending}
              type="submit"
              variant="primary"
              className="rounded-2xl"
            >
              <Send className="size-[1.3rem]"></Send>
            </Button>
          }
        ></ValidatedTextField>
      </form>
    </div>
  );
}
