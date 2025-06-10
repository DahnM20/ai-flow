import { Node } from "reactflow";
import { getConfigViaType } from "../nodes-configuration/nodeConfig";

export const generatedIdIdentifier = "#";

export const createUniqNodeId = (suffix: string) => {
  return (
    Math.random().toString(36).substr(2, 9) + generatedIdIdentifier + suffix
  );
};

export const createNewNode = (
  type: string,
  { x, y }: { x: number; y: number } = { x: 0, y: 0 },
  additionnalData: any = {},
  additionnalConfig: any = {},
) => {
  const id = createUniqNodeId(type);

  const typeConfig = getConfigViaType(type);

  const inputNames =
    !!typeConfig && !!typeConfig.fields && !typeConfig.inputNames
      ? typeConfig.fields.map((field) => field.name)
      : typeConfig?.inputNames;

  const newNode: Node = {
    id,
    type,
    data: {
      name: id,
      processorType: type,
      ...additionnalData,
      config: {
        ...typeConfig,
        inputNames: inputNames,
        ...additionnalConfig,
      },
    },
    position: { x, y },
  };

  return newNode;
};
