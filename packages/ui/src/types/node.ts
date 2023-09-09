import { NodeType } from "../utils/mappings";

export interface NodeData {
    id: string;
    name: string;
    processorType: NodeType;
    nbOutput: number;
    input: string;
    input_key: string;
    output_data?: string[] | string;
}