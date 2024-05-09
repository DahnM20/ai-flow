from typing import Dict, List, Optional, Union
from .model import (
    DiscriminatedNodeConfig,
    Field,
    FieldType,
    NodeConfig,
    NodeConfigVariant,
    Option,
    OutputType,
    SectionType,
)


class NodeConfigBuilder:
    def __init__(self):
        self.fields: List[Field] = []
        self.nodeName: Optional[str] = None
        self.processorType: Optional[str] = None
        self.icon: Optional[str] = None
        self.outputType: Optional[str] = None
        self.section: Optional[str] = None
        self.helpMessage: Optional[str] = None
        self.showHandlesNames: Optional[bool] = False
        self.isDynamicallyGenerated: Optional[bool] = False
        self.discriminators: Optional[Dict[str, str]] = None

    def set_node_name(self, name: str) -> "NodeConfigBuilder":
        self.nodeName = name
        return self

    def set_processor_type(self, processor_type: str) -> "NodeConfigBuilder":
        self.processorType = processor_type
        return self

    def set_icon(self, icon: str) -> "NodeConfigBuilder":
        self.icon = icon
        return self

    def set_output_type(self, output_type: str) -> "NodeConfigBuilder":
        self.outputType = OutputType(root=output_type)
        return self

    def set_section(self, section: str) -> "NodeConfigBuilder":
        self.section = SectionType(root=section)
        return self

    def set_help_message(self, help_message: str) -> "NodeConfigBuilder":
        self.helpMessage = help_message
        return self

    def set_show_handles(self, show: bool) -> "NodeConfigBuilder":
        self.showHandlesNames = show
        return self

    def set_is_dynamic(self, dyna: bool) -> "NodeConfigBuilder":
        self.isDynamicallyGenerated = dyna
        return self

    def set_fields(self, fields: List[Field]) -> "NodeConfigBuilder":
        self.fields = fields
        return self

    def add_field(self, field: Field) -> "NodeConfigBuilder":
        self.fields.append(field)
        return self

    def add_discriminator(self, key, value) -> "NodeConfigBuilder":
        if self.discriminators is None:
            self.discriminators = {}
        self.discriminators[key] = value
        return self

    def build(self) -> NodeConfig:
        baseConfig = NodeConfig(
            nodeName=self.nodeName,
            processorType=self.processorType,
            icon=self.icon,
            fields=self.fields,
            outputType=self.outputType,
            section=self.section,
            helpMessage=self.helpMessage,
            showHandlesNames=self.showHandlesNames,
            isDynamicallyGenerated=self.isDynamicallyGenerated,
        )
        if self.discriminators is not None:
            return DiscriminatedNodeConfig(
                config=baseConfig, discriminators=self.discriminators
            )
        else:
            return baseConfig


class NodeConfigVariantBuilder:
    def __init__(self):
        self.subConfigurations: List[NodeConfig] = []
        self.discriminatorFields: Optional[List[str]] = []

    def add_discriminator_field(self, field: str) -> "NodeConfigVariantBuilder":
        if self.discriminatorFields is None:
            self.discriminatorFields = []
        self.discriminatorFields.append(field)
        return self

    def add_sub_configuration(
        self, sub_configuration: NodeConfig
    ) -> "NodeConfigVariantBuilder":
        self.subConfigurations.append(sub_configuration)
        return self

    def build(self) -> NodeConfigVariant:
        return NodeConfigVariant(
            subConfigurations=self.subConfigurations,
            discriminatorFields=self.discriminatorFields,
        )


class FieldBuilder:
    def __init__(self):
        self._field = Field()

    def set_name(self, name: str) -> "FieldBuilder":
        self._field.name = name
        return self

    def set_label(self, label: str) -> "FieldBuilder":
        self._field.label = label
        return self

    def set_type(self, field_type: str) -> "FieldBuilder":
        self._field.type = FieldType(root=field_type)
        return self

    def set_min(self, min: float) -> "FieldBuilder":
        self._field.min = min
        return self

    def set_max(self, max: float) -> "FieldBuilder":
        self._field.max = max
        return self

    def set_is_binary(self, binary: bool) -> "FieldBuilder":
        self._field.isBinary = binary
        return self

    def set_placeholder(self, placeholder: str) -> "FieldBuilder":
        self._field.placeholder = placeholder
        return self

    def set_required(self, required: bool) -> "FieldBuilder":
        self._field.required = required
        return self

    def set_options(self, options: List[Option]) -> "FieldBuilder":
        self._field.options = options
        return self

    def add_option(self, option: Option) -> "FieldBuilder":
        if not self._field.options:
            self._field.options = []
        self._field.options.append(option)
        return self

    def set_default_value(self, default_value: Union[str, float]) -> "FieldBuilder":
        self._field.defaultValue = default_value
        return self

    def set_has_handle(self, has_handle: bool) -> "FieldBuilder":
        self._field.hasHandle = has_handle
        return self

    def build(self) -> Field:
        return self._field
