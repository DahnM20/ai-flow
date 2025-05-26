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
      type: "select",
      options: [
        {
          label: "GPT-4o-mini",
          value: "gpt-4o-mini",
        },
        {
          label: "GPT-4o",
          value: "gpt-4o",
        },
        {
          label: "GPT-4.1-nano",
          value: "gpt-4.1-nano",
        },
        {
          label: "GPT-4.1-mini",
          value: "gpt-4.1-mini",
          default: true,
        },
        {
          label: "GPT-4.1",
          value: "gpt-4.1",
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
    {
      name: "web_search",
      label: "web_search",
      type: "boolean",
      defaultValue: false,
      condition: {
        field: "model",
        operator: "in",
        value: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"],
      },
    },
    {
      name: "search_context_size",
      label: "search_context_size",
      type: "select",
      placeholder: "SearchContextSizePlaceholder",
      options: [
        {
          label: "Low",
          value: "low",
        },
        {
          label: "Medium",
          value: "medium",
          default: true,
        },
        {
          label: "High",
          value: "high",
        },
      ],
      condition: {
        logic: "AND",
        conditions: [
          {
            field: "model",
            operator: "in",
            value: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini"],
          },
          {
            field: "web_search",
            operator: "equals",
            value: true,
          },
        ],
      },
    },
    {
      name: "af_node_version",
      type: "nonRendered",
      hidden: true,
      defaultValue: 2,
    },
  ],
  outputType: "markdown",
  showHandlesNames: true,
  // hasInputHandle: true,
  section: "models",
  helpMessage: "llmPromptHelp",
};
