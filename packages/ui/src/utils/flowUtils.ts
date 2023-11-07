import { Node, Edge } from "reactflow";
import { getConfigViaType } from "../nodesConfiguration/nodeConfig";
import { NodeData } from "../types/node";
import { FlowTab } from "../components/FlowTabs";

const CONFIG = {
  FLOW_VERSION: "1.0.0",
};

const handleInPrefix = 'handle-in';
const handleOutPrefix = 'handle-out';
const handleSeparator = '-';
const indexKeyHandleOut = 2;

export function getConfig() {
  return CONFIG;
}

export function isCompatibleConfigVersion(fileVersion: string | undefined) {
  return fileVersion === CONFIG.FLOW_VERSION;
}

export const generateIdForHandle = (key: number, isOutput?: boolean) => !isOutput ? `${handleInPrefix}${handleSeparator}${key}` : `${handleOutPrefix}${handleSeparator}${key}`;

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

export function convertFlowToJson(nodes: Node[], edges: Edge[], withCoordinates: boolean): NodeData[] {
  return nodes.map((node: Node) => {
    withCoordinates = true
    const { id, ...rest } = node;


    const inputEdges = edges.filter((edge: any) => edge.target === id);

    const inputs = inputEdges.map((edge: any, index) => {
      const inputId = edge?.source || '';

      const keySplitted = edge?.sourceHandle?.split(handleSeparator)[indexKeyHandleOut]
      const inputNodeOutputKey = !keySplitted || isNaN(+keySplitted) ? undefined : +keySplitted;

      const inputNode = nodes.find((node: any) => node.id === inputId)?.data.name || '';

      return {
        inputName: !!node.data.config?.inputNames ? node.data.config.inputNames[index] : undefined,
        inputNode,
        inputNodeOutputKey,
      }

    });

    const { a, nodeType, output, input, config, ...nodeDataForConfig } = node.data;

    if (withCoordinates) {
      return {
        inputs,
        ...nodeDataForConfig,
        x: node.position.x,
        y: node.position.y,
      }
    } else {
      return {
        inputs,
        ...nodeDataForConfig,
        // output,
      };
    }
  });
}
export function convertJsonToFlow(json: any): { nodes: Node[]; edges: Edge[]; } {
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
        config: getConfigViaType(nodeData.processorType),
      },
    });
  });

  // Create edges
  json.forEach((node: any) => {
    if (node.inputs) {
      node.inputs.forEach((input: any, index: number) => {
        edges.push({
          id: `${input.inputNode}-to-${node.name}`,
          sourceHandle: generateIdForHandle(input.inputNodeOutputKey ?? 0, true),
          targetHandle: generateIdForHandle(index),
          target: node.name,
          source: input.inputNode,
          type: 'smoothstep',
        });
      });
    }

    //For old files
    if (node.input && !node.inputs) {
      edges.push({
        id: `${node.input}-to-${node.name}`,
        sourceHandle: !!node.inputKey ? generateIdForHandle(node.inputKey) : undefined,
        source: node.input,
        target: node.name,
        type: 'smoothstep',
      });
    }
  });

  return { nodes, edges };
}

function arrangeOldFields(nodeData: any) {
  if (nodeData.processorType === 'gpt-no-context-prompt') {
    nodeData.processorType = "llm-prompt";
    nodeData.model = nodeData.gptVersion;
    nodeData.prompt = nodeData.inputText;
  }

  if (nodeData.processorType === 'ai-action') {
    if (!!nodeData.inputText) {
      nodeData.model = nodeData.gptVersion;
      nodeData.prompt = nodeData.inputText;
    }
  }

  nodeData.gptVersion = undefined;
  nodeData.inputText = undefined;
}

function arrangeOldType(node: any) {
  if (node.type === 'gpt-no-context-prompt') {
    node.type = "llm-prompt";
    node.data.config = getConfigViaType(node.type);
  }
}

export function migrateConfig(oldConfig: FlowTab) {
  if (!oldConfig.metadata) {
    oldConfig.nodes.forEach((node) => {
      arrangeOldType(node)
      arrangeOldFields(node.data)
    })
  }
}