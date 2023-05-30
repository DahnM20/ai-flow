import { Node, Edge } from "reactflow";
import { NodeData, NodeType, NodeTypeMapping, ProcessorType } from "../types/node";
import { nodeTypeMapping, processorTypeMapping, reverseMapping } from "./mappings";

const handlePrefix = 'handle';
const handleSeparator = '-';

export const generateIdForHandle = (key: number) => `${handlePrefix}${handleSeparator}${key}`;

export const getNodeType = (data: NodeData) => nodeTypeMapping[data.nodeType as keyof NodeTypeMapping] || 'processorNode';

export const getNodeTypeViaProcessorType = (processorType: ProcessorType) => processorTypeMapping[processorType] || 'processorNode';

export const getProcessorTypeViaNodeType = (nodeType: string) => reverseMapping[nodeType] || 'gpt';

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

export function convertFlowToJson(nodes: Node[], edges: Edge[], withCoordinates: boolean) {
  return nodes.map((node: Node) => {
    withCoordinates = true
    const { id, ...rest } = node;
    const inputEdge = edges.find((edge: any) => edge.target === id);
    const inputId = inputEdge?.source || '';

    const keySplitted = inputEdge?.sourceHandle?.split(handleSeparator)[1]
    const inputKey = !keySplitted || isNaN(+keySplitted) ? undefined : +keySplitted;
    
    //const outputId = edges.find((edge: any) => edge.source === id)?.target || '';

    let inputFound;
    if (node.data.processorType === 'inputFound') {
      inputFound = node.data?.inputFound;
    } else {
      inputFound = nodes.find((node: any) => node.id === inputId)?.data.name || '';
    }

    const { a, nodeType, output, input, config, ...nodeDataForConfig } = node.data;
    if (withCoordinates) {
      return {
        input: inputFound,
        inputKey,
        ...nodeDataForConfig,
        x: node.position.x,
        y: node.position.y,
      }
    } else {
      return {
        input: inputFound,
        inputKey,
        ...nodeDataForConfig,
        // output,
      };
    }
  });
}
export function convertJsonToFlow(json: any) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];


  // Create nodes
  json.forEach((node: any) => {
    const { x, y, ...nodeData } = node;
    nodes.push({
      id: node.name,
      type: getNodeTypeViaProcessorType(nodeData.processorType),
      position: { x, y },
      data: {
        ...nodeData
      },
    });
  });

  // Create edges
  json.forEach((node: any) => {
    if (node.input) {
      edges.push({
        id: `${node.input}-to-${node.name}`,
        source: node.input,
        target: node.name,
        type: 'smoothstep',
      });
    }
  });

  return { nodes, edges };
}
