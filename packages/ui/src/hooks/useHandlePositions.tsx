import { useMemo } from "react";
import { generateIdForHandle } from "../utils/flowUtils";
import { LinkedHandlePositions } from "../components/handles/HandleWrapper";
import { Position } from "reactflow";

const useHandlePositions = (
  data: any,
  nbInput: number,
  outputHandleIds: string[],
) => {
  const allInputHandleIds = Array.from({ length: nbInput }, (_, i) => i).map(
    (index) => generateIdForHandle(index),
  );

  const allHandleIds = useMemo(() => {
    const inputHandleIds = Array.from({ length: nbInput }, (_, i) => i).map(
      (index) => generateIdForHandle(index),
    );
    return [...inputHandleIds, ...outputHandleIds];
  }, [nbInput, outputHandleIds]);

  const allHandlePositions = useMemo(() => {
    const positions = {} as LinkedHandlePositions;
    allHandleIds.forEach((id) => {
      let currentPosition: Position =
        data?.handles?.[id] ??
        (id.includes("out") ? Position.Right : Position.Left);
      positions[currentPosition] = [...(positions[currentPosition] || []), id];
    });
    return positions;
  }, [allHandleIds, data]);

  return {
    nbInput,
    allInputHandleIds,
    allHandleIds,
    allHandlePositions,
  };
};

export default useHandlePositions;
