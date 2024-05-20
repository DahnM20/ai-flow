from .model import NodeConfigVariant


def get_sub_configuration(discriminators_values, node_config: NodeConfigVariant):
    for subconfig in node_config.subConfigurations:
        subconfig_discriminator_values = [
            subconfig.discriminators[discriminator]
            for discriminator in subconfig.discriminators
        ]
        if subconfig_discriminator_values == discriminators_values:
            return subconfig
