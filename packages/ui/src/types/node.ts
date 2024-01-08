import { NodeConfig } from "../nodes-configuration/nodeConfig";
import { NodeType } from "../utils/mappings";

export interface NodeData {
    id: string;
    name: string;
    processorType: NodeType;
    nbOutput: number;
    input: string;
    input_key: string;
    outputData?: string[] | string;
    lastRun?: string;
}

export interface GenericNodeData extends NodeData {
    config: NodeConfig;
    width: number;
    height: number;
    [key: string]: any;
}