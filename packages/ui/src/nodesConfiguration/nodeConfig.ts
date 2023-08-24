import { NodeType } from "../utils/mappings";
import { basicProcessorNodeConfig } from "./basicProcessorNode";
import inputTextNodeConfig from "./inputTextNode";
import { noContextPromptNodeConfig } from "./noContextPrompt";
import { promptNodeConfig } from "./promptNode";
import { urlNodeConfig } from "./urlNode";
import { youtubeTranscriptNodeConfig } from "./youtubeTranscriptNode";

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
}

export interface NodeConfig {
    nodeName: string;
    icon: string;
    fields: Field[];
    outputType: 'text' | 'image';
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
    // add other configs here...
}

export type NodeSection = {
    section: string;
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
        nodes: [
            { label: 'Text', type: 'input-text', helpMessage: 'inputHelp' },
            { label: 'URL', type: 'url_input', helpMessage: 'urlInputHelp' },
            { label: 'YoutubeVideo', type: 'youtube_transcript_input', helpMessage: 'youtubeTranscriptHelp' },
        ],
    },
    {
        section: 'Models',
        nodes: [
            { label: 'NoContextPrompt', type: 'gpt-no-context-prompt', helpMessage: 'noContextPromptHelp' }
        ],
    },
    {
        section: 'ImageGeneration',
        nodes: [{ label: 'DALL-E', type: 'dalle-prompt', helpMessage: 'dallePromptHelp' }],
    },
    {
        section: 'Tools',
        nodes: [//{ label: 'DataSplitter', type: 'data-splitter', helpMessage: 'dataSplitterHelp' },
            { label: 'DataSplitter', type: 'ai-data-splitter', helpMessage: 'dataSplitterHelp' }],
    },
    {
        section: 'AdvancedSection',
        nodes: [
            { label: 'GPT', type: 'gpt', helpMessage: 'gptHelp' },
            { label: 'GPTPrompt', type: 'gpt-prompt', helpMessage: 'gptPromptHelp' },
        ]
    }
];


export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
    return nodeConfigs[type];
}
