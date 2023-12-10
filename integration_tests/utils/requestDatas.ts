type ProcessFileData = {
    jsonFile: string;
    apiKeys: Record<string, string>;
};

type RunNodeData = {
    jsonFile: string;
    apiKeys: Record<string, string>;
    nodeName: string;
};

const basicJsonFlow = [
    {
        inputs: [],
        name: "kbk1proh1#input-text",
        processorType: "input-text",
        inputText: "Hello World",
        x: 1,
        y: 1,
    }
];

const jsonFlowWithMissingInputText = [
    {
        inputs: [],
        name: "kbk1proh1#input-text",
        processorType: "input-text",
        x: 1,
        y: 1,
    }
];


export const flowWithOneNonFreeNode = [
    {
        inputs: [],
        name: "1#stable-diffusion-stabilityai-prompt",
        processorType: "stable-diffusion-stabilityai-prompt",
    },
];

export const sequentialFlow = [
    {
        inputs: [],
        name: "1#llm-prompt",
        processorType: "llm-prompt",
        raiseError: false,
    },
    {
        inputs: [
            {
                "inputNode": "1#llm-prompt",
                "inputNodeOutputKey": 0
            }
        ],
        name: "2#llm-prompt",
        processorType: "llm-prompt",
        raiseError: false,
    },
    {
        inputs: [
            {
                "inputNode": "2#llm-prompt",
                "inputNodeOutputKey": 0
            }
        ],
        name: "3#stable-diffusion-stabilityai-prompt",
        processorType: "stable-diffusion-stabilityai-prompt",
        raiseError: false,
    }
];

export const flowWithoutLinks = [
    {
        inputs: [],
        name: "1#llm-prompt",
        processorType: "llm-prompt",
        model: "gpt-4",
        prompt: "hi",
        raiseError: false,
    },
    {
        inputs: [],
        name: "2#llm-prompt",
        processorType: "llm-prompt",
        model: "gpt-4",
        prompt: "hi",
        raiseError: false,
    },
    {
        inputs: [],
        name: "3#stable-diffusion-stabilityai-prompt",
        processorType: "stable-diffusion-stabilityai-prompt",
        raiseError: false,
    }
];

export const flowFreeNodesWithoutLink = [
    {
        inputs: [],
        name: "1#input-text",
        processorType: "input-text",
        inputText: "fake",
    },
    {
        inputs: [],
        name: "2#input-text",
        processorType: "input-text",
        inputText: "fake",
    },
    {
        inputs: [],
        name: "3#input-text",
        processorType: "input-text",
        inputText: "fake",
    }
];

function getBasicProcessFileData(): ProcessFileData {
    return {
        jsonFile: JSON.stringify(basicJsonFlow),
        apiKeys: {
            openaiApiKey: "apiKey"
        },
    };
}

function getBasicRunNodeData(): RunNodeData {
    return {
        jsonFile: JSON.stringify(basicJsonFlow),
        nodeName: basicJsonFlow[0].name,
        apiKeys: {
            openaiApiKey: "apiKey"
        },
    };
}

function getJsonFlowWithMissingInputTextProcessFileData(): ProcessFileData {
    return {
        jsonFile: JSON.stringify(jsonFlowWithMissingInputText),
        apiKeys: {
            openaiApiKey: "apiKey"
        },
    };
}

function createRequestData(flow: any): ProcessFileData {
    return {
        jsonFile: JSON.stringify(flow),
        apiKeys: {
            openaiApiKey: "apiKey"
        },
    };
}
export {
    basicJsonFlow,
    jsonFlowWithMissingInputText,
    getBasicProcessFileData,
    getBasicRunNodeData,
    getJsonFlowWithMissingInputTextProcessFileData,
    createRequestData
};