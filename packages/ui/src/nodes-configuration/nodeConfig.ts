import dallENodeConfig from "./dallENode";
import inputTextNodeConfig from "./inputTextNode";
import { llmPromptNodeConfig } from "./llmPrompt";
import stableDiffusionStabilityAiNodeConfig from "./stableDiffusionStabilityAiNode";
import { urlNodeConfig } from "./urlNode";
import { youtubeTranscriptNodeConfig } from "./youtubeTranscriptNode";
import { mergerPromptNode } from "./mergerPromptNode";
import { gptVisionNodeConfig } from "./gptVisionNode";
import { FieldType, NodeConfig } from "./types";
import axios from "axios";

export const nodeConfigs: { [key: string]: NodeConfig | undefined } = {
  "input-text": inputTextNodeConfig,
  url_input: urlNodeConfig,
  "llm-prompt": llmPromptNodeConfig,
  "gpt-vision": gptVisionNodeConfig,
  youtube_transcript_input: youtubeTranscriptNodeConfig,
  "dalle-prompt": dallENodeConfig,
  "stable-diffusion-stabilityai-prompt": stableDiffusionStabilityAiNodeConfig,
  "merger-prompt": mergerPromptNode,
  // add other configs here...
};

const fieldTypeWithoutHandle: FieldType[] = [
  "select",
  "option",
  "boolean",
  "slider",
];

export const getConfigViaType = (type: string): NodeConfig | undefined => {
  return structuredClone(nodeConfigs[type]);
};

export const fieldHasHandle = (fieldType: FieldType): boolean => {
  return !fieldTypeWithoutHandle.includes(fieldType);
};

export const loadExtensions = async () => {
  const response = await axios.get("http://192.168.1.27:5000/node/extensions");
  response.data?.extensions.forEach((extension: NodeConfig) => {
    const key = extension.processorType;
    if (!key) return;
    if (key in nodeConfigs) return;

    nodeConfigs[key] = extension;
  });
};
