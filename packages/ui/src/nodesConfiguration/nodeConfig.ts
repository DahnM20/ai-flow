import { FaImage, FaToolbox } from "react-icons/fa";
import { NodeType } from "../utils/mappings";
import { basicProcessorNodeConfig } from "./basicProcessorNode";
import dallENodeConfig from "./dallENode";
import inputTextNodeConfig from "./inputTextNode";
import { noContextPromptNodeConfig } from "./noContextPrompt";
import { promptNodeConfig } from "./promptNode";
import stableDiffusionStabilityAiNodeConfig from "./stableDiffusionStabilityAiNode";
import { urlNodeConfig } from "./urlNode";
import { youtubeTranscriptNodeConfig } from "./youtubeTranscriptNode";
import { IconType } from "react-icons/lib";
import { BsInputCursorText } from "react-icons/bs";
import { AiOutlineRobot } from "react-icons/ai";

export type SectionType = 'basic' | 'advanced';

export interface Option {
    label: string;
    value: string;
    default?: boolean;
}

export interface Field {
    name: string;
    type: 'input' | 'textarea' | 'select' | 'option';
    label?: string;
    placeholder?: string;
    options?: Option[];
    hideIfParent?: boolean;
}

export interface NodeConfig {
    nodeName: string;
    icon: string;
    fields: Field[];
    hideFieldsIfParent?: boolean;
    outputType: 'text' | 'imageUrl' | 'imageBase64';
    defaultHideOutput?: boolean;
    hasInputHandle?: boolean;
    section?: SectionType;
}


const nodeConfigs: { [key in NodeType]?: NodeConfig } = {
    'gpt-prompt': promptNodeConfig,
    'input-text': inputTextNodeConfig,
    'gpt': basicProcessorNodeConfig,
    'url_input': urlNodeConfig,
    'gpt-no-context-prompt': noContextPromptNodeConfig,
    'youtube_transcript_input': youtubeTranscriptNodeConfig,
    'dalle-prompt': dallENodeConfig,
    'stable-diffusion-stabilityai-prompt': stableDiffusionStabilityAiNodeConfig,
    // add other configs here...
}

export type NodeSection = {
    section: string;
    icon?: any;
    nodes: DnDNode[];
};

export type DnDNode = {
    label: string;
    type: NodeType;
    helpMessage?: string;
};

export const nodeSectionMapping: NodeSection[] = [
    {
        section: 'Input',
        icon: BsInputCursorText,
        nodes: [
            { label: 'Text', type: 'input-text', helpMessage: 'inputHelp' },
            { label: 'URL', type: 'url_input', helpMessage: 'urlInputHelp' },
            { label: 'YoutubeVideo', type: 'youtube_transcript_input', helpMessage: 'youtubeTranscriptHelp' },
        ],
    },
    {
        section: 'Models',
        icon: AiOutlineRobot,
        nodes: [
            { label: 'NoContextPrompt', type: 'gpt-no-context-prompt', helpMessage: 'noContextPromptHelp' },
            { label: 'AiAction', type: 'ai-action', helpMessage: 'aiActionPromptHelp' }
        ],
    },
    {
        section: 'ImageGeneration',
        icon: FaImage,
        nodes: [
            { label: 'DALL-E', type: 'dalle-prompt', helpMessage: 'dallePromptHelp' },
            { label: 'Stable Diffusion', type: 'stable-diffusion-stabilityai-prompt', helpMessage: 'stableDiffusionPromptHelp' }
        ],
    },
    {
        section: 'Tools',
        icon: FaToolbox,
        nodes: [//{ label: 'DataSplitter', type: 'data-splitter', helpMessage: 'dataSplitterHelp' },
            { label: 'DataSplitter', type: 'ai-data-splitter', helpMessage: 'dataSplitterHelp' }],
    }
];


export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
    return nodeConfigs[type];
}
