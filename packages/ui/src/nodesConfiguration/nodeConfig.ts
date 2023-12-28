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
import stableVideoDiffusionReplicateNodeConfig from "./stableVideoDiffusionNode";

export type SectionType = 'models' | 'image-generation' | 'tools' | 'input'

export interface Option {
    label: string;
    value: string;
    default?: boolean;
}

export interface Field {
    name: string;
    type: 'input' | 'inputInt' | 'textarea' | 'select' | 'option' | 'inputNameBar' | 'boolean' | 'slider';
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    max?: number;
    min?: number;
    options?: Option[];
    hideIfParent?: boolean;
    optionnal?: boolean;
    hasHandle?: boolean;
    isLinked?: boolean;
}

export interface NodeConfig {
    nodeName: string;
    icon: string;
    inputNames?: string[];
    fields: Field[];
    hideFieldsIfParent?: boolean;
    outputType: 'text' | 'imageUrl' | 'imageBase64' | 'videoUrl';
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
    'stable-video-diffusion-replicate': stableVideoDiffusionReplicateNodeConfig,
    'merger-prompt': mergerPromptNode,
    // add other configs here...
}
export const getConfigViaType = (type: NodeType): NodeConfig | undefined => {
    return nodeConfigs[type];
}
