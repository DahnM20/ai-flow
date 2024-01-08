import { NodeConfig } from "./nodeConfig";

export const gptVisionNodeConfig: NodeConfig = {
    nodeName: 'GPT Vision',
    icon: 'FaEye',
    inputNames: ['initData'],
    fields: [
        {
            name: 'model',

            type: 'option',
            options: [
                {
                    label: 'GPT4-Turbo Vision',
                    value: 'gpt-4-vision-preview',
                    default: true,
                }
            ]
        },
        {
            name: 'prompt',
            type: 'textarea',
            placeholder: 'VisionPromptPlaceholder',
        },

    ],
    outputType: 'text',
    hasInputHandle: true,
    section: 'models',
    helpMessage: 'gptVisionPromptHelp',
};