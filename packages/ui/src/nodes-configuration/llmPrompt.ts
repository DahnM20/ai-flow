import { NodeConfig } from "./types";

export const llmPromptNodeConfig: NodeConfig = {
  nodeName: "LLMPrompt",
  processorType: "llm-prompt",
  icon: "FaRobot",
  inputNames: ["initData"],
  fields: [
    {
      name: "model",
      label: "",
      type: "option",
      options: [
        {
          label: "GPT3.5",
          value: "gpt-3.5-turbo",
          default: true,
        },
        {
          label: "GPT4",
          value: "gpt-4-turbo-preview",
        },
      ],
    },
    {
      name: "prompt",
      type: "textarea",
      required: true,
      placeholder: "PromptPlaceholder",
    },
  ],
  outputType: "markdown",
  hasInputHandle: true,
  section: "models",
  helpMessage: "llmPromptHelp",
};
