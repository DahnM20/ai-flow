type ProcessFileData = {
    json_file: string;
    openai_api_key: string;
};

type RunNodeData = {
    json_file: string;
    openai_api_key: string;
    node_name: string;
};

const basicJsonFlow = [
    {
        input: "",
        name: "kbk1proh1#input-text",
        processorType: "input-text",
        inputText: "Hello World",
        x: 1,
        y: 1,
    }
];

const jsonFlowWithMissingInputText = [
    {
        input: "",
        name: "kbk1proh1#input-text",
        processorType: "input-text",
        x: 1,
        y: 1,
    }
];

function getBasicProcessFileData(): ProcessFileData {
    return {
        json_file: JSON.stringify(basicJsonFlow),
        openai_api_key: "apiKey",
    };
}

function getBasicRunNodeData(): RunNodeData {
    return {
        json_file: JSON.stringify(basicJsonFlow),
        node_name: basicJsonFlow[0].name,
        openai_api_key: "apiKey",
    };
}

function getJsonFlowWithMissingInputTextProcessFileData(): ProcessFileData {
    return {
        json_file: JSON.stringify(jsonFlowWithMissingInputText),
        openai_api_key: "apiKey",
    };
}

export {
    basicJsonFlow,
    jsonFlowWithMissingInputText,
    getBasicProcessFileData,
    getBasicRunNodeData,
    getJsonFlowWithMissingInputTextProcessFileData
};