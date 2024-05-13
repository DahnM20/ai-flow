import json

from ..processors.components.model import Option
from ..processors.components.node_config_builder import (
    FieldBuilder,
    NodeConfigBuilder,
    NodeConfigVariantBuilder,
)


class OpenAPIConverter:
    def __init__(self):
        pass

    def convert_enum_to_options(self, enum, defaultValue):
        options = []
        for value in enum:
            options.append(
                Option(default=(value == defaultValue), value=value, label=value)
            )
        return options

    def convert_properties_to_fields(self, schema):
        fields = []
        properties = schema.get("properties", {})
        for key, value in properties.items():
            field_builder = FieldBuilder()
            field_builder.set_name(key)
            field_builder.set_label(key)
            field_type = value.get("type")

            if field_type == "string":
                if "enum" in value:
                    field_builder.set_type("select")
                    field_builder.set_options(
                        self.convert_enum_to_options(
                            value["enum"], value.get("default")
                        )
                    )
                else:
                    field_builder.set_type("textfield")
                    field_builder.set_has_handle(True)
            elif field_type == "number":
                if "minimum" or "maximum" in value:
                    if value.get("maximum") > 1000:
                        field_builder.set_type("numericfield")
                    else:
                        field_builder.set_type("slider")
                    field_builder.set_min(value.get("minimum"))
                    field_builder.set_max(value.get("maximum"))
                else:
                    field_builder.set_type("numericfield")
                    field_builder.set_has_handle(True)
            else:
                field_builder.set_type("textfield")

            if "example" in value:
                if "format" in value and value["format"] == "binary":
                    field_builder.set_placeholder("Resource URL")
                    field_builder.set_is_binary(True)
                else:
                    field_builder.set_placeholder(value["example"])

            if "default" in value:
                field_builder.set_default_value(value["default"])

            required_fields = schema.get("required", [])
            if key in required_fields:
                field_builder.set_required(True)

            fields.append(field_builder.build())
        return fields

    def convert_schema_to_node_config(self, schema):
        schema = schema.get("schema")
        if schema.get("oneOf") and schema.get("discriminator"):
            builder = NodeConfigVariantBuilder()
            discriminatorName = schema.get("discriminator").get("propertyName")
            mapping = schema.get("discriminator", {}).get("mapping")
            builder.add_discriminator_field(discriminatorName)
            for key, value in mapping.items():
                fields = self.convert_properties_to_fields(value)
                builder.add_sub_configuration(
                    NodeConfigBuilder()
                    .add_discriminator(discriminatorName, key)
                    .set_fields(fields)
                    .build()
                )
        else:
            builder = NodeConfigBuilder()
            print(schema)
            fields = self.convert_properties_to_fields(schema)
            builder.set_fields(fields)

        return builder
