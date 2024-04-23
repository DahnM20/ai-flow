import { NodeProps } from "reactflow";
import DataSplitterNode from "../components/nodes/DataSplitterNode";
import FileUploadNode from "../components/nodes/FileUploadNode";
import GenericNode from "../components/nodes/GenericNode";
import AIDataSplitterNode from "../components/nodes/AIDataSplitterNode";
import AIActionNode from "../components/nodes/AIActionNode";
import EaseOut from "../components/shared/motions/EaseOut";
import NodeWrapper from "../components/nodes/NodeWrapper";
import TransitionNode from "../components/nodes/TransitionNode";
import ReplicateNode from "../components/nodes/ReplicateNode";
import DynamicAPINode from "../components/nodes/DynamicAPINode";
import { nodeConfigs } from "../nodes-configuration/nodeConfig";

let allNodeTypes: string[] = [];

/**
 * Nodes types that uses specific components, instead of the generic one.
 */
export const specificNodeTypes: Partial<Record<string, React.FC<NodeProps>>> = {
  "file-drop": FileUploadNode,
  "data-splitter": DataSplitterNode,
  "ai-data-splitter": AIDataSplitterNode,
  "ai-action": AIActionNode,
  file: FileUploadNode,
  replicate: ReplicateNode,
  transition: TransitionNode,
  genericApiNode: DynamicAPINode,
};

export const loadAllNodesTypes = () => {
  allNodeTypes = !!nodeConfigs
    ? Object.keys(nodeConfigs)
        .filter((key: string) => {
          return !!nodeConfigs[key]?.processorType;
        })
        .map((key: string) => {
          return nodeConfigs[key]?.processorType as string;
        })
    : [];

  allNodeTypes = allNodeTypes.concat(Object.keys(specificNodeTypes));
};

/**
 * Generate the mapping used by ReactFlow.
 *
 * @returns The complete mapping of all node types to their respective components.
 */
export const getAllNodeTypesComponentMapping = () => {
  const completeNodeTypes: Record<string, React.FC<NodeProps>> = {} as Record<
    string,
    React.FC<NodeProps>
  >;

  allNodeTypes.forEach((type) => {
    completeNodeTypes[type] = specificNodeTypes[type] || GenericNode;
  });

  return completeNodeTypes;
};

export const getAllNodeWithEaseOut = (): Record<
  string,
  React.FC<NodeProps>
> => {
  const completeNodeTypes: Record<string, React.FC<NodeProps>> = {} as Record<
    string,
    React.FC<NodeProps>
  >;

  allNodeTypes.forEach((type: string) => {
    const NodeComponent = specificNodeTypes[type] || GenericNode;

    completeNodeTypes[type] = (props: NodeProps) => (
      <EaseOut key={props.id}>
        <NodeWrapper nodeId={props.id}>
          <NodeComponent {...props} />
        </NodeWrapper>
      </EaseOut>
    );
  });

  return completeNodeTypes;
};
