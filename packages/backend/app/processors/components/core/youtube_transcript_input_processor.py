import logging

from ...utils.retry_mixin import RetryMixin

from ...exceptions import LightException

from ..processor import BasicProcessor
from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

from .processor_type_name_utils import ProcessorType


class YoutubeTranscriptInputProcessor(BasicProcessor, RetryMixin):
    processor_type = ProcessorType.YOUTUBE_TRANSCRIPT_INPUT

    def __init__(self, config):
        super().__init__(config)
        self.max_retries = 2
        self.retry_delay = 0

    def get_video_id(self):
        if "watch?v=" in self.url:
            return self.url.split("watch?v=")[-1].split("&")[0]
        elif "youtu.be/" in self.url:
            return self.url.split("youtu.be/")[-1].split("?")[0]
        else:
            raise LightException(f"Invalid YouTube URL {self.url}")

    def process_with_youtube_transcript_api(self):
        video_id = self.get_video_id()

        try:
            transcript_data = self.get_transcript(video_id)

        except (TranscriptsDisabled, NoTranscriptFound) as e:
            logging.warning(
                f"Transcript not available or disabled for video {self.url}"
            )
            logging.debug(e)
            raise Exception(f"No transcription found for {self.url}")

        except VideoUnavailable as e:
            logging.warning(f"Video is unavailable")
            logging.debug(e)
            raise Exception(f"Video is unavailable for {self.url}")

        except Exception as e:
            logging.warning(f"Failed to retrieve transcript")
            logging.debug(e)
            raise Exception(self.create_no_transcript_error_message(e))

        content = " ".join([entry["text"] for entry in transcript_data])

        if not content:
            raise Exception(f"No transcription found for {self.url}")

        return content

    def get_transcript(self, video_id):
        """Attempts to get the transcript in the requested language or translate if not available."""
        try:
            # Try to get the transcript in the requested language
            return YouTubeTranscriptApi.get_transcript(
                video_id, languages=[self.language]
            )

        except NoTranscriptFound:
            # If transcript in the requested language is not found, try to find a translatable one
            return self.get_translatable_transcript(video_id)

        except Exception as e:
            logging.debug(f"Failed to retrieve transcript with first proxy")
            logging.debug(e)
            # Retry with a new proxy
            return YouTubeTranscriptApi.get_transcript(
                video_id, languages=[self.language]
            )

    def get_translatable_transcript(self, video_id):
        """Finds a translatable transcript and translates it to the requested language."""
        try:
            # List all transcripts for the video
            transcripts = YouTubeTranscriptApi.list_transcripts(video_id)

            # Find an auto-generated, translatable transcript
            for transcript in transcripts:
                if transcript.is_translatable:
                    return transcript.translate(self.language).fetch()

            # Raise an exception if no translatable transcript is found
            raise NoTranscriptFound(
                f"No translatable transcript available for video {video_id}"
            )

        except Exception as e:
            logging.warning(f"Failed to find a translatable transcript")
            logging.debug(e)
            raise

    def create_no_transcript_error_message(self, e):
        requested_languages = getattr(e, "_requested_language_codes", None)
        transcript_data = getattr(e, "_transcript_data", None)
        error_message = f"Failed to retrieve transcript for {self.url} \n\nRequested Language: {requested_languages} \n\n{transcript_data}"
        return error_message

    def retrieve_transcript(self, url, language):
        self.url = url
        self.language = language

        if not self.url:
            raise Exception("No URL provided")

        content = self.run_with_retry(self.process_with_youtube_transcript_api)

        if not content:
            raise Exception(f"No transcription found for {self.url}")

        logging.info(f"Transcription for {self.url} retrieved successfully")
        return content

    def process(self):

        url = self.get_input_by_name("url")
        language = self.get_input_by_name("language")
        logging.info(language)

        return self.retrieve_transcript(url, language)
