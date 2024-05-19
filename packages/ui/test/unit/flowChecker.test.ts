import { NodeData, NodeInput } from "../../src/components/nodes/types/node";
import * as flowChecker from "../../src/utils/flowChecker";

describe("getNodeMissingFields", () => {
  beforeAll(() => {
    vi.spyOn(flowChecker, "isFieldLinkedToAnotherNode").mockImplementation(
      (field, node) => {
        if (field.name === "validMockedLinkedField") {
          return "input";
        }
      },
    );
  });

  // it("identifies missing required fields correctly", () => {
  //   const nodeData: NodeData = {
  //     name: "ExampleNode",
  //     model: "example-model",
  //     inputs: [],
  //     config: {
  //       nodeName: "Example Node",
  //       fields: [
  //         { name: "mandatoryField", type: "input", required: true },
  //         { name: "optionalField", type: "input", required: false },
  //         { name: "validMockedLinkedField", type: "input", required: true },
  //       ],
  //       icon: "",
  //       outputType: "imageUrl",
  //       section: "input",
  //     },
  //     mandatoryField: "",
  //     id: "",
  //     handles: undefined,
  //     processorType: "gpt",
  //     nbOutput: 0,
  //   };

  //   const missingFields = flowChecker.getNodeMissingFields(nodeData);

  //   expect(missingFields).toEqual(["mandatoryField"]);
  // });

  it("identifies missing fields when no fields are linked", () => {
    const nodeData: NodeData = {
      name: "IncompleteNode",
      model: "incomplete-model",
      inputs: [],
      config: {
        fields: [
          { name: "missingMandatoryField", type: "input", required: true },
          { name: "optionalField", type: "input", required: false },
          { name: "missingLinkedField", type: "input", required: true },
        ],
        nodeName: "",
        icon: "",
        outputType: "imageUrl",
        section: "input",
      },
      presentOptionalField: "Present",
      id: "",
      handles: undefined,
      processorType: "gpt",
      nbOutput: 0,
    };

    const missingFields = flowChecker.getNodeMissingFields(nodeData);

    expect(missingFields).toEqual([
      "missingMandatoryField",
      "missingLinkedField",
    ]);
  });

  it("returns empty array when no field is missing", () => {
    const nodeData: NodeData = {
      name: "IncompleteNode",
      model: "incomplete-model",
      inputs: [],
      config: {
        fields: [{ name: "optionalField", type: "input", required: false }],
        nodeName: "",
        icon: "",
        outputType: "imageUrl",
        section: "input",
      },
      presentOptionalField: "Present",
      id: "",
      handles: undefined,
      processorType: "gpt",
      nbOutput: 0,
    };

    const missingFields = flowChecker.getNodeMissingFields(nodeData);

    expect(missingFields).toEqual([]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});

function createNode({
  name = "",
  inputs = [] as NodeInput[],
  id = "",
  handles = [],
  nbOutput = 0,
  processorType = "gpt-prompt",
  config = {
    nodeName: "",
    icon: "",
    fields: [],
    outputType: "imageUrl",
    section: "input",
  },
} = {}) {
  return {
    name,
    inputs,
    id,
    handles,
    nbOutput,
    processorType,
    config,
  } as NodeData;
}

describe("getRequiredNodesForLaunch", () => {
  const flowFile = [
    createNode({ name: "StartNode" }),
    createNode({
      name: "MiddleNode",
      inputs: [
        { inputNode: "StartNode", inputName: "", inputNodeOutputKey: 0 },
      ],
    }),
    createNode({
      name: "EndNode",
      inputs: [
        { inputNode: "MiddleNode", inputName: "", inputNodeOutputKey: 0 },
      ],
    }),
    createNode({ name: "IndependentNode" }),
    createNode({
      name: "BranchNode",
      inputs: [
        { inputNode: "StartNode", inputName: "", inputNodeOutputKey: 0 },
        { inputNode: "IndependentNode", inputName: "", inputNodeOutputKey: 0 },
      ],
    }),
  ];

  it("returns the correct single node when there are no dependencies", () => {
    const requiredNodes = flowChecker.getRequiredNodesForLaunch(
      flowFile,
      "StartNode",
    );
    expect(requiredNodes).toEqual(["StartNode"]);
  });

  it("returns a linear dependency chain correctly", () => {
    const requiredNodes = flowChecker.getRequiredNodesForLaunch(
      flowFile,
      "EndNode",
    );
    expect(requiredNodes).toEqual(["StartNode", "MiddleNode", "EndNode"]);
  });

  it("handles branches in the dependency graph correctly", () => {
    const requiredNodes = flowChecker.getRequiredNodesForLaunch(
      flowFile,
      "BranchNode",
    );
    expect(requiredNodes).toEqual([
      "StartNode",
      "IndependentNode",
      "BranchNode",
    ]);
  });

  it("returns no dependencies when the node does not exist in the flow", () => {
    const requiredNodes = flowChecker.getRequiredNodesForLaunch(
      flowFile,
      "NonexistentNode",
    );
    expect(requiredNodes).toEqual(["NonexistentNode"]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
