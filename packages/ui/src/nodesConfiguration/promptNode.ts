import { Field, NodeConfig } from "./nodeConfig";


const promptNodeFields: Field[] = [
  {
    name: 'inputText',
    type: 'textarea',
    //label: 'Prompt',
    placeholder: 'PromptPlaceholder',
  },
];

export const promptNodeConfig: NodeConfig = {
  nodeName: 'Prompt',
  icon: 'FaUserCircle',
  fields: promptNodeFields,
  outputType: 'text',
  hasInputHandle: true,
};