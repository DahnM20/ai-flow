import { Popover } from "@headlessui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCogs, FaRobot } from "react-icons/fa";
import { NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import styled from "styled-components";
import useHandlePositions from "../../hooks/useHandlePositions";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { actions } from "../../nodes-configuration/data/aiAction";
import { GenericNodeData } from "./types/node";
import { generateIdForHandle } from "../../utils/flowUtils";
import HandleWrapper from "../handles/HandleWrapper";
import { NodeContext } from "../../providers/NodeProvider";
import { NodeBand, NodeLogs, NodeLogsText } from "./Node.styles";
import MarkdownOutput from "./node-output/MarkdownOutput";
import NodePlayButton from "./node-button/NodePlayButton";

interface AIActionNodeData extends GenericNodeData {
  inputText: string;
  actionName: string;
}

interface AIActionNodeProps extends NodeProps {
  data: AIActionNodeData;
}

const AIActionNode: React.FC<AIActionNodeProps> = React.memo(
  ({ data, id, selected }) => {
    const NB_INPUT_HANDLE = 1;
    const updateNodeInternals = useUpdateNodeInternals();
    const { t } = useTranslation("aiActions");

    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [collapsed, setCollapsed] = useState(false);
    const [showLogs, setShowLogs] = useState<boolean>(true);

    const inputHandleId = useMemo(() => generateIdForHandle(0), []);
    const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);

    const allActions = useMemo(() => {
      const savedCustomActions = localStorage.getItem("customActions");
      const customActions = savedCustomActions
        ? JSON.parse(savedCustomActions)
        : [];
      const allActions = [...actions, ...customActions];
      return allActions;
    }, []);

    const { showOnlyOutput, isRunning, onUpdateNodeData } =
      useContext(NodeContext);
    const { allHandlePositions } = useHandlePositions(data, NB_INPUT_HANDLE, [
      outputHandleId,
    ]);

    useHandleShowOutput({
      showOnlyOutput,
      setCollapsed: setCollapsed,
      setShowLogs: setShowLogs,
    });

    useEffect(() => {
      onUpdateNodeData(id, {
        ...data,
      });
      setIsPlaying(false);
    }, [data.outputData]);

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    const handleCollapseClick = () => {
      setCollapsed(!collapsed);
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

    const handleActionClick = (actionName: string, prompt: string) => {
      onUpdateNodeData(id, {
        ...data,
        prompt,
        actionName: actionName,
      });
    };

    const outputData = !!data.outputData
      ? typeof data.outputData === "string"
        ? data.outputData
        : data.outputData[0]
      : "";

    return (
      <AIActionNodeContainer
        className="flex h-auto w-96 flex-col items-center justify-center rounded-md text-slate-300 shadow-sm shadow-black/80"
        selected={selected}
        collapsed={collapsed}
        key={id}
        onDoubleClick={handleCollapseClick}
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

        <div className="flex w-full flex-row items-center justify-between px-2">
          <Popover className="relative">
            <Popover.Button
              className={`cursor-pointer py-1 text-3xl hover:animate-pulse hover:text-sky-200 ${!data.actionName ? "" : ""}`}
            >
              {!data.actionName ? (
                <>
                  <span className="absolute ml-4 inline-flex h-2 w-2 animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="absolute ml-4 inline-flex h-2 w-2 rounded-full bg-yellow-300"></span>
                  <FaCogs />
                </>
              ) : (
                <FaRobot />
              )}
            </Popover.Button>
            <Popover.Overlay className="fixed inset-0 bg-black opacity-30" />
            <Popover.Panel className="absolute z-50  bg-slate-800 px-2 py-2 text-slate-200">
              <div className="grid-row-4 grid">
                {allActions.map((action) => (
                  <div
                    key={action.name}
                    onClick={() =>
                      handleActionClick(action.name, action.prompt)
                    }
                    className="w-64 cursor-pointer rounded p-2 hover:bg-slate-600"
                  >
                    {t(action.name)}
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Popover>

          <div className="mx-auto items-center px-2 py-2 text-center text-lg font-bold">
            {" "}
            {t(data.actionName)}{" "}
          </div>

          <div>
            <NodePlayButton
              isPlaying={isPlaying}
              nodeName={data.name}
              onClick={handlePlayClick}
            />
          </div>
        </div>
        <NodeBand className="h-1 w-full" color={data.appearance?.color} />

        <HandleWrapper
          id={outputHandleId}
          position={
            !!data?.handles && data.handles[outputHandleId]
              ? data.handles[outputHandleId]
              : Position.Right
          }
          onChangeHandlePosition={handleChangeHandlePosition}
          linkedHandlePositions={allHandlePositions}
          isOutput
        />
        {!!data.outputData && (
          <NodeLogs
            className="w-full border-t-2 border-t-slate-800"
            showLogs={showLogs}
            onClick={() => setShowLogs(!showLogs)}
          >
            {!showLogs ? (
              <NodeLogsText className="text-center">
                {t("ClickToShowOutput")}
              </NodeLogsText>
            ) : (
              <MarkdownOutput data={outputData} />
            )}
          </NodeLogs>
        )}
      </AIActionNodeContainer>
    );
  },
);

const AIActionNodeContainer = styled.div<{
  selected: boolean;
  collapsed: boolean;
}>`
  background-color: ${({ theme }) => theme.nodeBg};
  transition: all 0.3s ease-in-out;
`;

export default AIActionNode;
