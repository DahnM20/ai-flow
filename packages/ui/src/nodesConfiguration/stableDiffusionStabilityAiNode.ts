import { NodeConfig } from "./nodeConfig";


const stableDiffusionStabilityAiNodeConfig: NodeConfig = {
    nodeName: "Stable Diffusion",
    icon: "FaImage",
    hasInputHandle: true,
    fields: [
        {
            type: "textarea",
            name: "prompt",
            placeholder: 'DallEPromptPlaceholder',
            hideIfParent: true,
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
    outputType: "imageUrl",
};

export default stableDiffusionStabilityAiNodeConfig;
