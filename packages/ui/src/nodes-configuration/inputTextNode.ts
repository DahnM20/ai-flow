import { NodeConfig } from "./types";

const inputTextNodeConfig: NodeConfig = {
  nodeName: "Text",
  processorType: "input-text",
  icon: "AiOutlineEdit",
  fields: [
    {
      type: "textarea",
      name: "inputText",
      required: true,
      placeholder: "InputPlaceholder",
    },
  ],
  outputType: "text",
  defaultHideOutput: true,
  section: "input",
  helpMessage: "inputHelp",
};

export default inputTextNodeConfig;
