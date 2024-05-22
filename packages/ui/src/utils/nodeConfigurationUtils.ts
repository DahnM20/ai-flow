import { NodeData } from "../components/nodes/types/node";
import { Field } from "../nodes-configuration/types";

export function getAdequateConfigFromDiscriminators(nodeData: NodeData) {
  const discriminatorValues = nodeData.variantConfig?.discriminatorFields.map(
    (discr) => nodeData[discr],
  );

  const newConfig = nodeData.variantConfig?.subConfigurations.find((config) => {
    const configDiscriminatorValues = Object.keys(config.discriminators).map(
      (key) => config.discriminators[key],
    );

    return (
      JSON.stringify(configDiscriminatorValues) ===
      JSON.stringify(discriminatorValues)
    );
  });
  return structuredClone(newConfig);
}

export const hasDiscriminatorChanged = (
  fieldName: string,
  nodeData: NodeData,
) => {
  if (!!nodeData.variantConfig) {
    return nodeData.variantConfig.discriminatorFields.includes(fieldName);
  }
};

export function getDefaultOptions(fields: Field[], data: NodeData) {
  const defaultOptions: any = {};

  //Default options
  fields
    .filter(
      (field) =>
        field.options?.find((option) => option.default) && !data[field.name],
    )
    .forEach((field) => {
      defaultOptions[field.name] = field.options?.find(
        (option) => option.default,
      )?.value;
    });

  //Default values
  fields
    .filter((field) => field.defaultValue != null && data[field.name] == null)
    .forEach((field) => {
      defaultOptions[field.name] = field.defaultValue;
    });

  return defaultOptions;
}

export function getNbInputs(data: NodeData, fields?: Field[]) {
  if (!!data.config.inputNames) {
    return data.config.inputNames.length;
  }
  if (!!fields && fields.some((field) => field.hasHandle)) {
    return fields.length;
  }
  return 1;
}

export function getNbOutputs(data: NodeData) {
  return data.outputData != null && typeof data.outputData !== "string"
    ? data.outputData.length
    : 1;
}
