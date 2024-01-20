import { NodeConfig } from "./nodeConfig";


const inputTextNodeConfig: NodeConfig = {
  nodeName: "Text",
  icon: "FaUserCircle",
  fields: [
    {
      type: "textarea",
      name: "inputText",
      required: true,
      placeholder: 'InputPlaceholder',
    },
  ],
  outputType: "text",
  defaultHideOutput: true,
  section: 'input',
  helpMessage: 'inputHelp'
};

export default inputTextNodeConfig;
