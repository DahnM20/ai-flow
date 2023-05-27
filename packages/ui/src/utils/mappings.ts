import { NodeTypeMapping, ProcessorNodeTypeMapping, ProcessorTypeMapping, ProcessorTypeOption } from "../types/node";

export const processorNodeTypeMapping: ProcessorNodeTypeMapping = [
    { node: 'input', processorType: 'input' },
    { node: 'url_input', processorType: 'url_input' },
    { node: 'output', processorType: 'output' },
    { node: 'gpt', processorType: 'gpt' },
    { node: 'output-strip', processorType: 'output' },
    { node: 'file', processorType: 'input' },
    { node: 'prompt', processorType: 'prompt' },
    { node: 'gpt-prompt', processorType: 'gpt-prompt' },
    { node: 'llm', processorType: 'llm' },
    { node: 'dalle-prompt', processorType: 'dalle-prompt' },
    { node: 'data-splitter', processorType: 'data-splitter' },
];

export const nodeTypeMapping: NodeTypeMapping = {
    gpt: 'processorNode',
    'output-strip': 'outputStripNode',
    input: 'inputNode',
    prompt: 'promptNode',
    'gpt-prompt': 'promptNode',
    file: 'fileDropNode',
    url_input: 'urlNode',
    output: 'outputNode',
    llm: 'llmNode',
    'dalle-prompt': 'dallENode',
    'data-splitter': 'dataSplitterNode',
};

export const reverseMapping: Record<string, string> = Object.fromEntries(
    Object.entries(nodeTypeMapping).map(([key, value]) => [value, key])
);

export const processorTypeMapping: ProcessorTypeMapping = {
    gpt: 'processorNode',
    input: 'inputNode',
    prompt: 'promptNode',
    'gpt-prompt': 'promptNode',
    url_input: 'urlNode',
    output: 'outputNode',
    llm: 'llmNode',
    'dalle-prompt': 'dallENode',
    'data-splitter': 'dataSplitterNode',
};