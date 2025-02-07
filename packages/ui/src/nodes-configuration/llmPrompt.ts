import { NodeConfig } from "./types";

export const llmPromptNodeConfig: NodeConfig = {
  nodeName: "LLMPrompt",
  processorType: "llm-prompt",
  icon: "OpenAILogo",
  inputNames: ["initData"],
  fields: [
    {
      name: "model",
      label: "",
      type: "option",
      options: [
        {
          label: "GPT-4o-mini",
          value: "gpt-4o-mini",
          default: true,
        },
        {
          label: "GPT-4o",
          value: "gpt-4o",
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
