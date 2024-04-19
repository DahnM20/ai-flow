import { NodeConfig } from "./types";

const stableDiffusionStabilityAiNodeConfig: NodeConfig = {
  nodeName: "Stable Diffusion",
  processorType: "stable-diffusion-stabilityai-prompt",
  icon: "FaImage",
  hasInputHandle: true,
  inputNames: ["prompt"],
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
      placeholder: "StableDiffusionSizePlaceholder",
      options: [
        {
          label: "1024x1024",
          value: "1024x1024",
          default: true,
        },
        {
          label: "1152x896",
          value: "1152x896",
        },
        {
          label: "1216x832",
          value: "1216x832",
        },
        {
          label: "1344x768",
          value: "1344x768",
        },
        {
          label: "1536x640",
          value: "1536x640",
        },
        {
          label: "640x1536",
          value: "640x1536",
        },
        {
          label: "768x1344",
          value: "768x1344",
        },
        {
          label: "832x1216",
          value: "832x1216",
        },
        {
          label: "896x1152",
          value: "896x1152",
        },
      ],
    },
  ],
  outputType: "imageUrl",
  section: "models",
  helpMessage: "stableDiffusionPromptHelp",
};

export default stableDiffusionStabilityAiNodeConfig;
