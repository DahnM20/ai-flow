import { NodeConfig } from "./nodeConfig";

export const llmPromptNodeConfig: NodeConfig = {
    nodeName: 'LLMPrompt',
    icon: 'FaRobot',
    inputNames: ['initData'],
    fields: [
        {
            name: 'model',
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
            name: 'prompt',
            type: 'textarea',
            //label: 'Prompt',
            placeholder: 'PromptPlaceholder',
        },

    ],
    outputType: 'text',
    hasInputHandle: true,
    section: 'llm',
    helpMessage: 'llmPromptHelp',
};