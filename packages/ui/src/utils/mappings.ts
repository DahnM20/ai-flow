import { NodeProps } from "reactflow";
import DallENode from "../components/nodes/dallENode/DallENode";
import DataSplitterNode from "../components/nodes/dataSplitterNode/DataSplitterNode";
import FileDropNode from "../components/nodes/fileDropNode/fileDropNode";
import GenericNode from "../components/nodes/genericNode/GenericNode";

/**
 * All nodes types must be declared here. By default, every node will be associated with the GenericNode component.
 */
export const allNodeTypes = ['gpt', 'file', 'url_input', 'dalle-prompt', 'data-splitter', 'input', 'gpt-prompt','youtube-transcript', 'gpt-no-context-prompt'] as const;
export type NodeType = typeof allNodeTypes[number];


/**
 * Nodes types that uses specific components, instead of the generic one. 
 */
export const specificNodeTypes: Partial<Record<NodeType, React.FC<NodeProps>>> = {
    "file": FileDropNode,
    "dalle-prompt": DallENode,
    "data-splitter": DataSplitterNode,
};


/**
 * Generate the mapping used by ReactFlow. 
 * 
 * @returns The complete mapping of all node types to their respective components.
 */
export const getAllNodeTypesComponentMapping = () => {
    const completeNodeTypes: Record<NodeType, React.FC<NodeProps>> = {} as Record<NodeType, React.FC<NodeProps>>;
    
    allNodeTypes.forEach(type => {
      completeNodeTypes[type] = specificNodeTypes[type] || GenericNode;
    });
  
    return completeNodeTypes;
}