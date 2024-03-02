import { Node, Edge } from "reactflow";
import { Field, getConfigViaType } from "../nodes-configuration/nodeConfig";
import { NodeData } from "../components/nodes/types/node";
import { FlowTab } from "../layout/main-layout/AppLayout";

export type BasicNode = Pick<Node, "id" | "data" | "position" | "type">;
export type BasicEdge = Pick<
  Edge,
  "id" | "source" | "sourceHandle" | "target" | "targetHandle" | "type"
>;

const CONFIG = {
  FLOW_VERSION: "1.0.0",
};

export const handleInPrefix = "handle-in";
export const handleOutPrefix = "handle-out";
export const handleSeparator = "-";
const indexKeyHandleOut = 2;
const indexKeyHandleIn = 2;

export function getConfig() {
  return CONFIG;
}

export function isCompatibleConfigVersion(fileVersion: string | undefined) {
  return fileVersion === CONFIG.FLOW_VERSION;
}

export const generateIdForHandle = (key: number, isOutput?: boolean) =>
  !isOutput
    ? `${handleInPrefix}${handleSeparator}${key}`
    : `${handleOutPrefix}${handleSeparator}${key}`;

export function nodesTopologicalSort(
  nodes: BasicNode[],
  edges: BasicEdge[],
): Node[] {
  const visited = new Set<string>();
  const sortedNodes: Node[] = [];

  function visit(node: Node) {
    if (visited.has(node.id)) return;

    visited.add(node.id);

    const edgesToNode = edges.filter((edge) => edge.target === node.id);

    edgesToNode.forEach((edge) => {
      visit(nodes.find((node) => node.id === edge.source) as Node);
    });

    sortedNodes.push(node);
  }

  nodes.forEach((node) => visit(node));

  return sortedNodes;
}

export function findParents(node: BasicNode, edges: BasicEdge[]) {
  return edges
    .filter((edge) => edge.target === node.id)
    .map((edge) => edge.source);
}

export function formatFlow(nodes: BasicNode[], edges: BasicEdge[]) {
  const nodesSorted = nodesTopologicalSort(nodes, edges);

  const levelDict: any = {};

  nodesSorted.forEach((node) => {
    const parents = findParents(node, edges);
    if (parents.length === 0) {
      levelDict[node.id] = 0;
    } else {
      let maxParentLevel = Math.max(
        ...parents.map((parent) => levelDict[parent]),
      );
      levelDict[node.id] = maxParentLevel + 1;
    }
  });

  nodes.forEach((node) => {
    node.position.x = 700 * levelDict[node.id];
    node.position.y =
      400 *
      Object.keys(levelDict)
        .filter((n: string) => levelDict[n] === levelDict[node.id])
        .indexOf(node.id);
  });

  return nodes;
}

export const getTargetHandleKey: any = (edge: BasicEdge) => {
  return edge?.targetHandle?.split(handleSeparator)[indexKeyHandleIn];
};

export function clearSelectedNodes(nodes: Node[]) {
  return nodes.map((node) => {
    node.data.outputData = undefined;
    node.data.lastRun = undefined;
    return node;
  });
}

function getConfigEssentials(config: any) {
  const { fields, nodeName, inputNames, hasInputHandle, outputType } =
    config || {};
  return { fields, nodeName, inputNames, hasInputHandle, outputType };
}

export function convertFlowToJson(
  nodes: BasicNode[],
  edges: BasicEdge[],
  withCoordinates?: boolean,
  withConfig?: boolean,
): NodeData[] {
  return nodes.map((node: BasicNode) => {
    const { data, id, position } = node;
    const { config, ...nodeValues } = data;

    const inputEdges = edges.filter((edge: any) => edge.target === id);

    const inputs = inputEdges.map((edge: any) => {
      return convertEdgeToNodeInput(edge, nodes, node);
    });

    let nodeJson = { ...nodeValues, inputs };

    if (withConfig) {
      nodeJson.config = getConfigEssentials(config);
    }

    if (withCoordinates) {
      nodeJson = { ...nodeJson, x: position.x, y: position.y };
    }

    return nodeJson;
  });
}

export function convertEdgeToNodeInput(
  edge: any,
  nodes: BasicNode[],
  node: BasicNode,
) {
  const inputId = edge?.source || "";

  const keySplitted =
    edge?.sourceHandle?.split(handleSeparator)[indexKeyHandleOut];
  const inputNodeOutputKey =
    !keySplitted || isNaN(+keySplitted) ? undefined : +keySplitted;

  const inputNode =
    nodes.find((node: any) => node.id === inputId)?.data.name || "";

  const targetHandleKey = getTargetHandleKey(edge);

  return {
    inputName: !!node.data.config?.inputNames
      ? node.data.config.inputNames[targetHandleKey]
      : undefined,
    inputNode,
    inputNodeOutputKey,
  };
}

export function convertJsonToFlow(json: any): {
  nodes: BasicNode[];
  edges: BasicEdge[];
} {
  const nodes: BasicNode[] = [];
  const edges: BasicEdge[] = [];

  // Create nodes
  json.forEach((node: any) => {
    const { x, y, ...nodeData } = node;

    nodes.push({
      id: node.name,
      type: nodeData.processorType,
      position: { x, y },
      data: {
        ...nodeData,
        config: !!nodeData.config
          ? nodeData.config
          : getConfigViaType(nodeData.processorType),
      },
    });
  });

  // Create edges
  json.forEach((node: any) => {
    if (node.inputs) {
      node.inputs.forEach((input: any, index: number) => {
        let targetHandleIndex = index;
        const fields: Field[] = node.config?.fields;
        if (!!fields) {
          targetHandleIndex = fields.findIndex(
            (field) => field.name === input.inputName,
          );
          if (targetHandleIndex === -1) {
            targetHandleIndex = index;
          }
        }
        edges.push({
          id: `${input.inputNode}-to-${node.name}`,
          sourceHandle: generateIdForHandle(
            input.inputNodeOutputKey ?? 0,
            true,
          ),
          targetHandle: generateIdForHandle(targetHandleIndex),
          target: node.name,
          source: input.inputNode,
          type: "buttonedge",
        });
      });
    }

    //For old files
    if (node.input && !node.inputs) {
      edges.push({
        id: `${node.input}-to-${node.name}`,
        sourceHandle: !!node.inputKey
          ? generateIdForHandle(node.inputKey)
          : undefined,
        source: node.input,
        target: node.name,
        type: "buttonedge",
      });
    }
  });

  return { nodes, edges };
}

export function migrateConfig(oldConfig: FlowTab) {
  if (!oldConfig.metadata) {
    oldConfig.nodes.forEach((node) => {
      // arrangeOldType(node);
      // arrangeOldFields(node.data);
    });
  }
}
