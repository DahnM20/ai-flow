import { NodeConfig } from "./nodeConfig";


const inputImageNodeConfig: NodeConfig = {
  nodeName: "InputImage",
  icon: "FaUserCircle",
  fields: [
    {
      type: "textarea",
      name: "inputText",
      placeholder: 'InputImagePlaceholder',
    },
  ],
  outputType: "imageUrl",
  defaultHideOutput: true,
  section: 'input',
  helpMessage: 'inputHelp'
};

export default inputImageNodeConfig;
