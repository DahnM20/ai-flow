type ProcessFileData = {
    jsonFile: string;
    openaiApiKey: string;
};

type RunNodeData = {
    jsonFile: string;
    openaiApiKey: string;
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
        openaiApiKey: "apiKey",
    };
}

function getBasicRunNodeData(): RunNodeData {
    return {
        jsonFile: JSON.stringify(basicJsonFlow),
        nodeName: basicJsonFlow[0].name,
        openaiApiKey: "apiKey",
    };
}

function getJsonFlowWithMissingInputTextProcessFileData(): ProcessFileData {
    return {
        jsonFile: JSON.stringify(jsonFlowWithMissingInputText),
        openaiApiKey: "apiKey",
    };
}

export {
    basicJsonFlow,
    jsonFlowWithMissingInputText,
    getBasicProcessFileData,
    getBasicRunNodeData,
    getJsonFlowWithMissingInputTextProcessFileData
};