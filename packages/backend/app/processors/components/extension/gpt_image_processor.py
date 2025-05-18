import base64
import mimetypes
import os
import re
from datetime import datetime
from io import BytesIO
from urllib.parse import unquote, urlparse

import requests
from openai import OpenAI

from ...context.processor_context import ProcessorContext
from ..model import Field, NodeConfig, Option
from ..node_config_builder import NodeConfigBuilder
from .extension_processor import (
    ContextAwareExtensionProcessor,
    DynamicExtensionProcessor,
)


class GPTImageProcessor(ContextAwareExtensionProcessor, DynamicExtensionProcessor):
    processor_type = "gpt-image-processor"

    # our two modes
    methods = ["generate", "edit"]

    def __init__(self, config, context: ProcessorContext):
        super().__init__(config, context)
        self.method = self.get_input_by_name("method")

    def get_node_config(self):
        # top-level mode selector
        method_options = [
            Option(default=(m == "generate"), value=m, label=m.title())
            for m in self.methods
        ]
        method_field = Field(
            name="method",
            label="mode",
            type="select",
            options=method_options,
            required=True,
        )

        return (
            NodeConfigBuilder()
            .set_node_name("GPT Image")
            .set_processor_type(self.processor_type)
            .set_icon("OpenAILogo")
            .set_help_message("gptImageHelp")
            .set_section("models")
            .add_field(method_field)
            .set_is_dynamic(True)
            .build()
        )

    # — builders for each mode's fields —

    def build_generate_config(self, builder):
        # same fields as your original generate case
        builder.add_field(
            Field(
                name="model",
                label="Model",
                type="select",
                options=[
                    Option(default=True, value="gpt-image-1", label="gpt-image-1")
                ],
                required=True,
            )
        )

        builder.add_field(
            Field(
                name="prompt",
                label="Prompt",
                type="textarea",
                required=True,
                placeholder="InputTextPlaceholder",
                hasHandle=True,
            )
        )

        builder.add_field(
            Field(
                name="size",
                label="Size",
                type="select",
                options=[
                    Option(default=True, value="auto", label="auto"),
                    Option(default=False, value="1024x1024", label="1024x1024"),
                    Option(default=False, value="1536x1024", label="1536x1024"),
                    Option(default=False, value="1024x1536", label="1024x1536"),
                ],
                required=True,
            )
        )
        builder.add_field(
            Field(
                name="quality",
                label="Quality",
                type="select",
                options=[
                    Option(default=True, value="auto", label="auto"),
                    Option(default=False, value="low", label="low"),
                    Option(default=False, value="medium", label="medium"),
                    Option(default=False, value="high", label="high"),
                ],
                required=True,
            )
        )
        builder.add_field(
            Field(
                name="background",
                label="Background",
                type="select",
                options=[
                    Option(default=True, value="opaque", label="opaque"),
                    Option(default=False, value="transparent", label="transparent"),
                ],
                required=True,
            )
        )
        builder.add_field(
            Field(
                name="moderation",
                label="Moderation",
                type="select",
                options=[
                    Option(default=False, value="auto", label="auto"),
                    Option(default=True, value="low", label="low"),
                ],
                required=True,
            )
        )
        builder.set_output_type("imageUrl")

    def build_edit_config(self, builder):
        # same fields as your original edit case
        builder.add_field(
            Field(
                name="model",
                label="Model",
                type="select",
                options=[
                    Option(default=True, value="gpt-image-1", label="gpt-image-1")
                ],
                required=True,
            )
        )
        builder.add_field(
            Field(
                name="prompt",
                label="Prompt",
                type="textarea",
                required=True,
                placeholder="InputTextPlaceholder",
                hasHandle=True,
            )
        )

        builder.add_field(
            Field(
                name="mask",
                label="Mask",
                type="fileUpload",
                hasHandle=True,
                description="gptImageMaskDescription",
            )
        )

        builder.add_field(
            Field(
                name="image",
                label="Image",
                type="fileUpload",
                hasHandle=True,
                canAddChildrenFields=True,
            )
        )

        builder.set_output_type("imageUrl")

    method_config_builders = {
        "generate": build_generate_config,
        "edit": build_edit_config,
    }

    def get_dynamic_node_config(self, data) -> NodeConfig:
        method = data["method"]
        builder = (
            NodeConfigBuilder()
            .set_node_name(f"GPT Image – {method.title()}")
            .set_processor_type(self.processor_type)
            .set_icon("OpenAILogo")
            .set_section("models")
            .set_show_handles(True)
        )
        # inject the right fields
        self.method_config_builders[method](self, builder)
        return builder.build()

    @staticmethod
    def get_image_file_from_url(url):
        response = requests.get(url)
        response.raise_for_status()
        parsed = urlparse(url)
        filename = os.path.basename(parsed.path) or "image.png"
        filename = unquote(filename)
        if "." not in filename:
            ext = mimetypes.guess_extension(response.headers.get("Content-Type", ""))
            filename += ext or ".png"
        buf = BytesIO(response.content)
        buf.name = filename
        return buf

    def process(self):
        prompt = self.get_input_by_name("prompt")
        model = self.get_input_by_name("model")

        api_key = self._processor_context.get_value("openai_api_key")
        if api_key is None:
            raise Exception("No OpenAI API key found")
        client = OpenAI(api_key=api_key)

        if self.method == "edit":
            # gather all image_* fields just like before
            images_fields = [
                f for f in self.fields_names if re.match(r"^image_\d+$", f)
            ]
            images_fields.insert(0, "image")
            urls = [self.get_input_by_name(fld, None) for fld in images_fields]
            urls = [u for u in urls if u]
            files = [GPTImageProcessor.get_image_file_from_url(u) for u in urls]
            mask = self.get_input_by_name("mask", None)
            if mask:
                mask = GPTImageProcessor.get_image_file_from_url(mask)
                result = client.images.edit(
                    model=model,
                    prompt=prompt,
                    image=files,
                    mask=mask,
                )
            else:
                result = client.images.edit(
                    model=model,
                    prompt=prompt,
                    image=files,
                )

        else:
            # generate
            size = self.get_input_by_name("size")
            quality = self.get_input_by_name("quality")
            background = self.get_input_by_name("background")
            moderation = self.get_input_by_name("moderation")
            result = client.images.generate(
                model=model,
                prompt=prompt,
                size=size,
                quality=quality,
                background=background,
                moderation=moderation,
            )

        img_b64 = result.data[0].b64_json
        img_bytes = base64.b64decode(img_b64)
        storage = self.get_storage()
        fname = f"{self.name}-{datetime.now():%Y%m%d%H%M%S%f}.png"
        return storage.save(fname, img_bytes)

    def cancel(self):
        pass
