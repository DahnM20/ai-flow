import { AiOutlineRobot } from "react-icons/ai";
import { BsInputCursorText } from "react-icons/bs";
import { FaToolbox } from "react-icons/fa";
import { NodeConfig, SectionType } from "./types";
import { nodeConfigs } from "./nodeConfig";
import { getNodesHiddenList } from "../components/popups/config-popup/parameters";

export type NodeSection = {
  label: string;
  type: SectionType;
  icon?: any;
  nodes?: DnDNode[];
};

export type DnDNode = {
  label: string;
  type: string;
  helpMessage?: string;
  section: SectionType;
  isBeta?: boolean;
};

export function transformNodeConfigsToDndNode(configs: {
  [key: string]: NodeConfig | undefined;
}): DnDNode[] {
  return Object.entries(configs).map(([type, config]) => {
    return {
      label: config?.nodeName,
      type: type,
      helpMessage: config?.helpMessage || undefined,
      section: config?.section,
      isBeta: config?.isBeta,
    } as DnDNode;
  });
}

export function getNonGenericNodeConfig() {
  const nonGenericNodeConfig: DnDNode[] = [
    {
      label: "AiAction",
      type: "ai-action",
      helpMessage: "aiActionPromptHelp",
      section: "tools",
    },
    {
      label: "File",
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
    {
      label: "Display",
      type: "display",
      helpMessage: "displayHelp",
      section: "tools",
    },
    // {
    //   label: "Text",
    //   type: "text",
    //   helpMessage: "imageHelp",
    //   section: "visuals",
    // },
  ];
  return nonGenericNodeConfig;
}

function getAllDndNode(): DnDNode[] {
  const nodesDisabled = getNodesHiddenList();
  const nonGenericNodeConfig = getNonGenericNodeConfig();
  return transformNodeConfigsToDndNode(nodeConfigs)
    .concat(nonGenericNodeConfig)
    .filter((node) => !nodesDisabled.includes(node.type));
}

export const populateNodeSections = () => {
  const emptyNodeSections: NodeSection[] = [
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
    // {
    //   label: "Visuals",
    //   type: "visuals",
    //   icon: BsInputCursorText,
    // },
  ];
  const nodes = getAllDndNode();

  nodes.forEach((node) => {
    const section = emptyNodeSections.find((sec) => sec.type === node.section);

    if (section) {
      if (!section.nodes) {
        section.nodes = [];
      }
      section.nodes.push(node);
    }
  });

  const sectionFiltered = emptyNodeSections.filter(
    (sec) => sec.nodes && sec.nodes.length > 0,
  );

  return sectionFiltered;
};

export const getSections = () => populateNodeSections();
