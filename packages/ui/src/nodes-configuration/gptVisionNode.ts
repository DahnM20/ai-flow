import { NodeConfig } from "./types";

export const gptVisionNodeConfig: NodeConfig = {
  nodeName: "GPT Vision",
  processorType: "gpt-vision",
  icon: "OpenAILogo",
  inputNames: ["image_url", "prompt"],
  fields: [
    {
      name: "prompt",
      label: "Prompt",
      type: "textarea",
      required: true,
      hasHandle: true,
      placeholder: "VisionPromptPlaceholder",
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "fileUpload",
      hasHandle: true,
      required: true,
      placeholder: "VisionImageURLPlaceholder",
      canAddChildrenFields: true,
    },
  ],
  outputType: "markdown",
  hasInputHandle: true,
  section: "models",
  helpMessage: "gptVisionPromptHelp",
  showHandlesNames: true,
};
