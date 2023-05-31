import { basicProcessorNodeConfig } from "./basicProcessorNode";
import inputTextNodeConfig from "./inputTextNode";
import { promptNodeConfig } from "./promptNode";
import { urlNodeConfig } from "./urlNode";

export interface Option {
    label: string;
    value: string;
}

export interface Field {
    name: string;
    type: 'input' | 'textarea' | 'select' | 'option';
    label: string;
    options?: Option[];
}

export interface NodeConfig {
    nodeName: string;
    icon: string;
    fields: Field[];
    outputType: 'text' | 'image';
    hasInputHandle?: boolean;
}

const nodeConfigs: { [key: string]: NodeConfig } = {
    'gpt-prompt': promptNodeConfig,
    'input': inputTextNodeConfig,
    'gpt': basicProcessorNodeConfig,
    'url_input': urlNodeConfig,
    // add other configs here...
}


export const getConfigViaProcessorType = (processorType: string): NodeConfig | undefined => {
    return nodeConfigs[processorType];
}
