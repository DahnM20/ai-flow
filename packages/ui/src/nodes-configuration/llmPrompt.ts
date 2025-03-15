import { NodeConfig } from "./types";

export const llmPromptNodeConfig: NodeConfig = {
  nodeName: "LLMPrompt",
  processorType: "llm-prompt",
  icon: "OpenAILogo",
  inputNames: ["prompt", "context"],
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
      name: "context",
      label: "context",
      type: "textfield",
      hasHandle: true,
      placeholder: "ContextPlaceholder",
    },
    {
      name: "prompt",
      label: "prompt",
      type: "textarea",
      required: true,
      hasHandle: true,
      placeholder: "PromptPlaceholder",
    },
  ],
  outputType: "markdown",
  showHandlesNames: true,
  // hasInputHandle: true,
  section: "models",
  helpMessage: "llmPromptHelp",
};
