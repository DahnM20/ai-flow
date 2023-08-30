import { NodeConfig } from "./nodeConfig";


const stableDiffusionStabilityAiNodeConfig: NodeConfig = {
    nodeName: "Stable Diffusion",
    icon: "FaImage",
    hideFieldsIfParent: true,
    hasInputHandle: true,
    fields: [
        {
            type: "textarea",
            name: "prompt",
            placeholder: 'DallEPromptPlaceholder',
        },
        {
            type: "input",
            name: "height",
            placeholder: 'height',
        },
        {
            type: "input",
            name: "width",
            placeholder: 'width',
        },
    ],
    outputType: "imageBase64",
};

export default stableDiffusionStabilityAiNodeConfig;
