import React, { useContext, useEffect, useState } from "react";
import { Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import styled from "styled-components";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { generateIdForHandle } from "../../utils/flowUtils";
import {
  InputHandle,
  OptionButton,
  OptionSelector,
  OutputHandle,
} from "./Node.styles";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { GenericNodeData } from "./types/node";
import SelectAutocomplete, {
  SelectItem,
} from "../selectors/SelectAutocomplete";
import { FaRobot } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import NodeTextField from "./node-input/NodeTextField";
import { Switch, Tooltip } from "@mantine/core";

interface AIDataSplitterNodeData extends GenericNodeData {
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

const defaultOptions: SelectItem<string>[] = [
  {
    value: ",",
    name: ",",
  },
  {
    value: ";",
    name: ";",
  },
  {
    value: "\\t",
    name: "\\t",
  },
  {
    value: " ",
    name: "Space",
  },
  {
    value: "\\n",
    name: "\\n",
  },
  {
    value: "\\r",
    name: "\\r",
  },
];

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

    const handleChangeField = (field: string, value: any) => {
      onUpdateNodeData(id, {
        ...data,
        [field]: value,
      });
    };

    return (
      <DataSplitterNodeContainer
        selected={selected}
        nbOutput={data.nbOutput}
        collapsed={collapsed}
        key={id}
        onDoubleClick={handleCollapseClick}
        style={{
          borderColor: data?.appearance?.color
            ? data?.appearance?.color
            : "rgb(34 197 94)",
        }}
        className={`flex flex-col items-center justify-center rounded-lg  border  bg-gray-800 p-4 hover:bg-gray-700/50`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <NodePlayButton
            isPlaying={isPlaying}
            nodeName={data.name}
            onClick={handlePlayClick}
          />
          {!(collapsed || (!collapsed && !selected)) && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="ml-8 w-full text-left font-mono"> mode </p>
              <div className="flex w-5/6 flex-col  space-y-2">
                <OptionSelector>
                  <OptionButton
                    key={`ai`}
                    className="flex items-center justify-center"
                    selected={data["mode"] === "ai"}
                    onClick={() => handleChangeField("mode", "ai")}
                    onTouchEnd={() => handleChangeField("mode", "ai")}
                  >
                    <FaRobot />
                  </OptionButton>
                  <OptionButton
                    key={`manual`}
                    className="flex items-center justify-center"
                    selected={data["mode"] === "manual"}
                    onClick={() => handleChangeField("mode", "manual")}
                    onTouchEnd={() => handleChangeField("mode", "manual")}
                  >
                    <FiUser />
                  </OptionButton>
                </OptionSelector>
                {data["mode"] === "manual" && (
                  <>
                    <p className="w-full text-left font-mono">
                      {" "}
                      custom_separator{" "}
                    </p>
                    <Switch
                      checked={data?.customSeparator}
                      onChange={(e) =>
                        handleChangeField("customSeparator", e.target.checked)
                      }
                    />
                    <p className="w-full text-left font-mono"> separator * </p>
                    {!!data["customSeparator"] ? (
                      <NodeTextField
                        value={data?.separator}
                        onChange={(e) =>
                          handleChangeField("separator", e.target.value)
                        }
                      />
                    ) : (
                      <SelectAutocomplete
                        values={defaultOptions}
                        selectedValue={data?.separator}
                        onChange={(value) =>
                          handleChangeField("separator", value)
                        }
                      />
                    )}
                  </>
                )}
                <p className="w-full text-left font-mono"> nb_output </p>
                <div className="flex flex-row items-center justify-center space-x-2">
                  <span className="h-3 w-3 bg-orange-400/40" />
                  <ForceNbOutputInput
                    className="w-full border border-slate-200/20 bg-gray-800"
                    id="nbOutput"
                    value={data.nbOutput}
                    onChange={handleForceNbOutputChange}
                  />
                </div>
              </div>
            </div>
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
              <Tooltip label={data.outputData ? data.outputData[index] : ""}>
                <OutputHandle
                  key={generateIdForHandle(index, true)}
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
              </Tooltip>
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
  min-height: 350px;
  height: ${(props) => props.nbOutput * 30 + 100}px;
  width: ${(props) => (props.collapsed || !props.selected ? "auto" : "200px")};
  transition: all 0.3s ease-in-out;
`;

const ForceNbOutputInput = styled.input`
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
  padding: 5px;
  border-radius: 5px;
`;

export default AIDataSplitterNode;
