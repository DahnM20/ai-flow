import { NodeConfig } from "./types";

const dallENodeConfig: NodeConfig = {
  nodeName: "DALL-E 3",
  processorType: "dalle-prompt",
  icon: "OpenAILogo",
  hasInputHandle: true,
  fields: [
    {
      type: "textarea",
      name: "prompt",
      placeholder: "DallEPromptPlaceholder",
      hideIfParent: true,
    },
    {
      type: "select",
      name: "size",
      options: [
        {
          label: "1024x1024",
          value: "1024x1024",
          default: true,
        },
        {
          label: "1024x1792",
          value: "1024x1792",
        },
        {
          label: "1792x1024",
          value: "1792x1024",
        },
      ],
    },
    {
      type: "select",
      name: "quality",
      options: [
        {
          label: "standard",
          value: "standard",
          default: true,
        },
        {
          label: "hd",
          value: "hd",
        },
      ],
    },
  ],
  outputType: "imageUrl",
  section: "models",
  helpMessage: "dallePromptHelp",
};

export default dallENodeConfig;
