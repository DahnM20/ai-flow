
export const generatedIdIdentifier = "#";

export const createUniqNodeId = (suffix: string) => {
  return (
    Math.random().toString(36).substr(2, 9) + generatedIdIdentifier + suffix
  );
};