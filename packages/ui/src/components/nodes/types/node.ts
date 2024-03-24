import { NodeConfig } from "../../../nodes-configuration/nodeConfig";
import { NodeType } from "../../../utils/mappings";

export interface NodeInput {
  inputName: string;
  inputNode: string;
  inputNodeOutputKey: number;
}

export interface NodeData {
  id: string;
  name: string;
  handles: any;
  processorType: NodeType;
  nbOutput: number;
  inputs: NodeInput[];
  outputData?: string[] | string;
  lastRun?: string;
  missingFields?: string[];
  config: NodeConfig;
  [key: string]: any;
}

export interface GenericNodeData extends NodeData {
  width?: number;
  height?: number;
  [key: string]: any;
}
