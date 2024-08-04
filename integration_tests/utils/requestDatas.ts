type ProcessFileData = {
  jsonFile: string;
  parameters: Record<string, string>;
};

type RunNodeData = {
  jsonFile: string;
  parameters: Record<string, string>;
  nodeName: string;
};

export type Node = {
  inputs: {
    inputName?: string;
    inputNode: string;
    inputNodeOutputKey: number;
  }[];
  name: string;
  processorType: string;
  [key: string]: any;
};

const basicJsonFlow: Node[] = [
  {
    inputs: [],
    name: "kbk1proh1#input-text",
    processorType: "input-text",
    inputText: "Hello World",
    x: 1,
    y: 1,
  },
];

const jsonFlowWithMissingInputText: Node[] = [
  {
    inputs: [],
    name: "kbk1proh1#input-text",
    processorType: "input-text",
    x: 1,
    y: 1,
  },
];

export const flowWithOneNonFreeNode: Node[] = [
  {
    inputs: [],
    name: "1#stable-diffusion-stabilityai-prompt",
    processorType: "stable-diffusion-stabilityai-prompt",
  },
];

export const sequentialFlow: Node[] = [
  {
    inputs: [],
    name: "1#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
  },
  {
    inputs: [
      {
        inputNode: "1#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "2#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
  },
  {
    inputs: [
      {
        inputNode: "2#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "3#stable-diffusion-stabilityai-prompt",
    processorType: "stable-diffusion-stabilityai-prompt",
    raiseError: false,
  },
];

export const flowWithoutLinks: Node[] = [
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
  },
];

export const flowFreeNodesWithoutLink: Node[] = [
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
  },
];

export const flowWithFourParallelNodeStep: Node[] = [
  {
    inputs: [],
    name: "1#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
    sleepDuration: undefined,
  },
  {
    inputs: [
      {
        inputNode: "1#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "2#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
    sleepDuration: undefined,
  },
  {
    inputs: [
      {
        inputNode: "1#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "3#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
    sleepDuration: undefined,
  },
  {
    inputs: [
      {
        inputNode: "1#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "4#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
    sleepDuration: undefined,
  },
  {
    inputs: [
      {
        inputNode: "1#llm-prompt",
        inputNodeOutputKey: 0,
      },
    ],
    name: "5#llm-prompt",
    processorType: "llm-prompt",
    raiseError: false,
    sleepDuration: undefined,
  },
];

function getBasicProcessFileData(): ProcessFileData {
  return {
    jsonFile: JSON.stringify(basicJsonFlow),
    parameters: {
      openaiApiKey: "apiKey",
    },
  };
}

function getBasicRunNodeData(): RunNodeData {
  return {
    jsonFile: JSON.stringify(basicJsonFlow),
    nodeName: basicJsonFlow[0].name,
    parameters: {
      openaiApiKey: "apiKey",
    },
  };
}

function getJsonFlowWithMissingInputTextProcessFileData(): ProcessFileData {
  return {
    jsonFile: JSON.stringify(jsonFlowWithMissingInputText),
    parameters: {
      openaiApiKey: "apiKey",
    },
  };
}

function createRequestData(flow: any): ProcessFileData {
  return {
    jsonFile: JSON.stringify(flow),
    parameters: {
      openaiApiKey: "apiKey",
    },
  };
}
export {
  basicJsonFlow,
  jsonFlowWithMissingInputText,
  getBasicProcessFileData,
  getBasicRunNodeData,
  getJsonFlowWithMissingInputTextProcessFileData,
  createRequestData,
};
