import { NodeConfig } from "./nodeConfig";


const inputTextNodeConfig: NodeConfig = {
  nodeName: "Input",
  icon: "FaUserCircle",
  fields: [
    {
      type: "textarea",
      name: "inputText",
      label: "Input",
    },
  ],
  outputType: "text",
};

export default inputTextNodeConfig;
