import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Position,
  NodeProps,
  useUpdateNodeInternals,
  NodeResizer,
  OnResizeEnd,
  ResizeParams,
  NodeResizeControl,
  Background,
} from "reactflow";
import { generateIdForHandle } from "../../utils/flowUtils";
import { NodeContext } from "../../providers/NodeProvider";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import NodePlayButton from "./node-button/NodePlayButton";
import HandleWrapper from "../handles/HandleWrapper";
import useHandlePositions from "../../hooks/useHandlePositions";
import { GenericNodeData } from "./types/node";
import { NodeBand, NodeHeader, NodeIcon, NodeTitle } from "./Node.styles";
import OutputDisplay from "./node-output/OutputDisplay";
import { useTranslation } from "react-i18next";
import { FaTv } from "react-icons/fa";

interface DisplayNodeData extends GenericNodeData {
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

interface DisplayNodeProps extends NodeProps {
  data: DisplayNodeData;
}

interface Dimensions {
  width: number;
  height: number;
}

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#F36788"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", right: -20, bottom: -20 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

const DisplayNode: React.FC<DisplayNodeProps> = React.memo(
  ({ data, id, selected }) => {
    const { t } = useTranslation("flow");
    const { onUpdateNodeData } = useContext(NodeContext);
    const [nodeId, setNodeId] = useState<string>(`${data.name}-${Date.now()}`);
    const [dimensions, setDimensions] = useState<Dimensions>({
      width: data.nodeDimensions?.width ?? 450,
      height: data.nodeDimensions?.height ?? 200,
    });
    const [reloadDisplay, setReloadDisplay] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useIsPlaying();
    const updateNodeInternals = useUpdateNodeInternals();

    const inputHandleId = useMemo(() => generateIdForHandle(0), []);
    const { allHandlePositions } = useHandlePositions(data, 1, []);

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

    const handleReloadDisplay = () => {
      setReloadDisplay(reloadDisplay + 1);
    };

    const handleSaveDimensions = (params: ResizeParams) => {
      setDimensions({
        width: params.width,
        height: params.height,
      });
    };

    return (
      <div
        key={id}
        className={`flex h-full flex-col rounded-lg bg-zinc-900 `}
        style={{
          width: "100%",
          minWidth: "300px",
        }}
      >
        {selected && (
          <NodeResizeControl
            minWidth={300}
            minHeight={100}
            onResizeEnd={(event, params) => {
              handleReloadDisplay();
              handleSaveDimensions(params);
            }}
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <ResizeIcon />
          </NodeResizeControl>
        )}

        <NodeHeader>
          <NodeIcon>
            <FaTv />
          </NodeIcon>
          <NodeTitle>{data.appearance?.customName ?? t("Display")}</NodeTitle>
          <NodePlayButton
            isPlaying={isPlaying}
            hasRun={!!data.lastRun}
            onClick={handlePlayClick}
            nodeName={data.name}
          />
        </NodeHeader>
        <NodeBand
          selected={selected}
          color={data.appearance?.color}
          className={`${selected ? "animate-pulse" : ""}`}
        />
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

        <div className="nodrag nowheel flex h-full w-full overflow-auto">
          {data.outputData != null ? (
            <OutputDisplay key={reloadDisplay} data={data} />
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>
    );
  },
);
export default DisplayNode;
