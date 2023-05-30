import { promptNodeConfig } from "./promptNode";

export interface Field {
    name: string;
    type: 'input' | 'textarea' | 'select';
    label: string;
  }
  
  export interface NodeConfig {
    nodeName: string;
    icon: string;
    fields: Field[];
    outputType: 'text' | 'image';
  }
  
  const nodeConfigs: { [key: string]: NodeConfig } = {
    'gpt-prompt': promptNodeConfig,
    // add other configs here...
  }


  export const getConfigViaProcessorType = (processorType: string): NodeConfig | undefined => {
    return nodeConfigs[processorType];
  }