import { NodeType } from "../utils/mappings";
import dallENodeConfig from "./dallENode";
import inputTextNodeConfig from "./inputTextNode";
import { llmPromptNodeConfig } from "./llmPrompt";
import stableDiffusionStabilityAiNodeConfig from "./stableDiffusionStabilityAiNode";
import { urlNodeConfig } from "./urlNode";
import { youtubeTranscriptNodeConfig } from "./youtubeTranscriptNode";
import { mergerPromptNode } from "./mergerPromptNode";
import { gptVisionNodeConfig } from "./gptVisionNode";

export type SectionType = "models" | "image-generation" | "tools" | "input";
export type FieldType =
  | "input"
  | "inputInt"
  | "textarea"
  | "select"
  | "option"
  | "inputNameBar"
  | "boolean"
  | "slider";

export type OutputType =
  | "imageUrl"
  | "videoUrl"
  | "audioUrl"
  | "pdfUrl"
  | "imageBase64"
  | "markdown"
  | "text";

const fieldTypeWithoutHandle: FieldType[] = [
  "select",
  "option",
  "boolean",
  "slider",
];

export interface Option {
  label: string;
  value: string;
  default?: boolean;
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  max?: number;
  min?: number;
  options?: Option[];
  hideIfParent?: boolean;
  required?: boolean;
  hasHandle?: boolean;
  isLinked?: boolean;
  associatedField?: string;
}

export interface NodeConfig {
  nodeName: string;
  icon: string;
  inputNames?: string[];
  fields: Field[];
  hideFieldsIfParent?: boolean;
  outputType: OutputType;
  defaultHideOutput?: boolean;
  hasInputHandle?: boolean;
  section: SectionType;
  helpMessage?: string;
  showHandlesNames?: boolean;
}

export const nodeConfigs: { [key in NodeType]?: NodeConfig } = {
  "input-text": inputTextNodeConfig,
  //'input-image': inputImageNodeConfig,
  url_input: urlNodeConfig,
  "llm-prompt": llmPromptNodeConfig,
  "gpt-vision": gptVisionNodeConfig,
  youtube_transcript_input: youtubeTranscriptNodeConfig,
  "dalle-prompt": dallENodeConfig,
  "stable-diffusion-stabilityai-prompt": stableDiffusionStabilityAiNodeConfig,
  "merger-prompt": mergerPromptNode,
  // add other configs here...
};
export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
  return structuredClone(nodeConfigs[type]);
};

export const fieldHasHandle = (fieldType: FieldType): boolean => {
  return !fieldTypeWithoutHandle.includes(fieldType);
};
