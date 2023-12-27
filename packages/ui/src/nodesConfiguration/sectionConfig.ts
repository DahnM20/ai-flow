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
}

function transformNodeConfigsToDndNode(configs: { [key in NodeType]?: NodeConfig }): DnDNode[] {
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
        { label: 'AiAction', type: 'ai-action', helpMessage: 'aiActionPromptHelp', section: 'llm' },
        { label: 'AiDataSplitter', type: 'ai-data-splitter', helpMessage: 'dataSplitterHelp', section: 'tools' },
        { label: 'ReplicateModel', type: 'replicate', helpMessage: 'replicateHelp', section: 'llm', isBeta: true },
        //{ label: 'FileDropNode', type: 'file-drop', helpMessage: 'fileDropHelp', section: 'input' },
    ]
    return transformNodeConfigsToDndNode(nodeConfigs).concat(nonGenericNodeConfig);
}

export const emptyNodeSections: NodeSection[] = [
    {
        label: 'Input',
        type: 'input',
        icon: BsInputCursorText,
    },
    {
        label: 'Models',
        type: 'llm',
        icon: AiOutlineRobot,
    },
    {
        label: 'ImageGeneration',
        type: 'image-generation',
        icon: FaImage,
    },
    {
        label: 'Tools',
        type: 'tools',
        icon: FaToolbox,
    }
];


const populateNodeSections = (nodeSection: NodeSection[]) => {
    const nodes = getAllDndNode();

    nodes.forEach(node => {
        const section = nodeSection.find(sec => sec.type === node.section);

        if (section) {
            if (!section.nodes) {
                section.nodes = [];
            }
            section.nodes.push(node);
        }
    });

    return nodeSection;
}

export const nodeSectionMapping = populateNodeSections(emptyNodeSections);