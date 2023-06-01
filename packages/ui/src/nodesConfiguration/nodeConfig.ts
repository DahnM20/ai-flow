import { NodeType } from "../utils/mappings";
import { basicProcessorNodeConfig } from "./basicProcessorNode";
import inputTextNodeConfig from "./inputTextNode";
import { noContextPromptNodeConfig } from "./noContextPrompt";
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

const nodeConfigs: { [key in NodeType]?: NodeConfig } = {
    'gpt-prompt': promptNodeConfig,
    'input': inputTextNodeConfig,
    'gpt': basicProcessorNodeConfig,
    'url_input': urlNodeConfig,
    'gpt-no-context-prompt': noContextPromptNodeConfig
    // add other configs here...
}


export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
    return nodeConfigs[type];
}
