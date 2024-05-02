import React, { useContext, useEffect, useState } from "react";
import { Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { generateIdForHandle } from "../../utils/flowUtils";
import { InputHandle, NodeTitle, OutputHandle } from "./Node.styles";
import { useIsPlaying } from "../../hooks/useIsPlaying";

interface AIDataSplitterNodeData {
  id: string;
  name: string;
  processorType: string;
  nbOutput: number;
  input: string;
  input_key: string;
  outputData?: string[];
  lastRun: string;
}

interface AIDataSplitterNodeProps extends NodeProps {
  data: AIDataSplitterNodeData;
}

const AIDataSplitterNode: React.FC<AIDataSplitterNodeProps> = React.memo(
  ({ data, id, selected }) => {
    const updateNodeInternals = useUpdateNodeInternals();

    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [collapsed, setCollapsed] = useState(false);

    const { onUpdateNodeData } = useContext(NodeContext);

    useEffect(() => {
      const newNbOutput = data.outputData ? data.outputData.length : 0;
      if (!data.nbOutput || newNbOutput > data.nbOutput) {
        onUpdateNodeData(id, {
          ...data,
          nbOutput: newNbOutput,
        });
      }
      setIsPlaying(false);
    }, [data.outputData]);

    useEffect(() => {
      updateNodeInternals(id);
    }, [data.nbOutput]);

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    const handleCollapseClick = () => {
      setCollapsed(!collapsed);
    };

    const handleForceNbOutputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const forcedNbOutput = Number(event.target.value);

      onUpdateNodeData(id, {
        ...data,
        nbOutput: forcedNbOutput,
      });
    };

    return (
      <DataSplitterNodeContainer
        selected={selected}
        nbOutput={data.nbOutput}
        collapsed={collapsed}
        key={id}
        onDoubleClick={handleCollapseClick}
        className={`flex flex-col items-center justify-center rounded-lg  border border-green-500 bg-gray-800 p-4 hover:bg-gray-700/50`}
      >
        <div className="flex flex-col items-center justify-center space-y-10">
          <NodePlayButton
            isPlaying={isPlaying}
            nodeName={data.name}
            onClick={handlePlayClick}
          />
          {!(collapsed || (!collapsed && !selected)) && (
            <ForceNbOutputInput
              className="border border-slate-200/20 bg-gray-800"
              id="nbOutput"
              value={data.nbOutput}
              onChange={handleForceNbOutputChange}
            />
          )}
        </div>
        <InputHandle
          className="handle"
          type="target"
          position={Position.Left}
        />
        <div>
          {!!data.nbOutput &&
            Array.from(Array(data.nbOutput)).map((_, index) => (
              <OutputHandle
                key={generateIdForHandle(index, true)}
                data-tooltip-id={`app-tooltip`}
                data-tooltip-content={
                  data.outputData ? data.outputData[index] : ""
                }
                type="source"
                id={generateIdForHandle(index, true)}
                position={Position.Right}
                style={{
                  background: data?.outputData
                    ? data.outputData[index]
                      ? "rgb(224, 166, 79)"
                      : "#ddd"
                    : "#ddd",
                  top: `${data.nbOutput === 1 ? 50 : (index / (data.nbOutput - 1)) * 80 + 10}%`,
                }}
              />
            ))}
        </div>
      </DataSplitterNodeContainer>
    );
  },
);

const DataSplitterNodeContainer = styled.div<{
  selected: boolean;
  nbOutput: number;
  collapsed: boolean;
}>`
  min-height: 250px;
  height: ${(props) => props.nbOutput * 30 + 100}px;
  width: ${(props) => (props.collapsed || !props.selected ? "auto" : "120px")};
  transition: all 0.3s ease-in-out;
`;

const ForceNbOutputInput = styled.input`
  margin-top: 10px;
  width: 50%;
  padding: 4px;
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
  padding: 5px;
  border-radius: 5px;
`;

export default AIDataSplitterNode;
