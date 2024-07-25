from enum import Enum


class MergeModeEnum(Enum):
    MERGE = 1
    MERGE_AND_PROMPT = 2


class ProcessorType(Enum):
    INPUT_TEXT = "input-text"
    INPUT_IMAGE = "input-image"
    URL_INPUT = "url_input"
    LLM_PROMPT = "llm-prompt"
    GPT_VISION = "gpt-vision"
    YOUTUBE_TRANSCRIPT_INPUT = "youtube_transcript_input"
    DALLE_PROMPT = "dalle-prompt"
    STABLE_DIFFUSION_STABILITYAI_PROMPT = "stable-diffusion-stabilityai-prompt"
    STABLE_VIDEO_DIFFUSION_REPLICATE = "stable-video-diffusion-replicate"
    REPLICATE = "replicate"
    MERGER_PROMPT = "merger-prompt"
    AI_DATA_SPLITTER = "ai-data-splitter"
    AI_ACTION = "ai-action"
    TRANSITION = "transition"
    DISPLAY = "display"
    FILE = "file"
    STABLE_DIFFUSION_THREE = "stabilityai-stable-diffusion-3-processor"
    TEXT_TO_SPEECH = "openai-text-to-speech-processor"
    DOCUMENT_TO_TEXT = "document-to-text-processor"
    STABILITYAI = "stabilityai-generic-processor"
    CLAUDE = "claude-anthropic-processor"
