import os
from urllib.parse import urlparse
from ...context.processor_context import ProcessorContext
from ..processor import ContextAwareProcessor
import replicate

from .processor_type_name_utils import ProcessorType


class StableVideoDiffusionReplicaterocessor(ContextAwareProcessor):
    processor_type = ProcessorType.STABLE_VIDEO_DIFFUSION_REPLICATE

    stable_video_diffusion_model = "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438"

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)

        self.length = config.get("length", "14_frames_with_svd")
        self.frames_per_second = config.get("frames_per_second", "6")

    def process(self):
        input_image_url = None
        if self.get_input_processor() is not None:
            input_image_url = self.get_input_processor().get_output(
                self.get_input_node_output_key()
            )

        if input_image_url is None:
            return "No image provided."

        if not self.is_valid_url(input_image_url):
            return "Invalid URL provided."

        api_key = self._processor_context.get_value("replicate_api_key")
        api = replicate.Client(api_token=api_key)

        output = api.run(
            StableVideoDiffusionReplicaterocessor.stable_video_diffusion_model,
            input={
                "cond_aug": 0.02,
                "decoding_t": 7,
                "input_image": input_image_url,
                "video_length": self.length,
                "sizing_strategy": "maintain_aspect_ratio",
                "motion_bucket_id": 127,
                "frames_per_second": int(self.frames_per_second),
            },
        )

        return output

    def is_valid_url(self, url):
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def cancel(self):
        pass
