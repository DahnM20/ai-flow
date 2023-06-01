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