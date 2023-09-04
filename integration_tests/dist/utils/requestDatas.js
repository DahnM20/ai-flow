"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonFlowWithMissingInputTextProcessFileData = exports.getBasicProcessFileData = exports.jsonFlowWithMissingInputText = exports.basicJsonFlow = void 0;
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
exports.basicJsonFlow = basicJsonFlow;
const jsonFlowWithMissingInputText = [
    {
        input: "",
        name: "kbk1proh1#input-text",
        processorType: "input-text",
        x: 1,
        y: 1,
    }
];
exports.jsonFlowWithMissingInputText = jsonFlowWithMissingInputText;
function getBasicProcessFileData() {
    return {
        json_file: JSON.stringify(basicJsonFlow),
        openai_api_key: "apiKey",
    };
}
exports.getBasicProcessFileData = getBasicProcessFileData;
function getJsonFlowWithMissingInputTextProcessFileData() {
    return {
        json_file: JSON.stringify(jsonFlowWithMissingInputText),
        openai_api_key: "apiKey",
    };
}
exports.getJsonFlowWithMissingInputTextProcessFileData = getJsonFlowWithMissingInputTextProcessFileData;
