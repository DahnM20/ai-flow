import { NodeConfig } from "./nodeConfig";

export const mergerPromptNode: NodeConfig = {
    nodeName: 'MergerNode',
    icon: 'AiOutlineMergeCells',
    inputNames: ['input-1', 'input-2'],
    fields: [
        {
            name: 'mergeMode',
            label: '',
            type: 'option',
            options: [
                {
                    label: 'Merge',
                    value: '1',
                },
                {
                    label: 'Merge + GPT',
                    value: '2',
                    default: true,
                }
            ]
        },
        {
            name: 'inputNameBar',
            type: 'inputNameBar',
        },
        {
            name: 'inputText',
            type: 'textarea',
            placeholder: 'PromptPlaceholder',
        },

    ],
    outputType: 'text',
    hasInputHandle: true,
};