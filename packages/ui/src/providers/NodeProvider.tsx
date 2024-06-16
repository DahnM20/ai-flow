import { ReactNode, createContext, useContext, useState } from "react";
import { Node, Edge } from "reactflow";
import { nodesTopologicalSort, convertFlowToJson } from "../utils/flowUtils";
import { FlowEvent, SocketContext } from "./SocketProvider";
import { useTranslation } from "react-i18next";
import { toastErrorMessage } from "../utils/toastUtils";
import {
  createErrorMessageForMissingFields,
  getNodeInError,
} from "../utils/flowChecker";
import { createUniqNodeId } from "../utils/nodeUtils";
import { NodeAppearance, NodeData } from "../components/nodes/types/node";
import { NodeConfig } from "../nodes-configuration/types";
import { getDefaultOptions } from "../utils/nodeConfigurationUtils";

export type NodeDimensions = {
  width?: number | null;
  height?: number | null;
};

interface NodeContextType {
  runNode: (nodeName: string) => boolean;
  runAllNodes: () => void;
  hasParent: (id: string) => boolean;
  getIncomingEdges: (id: string) => Edge[] | undefined;
  removeNodeIncomingEdges: (id: string) => void;
  getEdgeIndex: (id: string) => Edge | undefined;
  showOnlyOutput?: boolean;
  isRunning: boolean;
  currentNodesRunning: string[];
  errorCount: number;
  onUpdateNodeData: (nodeId: string, data: any) => void;
  onUpdateNodes: (nodesUpdated: Node[], edgesUpdated: Edge[]) => void;
  getNodeDimensions: (nodeId: string) => NodeDimensions | undefined;
  duplicateNode: (nodeId: string) => void;
  createNodeRef: (nodeId: string) => void;
  clearNodeOutput: (nodeId: string) => void;
  clearAllOutput: () => void;
  updateNodeAppearance: (nodeId: string, appearance: NodeAppearance) => void;
  overrideConfigForNode: (
    nodeId: string,
    newConfig: NodeConfig,
    newData: NodeData,
  ) => void;
  removeNode: (nodeId: string) => void;
  removeAll: () => void;
  findNode: (nodeId: string) => Node | undefined;
  nodes: Node[];
  edges: Edge[];
  currentNodeIdSelected: string;
  setCurrentNodeIdSelected: (id: string) => void;
}

const DUPLICATED_NODE_OFFSET = 100;

export const NodeContext = createContext<NodeContextType>({
  runNode: () => false,
  runAllNodes: () => undefined,
  hasParent: () => false,
  getIncomingEdges: () => undefined,
  removeNodeIncomingEdges: () => undefined,
  getEdgeIndex: () => undefined,
  showOnlyOutput: false,
  isRunning: false,
  currentNodesRunning: [],
  errorCount: 0,
  onUpdateNodeData: () => undefined,
  onUpdateNodes: () => undefined,
  getNodeDimensions: () => undefined,
  duplicateNode: () => undefined,
  createNodeRef: () => undefined,
  clearNodeOutput: () => undefined,
  clearAllOutput: () => undefined,
  updateNodeAppearance: () => undefined,
  overrideConfigForNode: () => undefined,
  removeNode: () => undefined,
  removeAll: () => undefined,
  findNode: () => undefined,
  nodes: [],
  edges: [],
  currentNodeIdSelected: "",
  setCurrentNodeIdSelected: () => undefined,
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
  const [currentNodeIdSelected, setCurrentNodeIdSelected] =
    useState<string>("");

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

  const runAllNodes = () => {
    const nodesSorted = nodesTopologicalSort(nodes, edges);
    const flowFile = convertFlowToJson(nodesSorted, edges, false, true);

    const nodesInError = getNodeInError(flowFile, nodesSorted);

    if (nodesInError.length > 0) {
      let errorMessage = createErrorMessageForMissingFields(nodesInError, t);
      toastErrorMessage(errorMessage);
      return;
    }

    const event: FlowEvent = {
      name: "process_file",
      data: {
        jsonFile: JSON.stringify(flowFile),
      },
    };
    emitEvent(event);
  };

  const hasParent = (id: string) => {
    return !!edges.find((edge) => edge.target === id);
  };

  const getIncomingEdges = (id: string) => {
    return edges.filter((edge) => edge.target === id);
  };

  const removeNodeIncomingEdges = (id: string) => {
    const edgesUpdated = edges.filter((edge) => edge.target !== id);
    onUpdateNodes(nodes, edgesUpdated);
  };

  const overrideConfigForNode = (
    id: string,
    newConfig: NodeConfig,
    newData: NodeData,
  ) => {
    const nodesUpdated = nodes.map((node) => {
      if (node.id === id) {
        const defaultOptions: any = getDefaultOptions(
          newConfig.fields,
          newData,
        );
        console.log(newData);
        node.data = {
          ...newData,
          ...defaultOptions,
          config: {
            ...newConfig,
            isDynamicallyGenerated: false,
          },
        };
      }
      return node;
    });

    const edgesUpdated = edges.filter((edge) => edge.target !== id);
    onUpdateNodes(nodesUpdated, edgesUpdated);
  };

  const getEdgeIndex = (id: string) => {
    return edges.find((edge) => edge.target === id);
  };

  const getNodeDimensions = (id: string) => {
    const node = nodes.find((node) => node.id === id);
    let dimensions: NodeDimensions = { width: undefined, height: undefined };
    if (!!node) {
      dimensions = { width: node.width, height: node.height };
    }

    return dimensions;
  };

  const createNodeRef = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);

    if (nodeToDuplicate) {
      const newNodeId = createUniqNodeId(nodeToDuplicate.data.processorType);
      if (nodeToDuplicate.data.nodeRef) {
        nodeId = nodeToDuplicate.data.nodeRef;
      }

      nodeToDuplicate.data.metadata = {
        refList: nodeToDuplicate.data.metadata?.refList
          ? [...nodeToDuplicate.data.metadata.refList, newNodeId]
          : [newNodeId],
      };

      const newNode = {
        ...nodeToDuplicate,
        id: newNodeId,
        selected: false,
        data: {
          ...nodeToDuplicate.data,
          name: newNodeId,
          isDone: false,
          lastRun: undefined,
          nodeRef: nodeId,
        },
        position: {
          x: nodeToDuplicate.position.x + DUPLICATED_NODE_OFFSET,
          y: nodeToDuplicate.position.y + DUPLICATED_NODE_OFFSET,
        },
      };
      const nodesUpdated = [...nodes, newNode];
      const edgesUpdated = [...edges];
      onUpdateNodes(nodesUpdated, edgesUpdated);
    }
  };

  const duplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNodeId = createUniqNodeId(nodeToDuplicate.data.processorType);

      const deepClone = structuredClone(nodeToDuplicate);
      deepClone.id = newNodeId;
      deepClone.selected = false;
      deepClone.data.name = newNodeId;
      deepClone.data.isDone = false;
      deepClone.data.lastRun = undefined;
      deepClone.position.x += DUPLICATED_NODE_OFFSET;
      deepClone.position.y += DUPLICATED_NODE_OFFSET;

      const nodesUpdated = [...nodes, deepClone];
      const edgesUpdated = [...edges];
      onUpdateNodes(nodesUpdated, edgesUpdated);
    }
  };

  const clearNodeOutput = (nodeId: string) => {
    const nodeToUpdate = nodes.find((node) => node.id === nodeId);
    if (nodeToUpdate) {
      const nodesUpdated = nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              outputData: undefined,
              lastRun: undefined,
              isDone: false,
            },
          };
        }
        return node;
      });
      onUpdateNodes(nodesUpdated, edges);
    }
  };

  function clearAllOutput() {
    const nodesCleared = nodes.map((node) => {
      node.data.outputData = undefined;
      node.data.lastRun = undefined;
      return node;
    });
    onUpdateNodes(nodesCleared, edges);
  }

  const removeNode = (nodeId: string) => {
    const nodesUpdated = nodes.filter((node) => node.id !== nodeId);
    const edgesUpdated = edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId,
    );
    onUpdateNodes(nodesUpdated, edgesUpdated);
  };

  const removeAll = () => {
    onUpdateNodes([], []);
  };

  const findNode = (nodeId: string) => {
    return nodes.find((node) => node.id === nodeId);
  };

  const updateNodeAppearance = (nodeId: string, appearance: NodeAppearance) => {
    const nodeToUpdate = nodes.find((node) => node.id === nodeId);
    if (nodeToUpdate) {
      const nodesUpdated = nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              appearance: {
                ...node.data.appearance,
                ...appearance,
              },
            },
          };
        }
        return node;
      });
      onUpdateNodes(nodesUpdated, edges);
    }
  };

  return (
    <NodeContext.Provider
      value={{
        runNode,
        runAllNodes,
        hasParent,
        getIncomingEdges,
        removeNodeIncomingEdges,
        getEdgeIndex,
        showOnlyOutput,
        isRunning,
        currentNodesRunning,
        errorCount,
        onUpdateNodeData,
        onUpdateNodes,
        getNodeDimensions,
        duplicateNode,
        createNodeRef,
        clearNodeOutput,
        clearAllOutput,
        updateNodeAppearance,
        overrideConfigForNode,
        removeNode,
        removeAll,
        findNode,
        nodes,
        edges,
        currentNodeIdSelected: currentNodeIdSelected,
        setCurrentNodeIdSelected: setCurrentNodeIdSelected,
      }}
    >
      {children}
    </NodeContext.Provider>
  );
};
