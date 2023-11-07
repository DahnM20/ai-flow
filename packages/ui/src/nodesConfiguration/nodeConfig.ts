import { NodeType } from "../utils/mappings";
import dallENodeConfig from "./dallENode";
import inputTextNodeConfig from "./inputTextNode";
import { llmPromptNodeConfig } from "./llmPrompt";
import stableDiffusionStabilityAiNodeConfig from "./stableDiffusionStabilityAiNode";
import { urlNodeConfig } from "./urlNode";
import { youtubeTranscriptNodeConfig } from "./youtubeTranscriptNode";
import { mergerPromptNode } from "./mergerPromptNode";
import { gptVisionNodeConfig } from "./gptVisionNode";
import inputImageNodeConfig from "./inputImageNode";

export type SectionType = 'llm' | 'image-generation' | 'tools' | 'input'

export interface Option {
    label: string;
    value: string;
    default?: boolean;
}

export interface Field {
    name: string;
    type: 'input' | 'textarea' | 'select' | 'option' | 'inputNameBar';
    label?: string;
    placeholder?: string;
    options?: Option[];
    hideIfParent?: boolean;
}

export interface NodeConfig {
    nodeName: string;
    icon: string;
    inputNames?: string[];
    fields: Field[];
    hideFieldsIfParent?: boolean;
    outputType: 'text' | 'imageUrl' | 'imageBase64';
    defaultHideOutput?: boolean;
    hasInputHandle?: boolean;
    section: SectionType;
    helpMessage?: string;
}


export const nodeConfigs: { [key in NodeType]?: NodeConfig } = {
    'input-text': inputTextNodeConfig,
    'input-image': inputImageNodeConfig,
    'url_input': urlNodeConfig,
    'llm-prompt': llmPromptNodeConfig,
    'gpt-vision': gptVisionNodeConfig,
    'youtube_transcript_input': youtubeTranscriptNodeConfig,
    'dalle-prompt': dallENodeConfig,
    'stable-diffusion-stabilityai-prompt': stableDiffusionStabilityAiNodeConfig,
    'merger-prompt': mergerPromptNode,
    // add other configs here...
}
export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
    return nodeConfigs[type];
}
