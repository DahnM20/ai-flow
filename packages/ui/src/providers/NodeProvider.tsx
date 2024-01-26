import { ReactNode, createContext, useContext } from "react";
import { Node, Edge } from "reactflow";
import { nodesTopologicalSort, convertFlowToJson } from "../utils/flowUtils";
import { FlowEvent, SocketContext } from "./SocketProvider";
import { useTranslation } from "react-i18next";
import { toastErrorMessage, toastInfoMessage } from "../utils/toastUtils";
import {
  createErrorMessageForMissingFields,
  getNodeInError,
} from "../utils/flowCheckUtils";

interface NodeContextType {
  runNode: (nodeName: string) => boolean;
  hasParent: (id: string) => boolean;
  getIncomingEdges: (id: string) => Edge[] | undefined;
  getEdgeIndex: (id: string) => Edge | undefined;
  showOnlyOutput?: boolean;
  isRunning: boolean;
  currentNodesRunning: string[];
  errorCount: number;
  onUpdateNodeData: (nodeId: string, data: any) => void;
  onUpdateNodes: (nodesUpdated: Node[], edgesUpdated: Edge[]) => void;
  nodes: Node[];
  edges: Edge[];
}

export const NodeContext = createContext<NodeContextType>({
  runNode: () => false,
  hasParent: () => false,
  getIncomingEdges: () => undefined,
  getEdgeIndex: () => undefined,
  showOnlyOutput: false,
  isRunning: false,
  currentNodesRunning: [],
  errorCount: 0,
  onUpdateNodeData: () => undefined,
  onUpdateNodes: () => undefined,
  nodes: [],
  edges: [],
});

export const NodeProvider = ({
  nodes,
  edges,
  showOnlyOutput,
  isRunning,
  currentNodesRunning,
  errorCount,
  onUpdateNodeData,
  onUpdateNodes,
  children,
}: {
  nodes: Node[];
  edges: Edge[];
  showOnlyOutput?: boolean;
  isRunning: boolean;
  currentNodesRunning: string[];
  errorCount: number;
  onUpdateNodeData: (nodeId: string, data: any) => void;
  onUpdateNodes: (nodesUpdated: Node[], edgesUpdated: Edge[]) => void;
  children: ReactNode;
}) => {
  const { t } = useTranslation("flow");
  const { emitEvent } = useContext(SocketContext);

  const runNode = (name: string) => {
    const nodesSorted = nodesTopologicalSort(nodes, edges);
    const flowFile = convertFlowToJson(nodesSorted, edges, false, true);

    const nodesInError = getNodeInError(flowFile, nodesSorted, name);

    if (nodesInError.length > 0) {
      let errorMessage = createErrorMessageForMissingFields(nodesInError, t);
      toastErrorMessage(errorMessage);
      return false;
    }

    const event: FlowEvent = {
      name: "run_node",
      data: {
        jsonFile: JSON.stringify(flowFile),
        nodeName: name,
      },
    };
    return emitEvent(event);
  };

  const hasParent = (id: string) => {
    return !!edges.find((edge) => edge.target === id);
  };

  const getIncomingEdges = (id: string) => {
    return edges.filter((edge) => edge.target === id);
  };

  const getEdgeIndex = (id: string) => {
    return edges.find((edge) => edge.target === id);
  };

  return (
    <NodeContext.Provider
      value={{
        runNode,
        hasParent,
        getIncomingEdges,
        getEdgeIndex,
        showOnlyOutput,
        isRunning,
        currentNodesRunning,
        errorCount,
        onUpdateNodeData,
        onUpdateNodes,
        nodes,
        edges,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
