import { AiOutlineRobot } from "react-icons/ai";
import { BsInputCursorText } from "react-icons/bs";
import { FaImage, FaToolbox } from "react-icons/fa";
import { NodeType } from "../utils/mappings";
import { NodeConfig, SectionType, nodeConfigs } from "./nodeConfig";

export type NodeSection = {
  label: string;
  type: SectionType;
  icon?: any;
  nodes?: DnDNode[];
};

export type DnDNode = {
  label: string;
  type: NodeType;
  helpMessage?: string;
  section: SectionType;
  isBeta?: boolean;
};

function transformNodeConfigsToDndNode(configs: {
  [key in NodeType]?: NodeConfig;
}): DnDNode[] {
  return Object.entries(configs).map(([type, config]) => {
    return {
      label: config.nodeName,
      type: type,
      helpMessage: config.helpMessage || undefined,
      section: config.section,
    } as DnDNode;
  });
}

function getAllDndNode(): DnDNode[] {
  const nonGenericNodeConfig: DnDNode[] = [
    {
      label: "AiAction",
      type: "ai-action",
      helpMessage: "aiActionPromptHelp",
      section: "tools",
    },
    {
      label: "FileUpload",
      type: "file",
      helpMessage: "fileUploadHelp",
      section: "input",
    },
    {
      label: "AiDataSplitter",
      type: "ai-data-splitter",
      helpMessage: "dataSplitterHelp",
      section: "tools",
    },
    {
      label: "ReplicateModel",
      type: "replicate",
      helpMessage: "replicateHelp",
      section: "models",
      isBeta: true,
    },
    {
      label: "Transition",
      type: "transition",
      helpMessage: "transitionHelp",
      section: "tools",
    },
  ];
  return transformNodeConfigsToDndNode(nodeConfigs).concat(
    nonGenericNodeConfig,
  );
}

export const emptyNodeSections: NodeSection[] = [
  {
    label: "Input",
    type: "input",
    icon: BsInputCursorText,
  },
  {
    label: "Models",
    type: "models",
    icon: AiOutlineRobot,
  },
  {
    label: "Tools",
    type: "tools",
    icon: FaToolbox,
  },
];

const populateNodeSections = (nodeSection: NodeSection[]) => {
  const nodes = getAllDndNode();

  nodes.forEach((node) => {
    const section = nodeSection.find((sec) => sec.type === node.section);

    if (section) {
      if (!section.nodes) {
        section.nodes = [];
      }
      section.nodes.push(node);
    }
  });

  return nodeSection;
};

export const nodeSectionMapping = populateNodeSections(emptyNodeSections);
