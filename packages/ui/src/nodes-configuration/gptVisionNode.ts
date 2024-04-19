import { NodeConfig } from "./types";

export const gptVisionNodeConfig: NodeConfig = {
  nodeName: "GPT Vision",
  processorType: "gpt-vision",
  icon: "FaEye",
  inputNames: ["image_url", "prompt"],
  fields: [
    // {
    //   name: "model",
    //   type: "option",
    //   options: [
    //     {
    //       label: "GPT4-Turbo Vision",
    //       value: "gpt-4-vision-preview",
    //       default: true,
    //     },
    //   ],
    // },
    {
      name: "image_url",
      label: "Image URL",
      type: "input",
      hasHandle: true,
      required: true,
      placeholder: "VisionImageURLPlaceholder",
    },
    {
      name: "prompt",
      label: "Prompt",
      type: "textarea",
      required: true,
      hasHandle: true,
      placeholder: "VisionPromptPlaceholder",
    },
  ],
  outputType: "text",
  hasInputHandle: true,
  section: "models",
  helpMessage: "gptVisionPromptHelp",
  showHandlesNames: true,
};
