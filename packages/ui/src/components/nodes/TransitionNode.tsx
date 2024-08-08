import React, { useContext, useEffect, useMemo, useState } from "react";
import { Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import { generateIdForHandle } from "../../utils/flowUtils";
import { NodeContext } from "../../providers/NodeProvider";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import NodePlayButton from "./node-button/NodePlayButton";
import HandleWrapper from "../handles/HandleWrapper";
import useHandlePositions from "../../hooks/useHandlePositions";
import { GenericNodeData } from "./types/node";

interface TransitionNodeData extends GenericNodeData {
  handles: any;
  id: string;
  name: string;
  processorType: string;
  nbOutput: number;
  input: string;
  input_key: string;
  outputData?: string[];
  lastRun: string;
}

interface TransitionNodeProps extends NodeProps {
  data: TransitionNodeData;
}

const TransitionNode: React.FC<TransitionNodeProps> = React.memo(
  ({ data, id }) => {
    const { onUpdateNodeData } = useContext(NodeContext);
    const [nodeId, setNodeId] = useState<string>(`${data.name}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useIsPlaying();
    const updateNodeInternals = useUpdateNodeInternals();

    const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);
    const inputHandleId = useMemo(() => generateIdForHandle(0), []);

    const { allHandlePositions } = useHandlePositions(data, 1, [
      outputHandleId,
    ]);

    useEffect(() => {
      setNodeId(`${data.name}-${Date.now()}`);
      setIsPlaying(false);
      updateNodeInternals(id);
    }, [data.lastRun]);

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    const handleChangeHandlePosition = (
      newPosition: Position,
      handleId: string,
    ) => {
      onUpdateNodeData(id, {
        ...data,
        handles: {
          ...data.handles,
          [handleId]: newPosition,
        },
      });
      updateNodeInternals(id);
    };

    return (
      <div
        key={id}
        style={{
          borderColor: data?.appearance?.color
            ? data?.appearance?.color
            : "rgb(34 197 94)",
        }}
        className="flex flex-col items-center justify-between 
                    rounded-lg border bg-gray-800 p-4 
                    text-white shadow-lg transition 
                    duration-300 ease-in-out hover:bg-gray-700"
      >
        <HandleWrapper
          id={inputHandleId}
          position={
            !!data?.handles && data.handles[inputHandleId]
              ? data.handles[inputHandleId]
              : Position.Left
          }
          linkedHandlePositions={allHandlePositions}
          onChangeHandlePosition={handleChangeHandlePosition}
        />

        <NodePlayButton
          isPlaying={isPlaying}
          hasRun={!!data.lastRun}
          onClick={handlePlayClick}
          nodeName={data.name}
          size="medium"
        />

        <HandleWrapper
          id={outputHandleId}
          position={
            !!data?.handles && data.handles[outputHandleId]
              ? data.handles[outputHandleId]
              : Position.Right
          }
          linkedHandlePositions={allHandlePositions}
          onChangeHandlePosition={handleChangeHandlePosition}
          isOutput
        />
      </div>
    );
  },
);
export default TransitionNode;
