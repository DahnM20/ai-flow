import logging
import re
from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option, Condition
from .extension_processor import ContextAwareExtensionProcessor
from openai import OpenAI
from datetime import datetime
import io
from pydub import AudioSegment
import eventlet


class OpenAITextToSpeechProcessor(ContextAwareExtensionProcessor):
    processor_type = "openai-text-to-speech-processor"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

    def get_node_config(self):
        text = Field(
            name="text",
            label="text",
            type="textfield",
            required=True,
            placeholder="InputTextPlaceholder",
            hasHandle=True,
        )

        voices_options = [
            Option(
                default=True,
                value="alloy",
                label="alloy",
            ),
            Option(
                default=False,
                value="ash",
                label="ash",
            ),
            Option(
                default=False,
                value="ballad",
                label="ballad",
            ),
            Option(
                default=False,
                value="coral",
                label="coral",
            ),
            Option(
                default=False,
                value="echo",
                label="echo",
            ),
            Option(
                default=False,
                value="fable",
                label="fable",
            ),
            Option(
                default=False,
                value="onyx",
                label="onyx",
            ),
            Option(
                default=False,
                value="nova",
                label="nova",
            ),
            Option(
                default=False,
                value="sage",
                label="sage",
            ),
            Option(
                default=False,
                value="shimmer",
                label="shimmer",
            ),
        ]

        voice = Field(
            name="voice",
            label="voice",
            type="select",
            options=voices_options,
            required=True,
        )

        model_options = [
            Option(
                default=True,
                value="gpt-4o-mini-tts",
                label="gpt-4o-mini-tts",
            ),
            Option(
                default=False,
                value="tts-1",
                label="tts-1",
            ),
            Option(
                default=False,
                value="tts-1-hd",
                label="tts-1-hd",
            ),
        ]

        model = Field(
            name="model",
            label="model",
            type="select",
            options=model_options,
            required=True,
        )

        instructions_enabled_condition = Condition(
            field="model", operator="equals", value="gpt-4o-mini-tts"
        )

        instructions = Field(
            name="instruction",
            label="instruction",
            type="textfield",
            required=False,
            placeholder="TTSInstructionPlaceholder",
            description="TTSInstructionDescription",
            hasHandle=True,
            condition=instructions_enabled_condition,
        )

        fields = [text, model, voice, instructions]

        config = NodeConfig(
            nodeName="TextToSpeech",
            processorType=self.processor_type,
            icon="OpenAILogo",
            fields=fields,
            outputType="audioUrl",
            section="models",
            helpMessage="textToSpeechHelp",
            showHandlesNames=True,
            keywords=["Audio", "Speech", "OpenAI", "TTS"],
        )

        return config

    def split_text_into_chunks(text, max_length=4096):
        """
        Split text into chunks of up to max_length characters by packing as many whole sentences as possible.
        If a single sentence exceeds max_length, split it into smaller parts.
        """
        # Split text by sentence-ending punctuation followed by whitespace.
        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks = []
        current_sentences = []
        current_length = 0

        for sentence in sentences:
            sentence_length = len(sentence)
            # Add a space if there is already a sentence in the current chunk.
            additional_length = (
                sentence_length if not current_sentences else sentence_length + 1
            )

            if current_length + additional_length <= max_length:
                # Append sentence to the current chunk.
                current_sentences.append(sentence)
                current_length += additional_length
            else:
                # Flush the current chunk if it's not empty.
                if current_sentences:
                    chunks.append(" ".join(current_sentences))
                    current_sentences = []
                    current_length = 0

                # If the sentence itself is too long, split it into parts.
                if sentence_length > max_length:
                    parts = [
                        sentence[i : i + max_length]
                        for i in range(0, sentence_length, max_length)
                    ]
                    # All full parts are separate chunks.
                    chunks.extend(parts[:-1])
                    # The last part might be less than max_length; add it to current chunk.
                    current_sentences = [parts[-1]]
                    current_length = len(parts[-1])
                else:
                    # Start a new chunk with the sentence.
                    current_sentences = [sentence]
                    current_length = sentence_length

        if current_sentences:
            chunks.append(" ".join(current_sentences))
        return chunks

    def process(self):
        text = self.get_input_by_name("text")
        voice = self.get_input_by_name("voice")
        model = self.get_input_by_name("model")
        instruction = self.get_input_by_name("instruction", None)

        if text is None:
            return None

        api_key = self._processor_context.get_value("openai_api_key")

        if api_key is None:
            raise Exception("No OpenAI API key found")

        client = OpenAI(api_key=api_key)

        # Split text into chunks that are each less than or equal to 4096 characters.
        chunks = OpenAITextToSpeechProcessor.split_text_into_chunks(text, 4096)
        pool = eventlet.GreenPool(2)

        def create_audio_segment(chunk):
            kwargs = {
                "model": model,
                "voice": voice,
                "input": chunk,
            }

            if instruction is not None:
                kwargs["instructions"] = instruction

            response = client.audio.speech.create(**kwargs)
            if response is None:
                return None
            # Convert the response content (mp3 bytes) into an AudioSegment.
            return AudioSegment.from_file(io.BytesIO(response.content), format="mp3")

        # Process chunks concurrently; imap preserves the order of chunks.
        audio_segments = list(pool.imap(create_audio_segment, chunks))
        # Filter out any None segments.
        audio_segments = [segment for segment in audio_segments if segment is not None]

        if not audio_segments:
            return None

        # Merge the audio segments.
        merged_audio = audio_segments[0]
        for seg in audio_segments[1:]:
            merged_audio += seg

        # Export merged audio to a bytes buffer.
        merged_audio_buffer = io.BytesIO()
        merged_audio.export(merged_audio_buffer, format="mp3")
        merged_audio_buffer.seek(0)

        storage = self.get_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{self.name}-{timestamp_str}.mp3"
        url = storage.save(filename, merged_audio_buffer.read())

        # cleanup
        merged_audio_buffer.close()
        del merged_audio_buffer
        del merged_audio
        del audio_segments

        return url

    def cancel(self):
        pass
