import {
  BasicEdge,
  BasicNode,
  convertEdgeToNodeInput,
  convertFlowToJson,
  findParents,
  generateIdForHandle,
  handleInPrefix,
  handleOutPrefix,
  handleSeparator,
  nodesTopologicalSort,
} from "../../src/utils/flowUtils";

function createNode(
  id: string,
  name?: string,
  data?: any,
  position?: any,
): BasicNode {
  return {
    id,
    data: name ? { name, ...data } : { ...data },
    position: position ?? { x: 0, y: 0 },
  };
}

function createEdge(
  id: string,
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string,
): BasicEdge {
  return { id, source, target, sourceHandle, targetHandle };
}

// Initial setup
const nodes: BasicNode[] = [
  createNode("node1"),
  createNode("node2"),
  createNode("node3"),
  createNode("node4"),
];

const edges: BasicEdge[] = [
  createEdge("1", "node1", "node2"),
  createEdge("2", "node2", "node3"),
  createEdge("3", "node3", "node4"),
];

describe("nodesTopologicalSort", () => {
  it("should sort nodes correctly based on dependencies", () => {
    const expectedSortedNodes: Partial<BasicNode>[] = [
      { id: "node1" },
      { id: "node2" },
      { id: "node3" },
      { id: "node4" },
    ];

    const sortedNodesIds = nodesTopologicalSort(nodes, edges).map((node) => {
      return { id: node.id };
    });

    expect(sortedNodesIds).toStrictEqual(expectedSortedNodes);
  });

  it("should work with disconnected subgraphs", () => {
    const disconnectedNode = createNode("node5");
    const updatedNodes = [...nodes, disconnectedNode];

    const expectedSortedNodesWithDisconnected: Partial<BasicNode>[] = [
      { id: "node1" },
      { id: "node2" },
      { id: "node3" },
      { id: "node4" },
      { id: "node5" },
    ];

    const sortedNodes = nodesTopologicalSort(updatedNodes, edges).map(
      (node) => {
        return { id: node.id };
      },
    );

    expect(sortedNodes).toEqual(
      expect.arrayContaining(expectedSortedNodesWithDisconnected),
    );
  });

  it("should return an empty array when no nodes are provided", () => {
    expect(nodesTopologicalSort([], [])).toEqual([]);
  });
});

describe("convertEdgeToNodeInput", () => {
  it("converts an edge to node input correctly", () => {
    const nodes: BasicNode[] = [
      createNode("node1", "FirstNode"),
      createNode("node2", "SecondNode"),
    ];

    const edge: BasicEdge = createEdge("1", "node1", "node2", "handle-out-1");

    const result = convertEdgeToNodeInput(edge, nodes, nodes[1]);

    const expectedResult = {
      inputName: undefined,
      inputNode: "FirstNode",
      inputNodeOutputKey: 1,
    };

    expect(result).toEqual(expectedResult);
  });
});

describe("findParents", () => {
  it("returns an empty array when the node has no parents", () => {
    const nodes: BasicNode[] = [createNode("node1"), createNode("node2")];
    const edges: BasicEdge[] = [createEdge("1", "node1", "node2")];
    const nodeWithoutParents = nodes[0];

    const parents = findParents(nodeWithoutParents, edges);

    expect(parents).toEqual([]);
  });

  it("returns a single parent when the node has one parent", () => {
    const nodes: BasicNode[] = [createNode("node1"), createNode("node2")];
    const edges: BasicEdge[] = [createEdge("1", "node1", "node2")];
    const childNode = nodes[1];

    const parents = findParents(childNode, edges);

    expect(parents).toEqual(["node1"]);
  });

  it("returns multiple parents when the node has multiple parents", () => {
    const nodes: BasicNode[] = [
      createNode("node1"),
      createNode("node2"),
      createNode("node3"),
    ];
    const edges: BasicEdge[] = [
      createEdge("1", "node1", "node3"),
      createEdge("2", "node2", "node3"),
    ];
    const childNode = nodes[2];

    const parents = findParents(childNode, edges);

    expect(parents).toEqual(expect.arrayContaining(["node1", "node2"]));
  });
});

describe("generateIdForHandle", () => {
  it("generates an ID for an input handle correctly", () => {
    const key = 1;
    const isOutput = false;
    const expectedId = `${handleInPrefix}${handleSeparator}${key}`;

    const result = generateIdForHandle(key, isOutput);

    expect(result).toBe(expectedId);
  });

  it("generates an ID for an output handle correctly", () => {
    const key = 2;
    const isOutput = true;
    const expectedId = `${handleOutPrefix}${handleSeparator}${key}`;

    const result = generateIdForHandle(key, isOutput);

    expect(result).toBe(expectedId);
  });
});

describe("convertFlowToJson", () => {
  it("converts a flow to JSON correctly", () => {
    const firstNodeName = "FirstNode";
    const secondNodeName = "SecondNode";

    const nodes: BasicNode[] = [
      createNode("node1", firstNodeName, {
        model: "gpt-4",
        config: {
          fields: [],
          nodeName: firstNodeName,
        },
      }),
      createNode("node2", secondNodeName, {
        model: "gpt-3.5",
        config: {
          fields: [],
          nodeName: secondNodeName,
        },
      }),
    ];

    const edges: BasicEdge[] = [
      createEdge("1", "node1", "node2", "handle-out-0"),
    ];

    const result = convertFlowToJson(nodes, edges, true, true);

    const expectedResult = [
      {
        name: firstNodeName,
        model: "gpt-4",
        inputs: [],
        config: {
          fields: [],
          hasInputHandle: undefined,
          inputNames: undefined,
          nodeName: firstNodeName,
          outputType: undefined,
        },
        x: 0,
        y: 0,
      },
      {
        name: secondNodeName,
        model: "gpt-3.5",
        inputs: [
          {
            inputName: undefined,
            inputNode: firstNodeName,
            inputNodeOutputKey: 0,
          },
        ],
        config: {
          fields: [],
          hasInputHandle: undefined,
          inputNames: undefined,
          nodeName: secondNodeName,
          outputType: undefined,
        },
        x: 0,
        y: 0,
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("converts a complex flow with multiple inputs and configurations to JSON correctly", () => {
    const firstNodeName = "InputNode";
    const secondNodeName = "ProcessingNode1";
    const thirdNodeName = "ProcessingNode2";

    const nodes: BasicNode[] = [
      createNode(
        "node1",
        firstNodeName,
        {
          model: "custom-model",
          config: {
            fields: [],
            nodeName: firstNodeName,
          },
        },
        {
          x: 0,
          y: 0,
        },
      ),
      createNode(
        "node2",
        secondNodeName,
        {
          model: "enhanced-model",
          config: {
            fields: [],
            nodeName: secondNodeName,
            inputNames: ["prompt-input-node-2"],
            hasInputHandle: true,
          },
        },
        {
          x: 100,
          y: 100,
        },
      ),
      createNode(
        "node3",
        thirdNodeName,
        {
          model: "advanced-model",
          config: {
            fields: [],
            nodeName: thirdNodeName,
            inputNames: ["prompt-input-node-3"],
            hasInputHandle: true,
          },
        },
        {
          x: 200,
          y: 200,
        },
      ),
    ];

    const edges: BasicEdge[] = [
      createEdge("1", "node1", "node2", "handle-out-0", "handle-in-0"),
      createEdge("2", "node1", "node3", "handle-out-0", "handle-in-0"),
    ];

    const result = convertFlowToJson(nodes, edges, true, true);

    const expectedResult = [
      {
        name: firstNodeName,
        model: "custom-model",
        inputs: [],
        config: {
          fields: [],
          inputNames: undefined,
          nodeName: firstNodeName,
          hasInputHandle: undefined,
        },
        x: 0,
        y: 0,
      },
      {
        name: secondNodeName,
        model: "enhanced-model",
        inputs: [
          {
            inputName: "prompt-input-node-2",
            inputNode: firstNodeName,
            inputNodeOutputKey: 0,
          },
        ],
        config: {
          fields: [],
          nodeName: secondNodeName,
          inputNames: ["prompt-input-node-2"],
          hasInputHandle: true,
        },
        x: 100,
        y: 100,
      },
      {
        name: thirdNodeName,
        model: "advanced-model",
        inputs: [
          {
            inputName: "prompt-input-node-3",
            inputNode: firstNodeName,
            inputNodeOutputKey: 0,
          },
        ],
        config: {
          fields: [],
          nodeName: thirdNodeName,
          inputNames: ["prompt-input-node-3"],
          hasInputHandle: true,
        },
        x: 200,
        y: 200,
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});
