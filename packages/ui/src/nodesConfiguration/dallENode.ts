import { NodeConfig } from "./nodeConfig";


const dallENodeConfig: NodeConfig = {
    nodeName: "DALL-E",
    icon: "FaImage",
    hideFieldsIfParent: true,
    hasInputHandle: true,
    fields: [
        {
            type: "textarea",
            name: "prompt",
            placeholder: 'DallEPromptPlaceholder',
        },
    ],
    outputType: "imageUrl",
};

export default dallENodeConfig;
