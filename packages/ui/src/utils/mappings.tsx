import { NodeProps } from "reactflow";
import DataSplitterNode from "../components/nodes/DataSplitterNode";
import FileUploadNode from "../components/nodes/FileUploadNode";
import GenericNode from "../components/nodes/GenericNode";
import AIDataSplitterNode from "../components/nodes/AIDataSplitterNode";
import AIActionNode from "../components/nodes/AIActionNode";
import EaseOut from "../components/shared/motions/EaseOut";
import NodeWrapper from "../components/nodes/NodeWrapper";
import DynamicFieldsNode from "../components/nodes/DynamicFieldsNode";
import TransitionNode from "../components/nodes/TransitionNode";

/**
 * All nodes types must be declared here. By default, every node will be associated with the GenericNode component.
 */
export const allNodeTypes = [
  "gpt",
  "file-drop",
  "url_input",
  "dalle-prompt",
  "data-splitter",
  "ai-data-splitter",
  "input-text",
  "input-image",
  "gpt-prompt",
  "youtube_transcript_input",
  "llm-prompt",
  "ai-action",
  "stable-diffusion-stabilityai-prompt",
  "merger-prompt",
  "gpt-vision",
  "stable-video-diffusion-replicate",
  "replicate",
  "transition",
  "file-upload",
] as const;
export type NodeType = (typeof allNodeTypes)[number];

/**
 * Nodes types that uses specific components, instead of the generic one.
 */
export const specificNodeTypes: Partial<Record<NodeType, React.FC<NodeProps>>> =
  {
    "file-drop": FileUploadNode,
    "data-splitter": DataSplitterNode,
    "ai-data-splitter": AIDataSplitterNode,
    "ai-action": AIActionNode,
    "file-upload": FileUploadNode,
    replicate: DynamicFieldsNode,
    transition: TransitionNode,
  };

/**
 * Generate the mapping used by ReactFlow.
 *
 * @returns The complete mapping of all node types to their respective components.
 */
export const getAllNodeTypesComponentMapping = () => {
  const completeNodeTypes: Record<NodeType, React.FC<NodeProps>> = {} as Record<
    NodeType,
    React.FC<NodeProps>
  >;

  allNodeTypes.forEach((type) => {
    completeNodeTypes[type] = specificNodeTypes[type] || GenericNode;
  });

  return completeNodeTypes;
};

export const getAllNodeWithEaseOut = (): Record<
  NodeType,
  React.FC<NodeProps>
> => {
  const completeNodeTypes: Record<NodeType, React.FC<NodeProps>> = {} as Record<
    NodeType,
    React.FC<NodeProps>
  >;

  allNodeTypes.forEach((type: NodeType) => {
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
