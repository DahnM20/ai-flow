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

export {
    basicJsonFlow,
    jsonFlowWithMissingInputText,
    getBasicProcessFileData,
    getBasicRunNodeData,
    getJsonFlowWithMissingInputTextProcessFileData
};