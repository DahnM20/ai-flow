import { NodeProps } from "reactflow";

export interface NodeData {
    id: string;
    name: string;
    processorType: string;
    nodeType: string;
    nbOutput: number;
    input: string;
    input_key: string;
    output_data?: string[];
}

export type NodeType = 'input' | 'url_input' | 'output' | 'gpt' | 'output-strip' | 'file' | 'prompt' | 'gpt-prompt' | 'llm' | 'dalle-prompt' | 'data-splitter';
export type ProcessorType = 'input' | 'url_input' | 'output' | 'gpt' | 'prompt' | 'gpt-prompt' | 'llm' |  'dalle-prompt' | 'data-splitter';

export type ProcessorTypeOption = { value: NodeType, label: string }[];

export type ProcessorNodeTypeMapping = { node: NodeType, processorType: ProcessorType  }[];

export type NodeTypeMapping = Record<NodeType, string>;
export type ProcessorTypeMapping = Record<ProcessorType, string>;