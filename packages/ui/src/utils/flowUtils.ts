import { Node, Edge } from "reactflow";
import { Field, getConfigViaType } from "../nodes-configuration/nodeConfig";
import { NodeData } from "../components/nodes/types/node";
import { FlowTab } from "../layout/main-layout/AppLayout";

const CONFIG = {
  FLOW_VERSION: "1.0.0",
};

const handleInPrefix = "handle-in";
const handleOutPrefix = "handle-out";
const handleSeparator = "-";
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

export function nodesTopologicalSort(nodes: Node[], edges: Edge[]): Node[] {
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

export function findParents(node: Node, edges: Edge[]) {
  return edges
    .filter((edge) => edge.target === node.id)
    .map((edge) => edge.source);
}

export function formatFlow(nodes: Node[], edges: Edge[]) {
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

export const getTargetHandleKey: any = (edge: Edge) => {
  return edge?.targetHandle?.split(handleSeparator)[indexKeyHandleIn];
};

export function clearSelectedNodes(nodes: Node[]) {
  return nodes.map((node) => {
    node.data.outputData = undefined;
    node.data.lastRun = undefined;
    return node;
  });
}

export function convertFlowToJson(
  nodes: Node[],
  edges: Edge[],
  withCoordinates?: boolean,
  withConfig?: boolean,
): NodeData[] {
  return nodes.map((node: Node) => {
    const { id, ...rest } = node;

    const inputEdges = edges.filter((edge: any) => edge.target === id);

    const inputs = inputEdges.map((edge: any) => {
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
    });

    const { a, nodeType, output, input, config, ...nodeValues } = node.data;

    const fields = config?.fields;
    const nodeName = config?.nodeName;
    const inputNames = config?.inputNames;
    const hasInputHandle = config?.hasInputHandle;

    const configEssentials = {
      fields,
      nodeName,
      inputNames,
      hasInputHandle,
      outputType: config?.outputType,
    };

    if (withCoordinates) {
      return {
        ...nodeValues,
        inputs,
        config: withConfig ? configEssentials : undefined,
        x: node.position.x,
        y: node.position.y,
      };
    } else {
      return {
        ...nodeValues,
        inputs,
        config: withConfig ? configEssentials : undefined,
      };
    }
  });
}
export function convertJsonToFlow(json: any): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes
  json.forEach((node: any) => {
    const { x, y, ...nodeData } = node;

    //Temp - for old files
    arrangeOldFields(nodeData);

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

function arrangeOldFields(nodeData: any) {
  if (nodeData.processorType === "gpt-no-context-prompt") {
    nodeData.processorType = "llm-prompt";
    nodeData.model = nodeData.gptVersion;
    nodeData.prompt = nodeData.inputText;
  }

  if (nodeData.processorType === "ai-action") {
    if (!!nodeData.inputText) {
      nodeData.model = nodeData.gptVersion;
      nodeData.prompt = nodeData.inputText;
    }
  }

  nodeData.gptVersion = undefined;
  nodeData.inputText = undefined;
}

function arrangeOldType(node: any) {
  if (node.type === "gpt-no-context-prompt") {
    node.type = "llm-prompt";
    node.data.config = getConfigViaType(node.type);
  }
}

export function migrateConfig(oldConfig: FlowTab) {
  if (!oldConfig.metadata) {
    oldConfig.nodes.forEach((node) => {
      arrangeOldType(node);
      arrangeOldFields(node.data);
    });
  }
}
