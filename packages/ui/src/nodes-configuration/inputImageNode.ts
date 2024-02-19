import { NodeConfig } from "./nodeConfig";


const inputImageNodeConfig: NodeConfig = {
  nodeName: "InputImage",
  icon: "FaUserCircle",
  fields: [
    {
      type: "textarea",
      name: "inputText",
      required: true,
      placeholder: 'InputImagePlaceholder',
    },
  ],
  outputType: "imageUrl",
  defaultHideOutput: false,
  section: 'input',
  helpMessage: 'inputImageHelp'
};

export default inputImageNodeConfig;
