import { NodeConfig } from "./types";

export const mergerPromptNode: NodeConfig = {
  nodeName: "MergerNode",
  processorType: "merger-prompt",
  icon: "AiOutlineMergeCells",
  inputNames: ["input-1", "input-2"],
  fields: [
    {
      name: "mergeMode",
      label: "",
      type: "option",
      options: [
        {
          label: "Merge",
          value: "1",
        },
        {
          label: "Merge + GPT",
          value: "2",
          default: true,
        },
      ],
    },
    {
      name: "inputNameBar",
      type: "inputNameBar",
      associatedField: "prompt",
    },
    {
      name: "prompt",
      type: "textarea",
      required: true,
      placeholder: "MergePromptPlaceholder",
    },
  ],
  outputType: "markdown",
  hasInputHandle: true,
  section: "tools",
  helpMessage: "mergerPromptHelp",
};
