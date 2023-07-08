import { NodeConfig } from "./nodeConfig";

export const basicProcessorNodeConfig: NodeConfig = {
    nodeName: 'GPT Model',
    icon: 'FaRobot',
    fields: [
        {
            name: 'gptVersion',
            label: '',
            type: 'option',
            options: [
                {
                    label: 'GPT3.5',
                    value: 'gpt-3.5-turbo',
                    default: true,
                },
                {
                    label: 'GPT4',
                    value: 'gpt-4'
                }
            ]
        },
        {
            name: 'initData',
            placeholder: 'RoleInitPrompt',
            type: 'textarea',
        },

    ],
    outputType: 'text',
    hasInputHandle: true,
};