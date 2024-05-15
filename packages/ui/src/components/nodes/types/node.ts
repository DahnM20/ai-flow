import { NodeConfig } from "../../../nodes-configuration/types";

export interface NodeInput {
  inputName: string;
  inputNode: string;
  inputNodeOutputKey: number;
}

export interface NodeAppearance {
  color?: string;
  customName?: string;
  fontSize?: number;
}

export interface NodeData {
  id: string;
  name: string;
  handles: any;
  processorType: string;
  nbOutput: number;
  inputs: NodeInput[];
  outputData?: string[] | string;
  lastRun?: string;
  missingFields?: string[];
  config: NodeConfig;
  appearance?: NodeAppearance;
  [key: string]: any;
}

export interface GenericNodeData extends NodeData {
  width?: number;
  height?: number;
  [key: string]: any;
}
