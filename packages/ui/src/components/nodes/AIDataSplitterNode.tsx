import React, { useContext, useEffect } from "react";
import { Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import styled from "styled-components";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { generateIdForHandle } from "../../utils/flowUtils";
import { InputHandle, OutputHandle } from "./Node.styles";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { GenericNodeData } from "./types/node";
import SelectAutocomplete, {
  SelectItem,
} from "../selectors/SelectAutocomplete";
import NodeTextField from "./node-input/NodeTextField";
import { Switch, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";

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

const separatorOptions: SelectItem<string>[] = [
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
    const { t } = useTranslation("flow");
    const updateNodeInternals = useUpdateNodeInternals();

    const [isPlaying, setIsPlaying] = useIsPlaying();

    const { onUpdateNodeData } = useContext(NodeContext);

    const modeOptions: SelectItem<string>[] = [
      {
        value: "ai",
        name: t("AI"),
      },
      {
        value: "manual",
        name: t("Separator"),
      },
    ];

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
        nbOutput={data.nbOutput}
        key={id}
        style={{
          borderColor: data?.appearance?.color
            ? data?.appearance?.color
            : "rgb(34 197 94)",
        }}
        className={`flex flex-col items-center justify-center rounded-lg  border  bg-gray-800 p-5 hover:bg-gray-700/50`}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="mt-3 flex">
            <NodePlayButton
              isPlaying={isPlaying}
              nodeName={data.name}
              onClick={handlePlayClick}
              size="medium"
            />
          </div>
          {
            <div
              className="flex flex-col items-center justify-center space-y-2"
              onDoubleClick={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <p className="ml-8 w-full text-left font-mono"> mode </p>
              <div className="flex w-5/6 flex-col  space-y-2">
                <SelectAutocomplete
                  values={modeOptions}
                  selectedValue={data?.mode ?? "manual"}
                  onChange={(value) => handleChangeField("mode", value)}
                />
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
                        values={separatorOptions}
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
          }
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
  nbOutput: number;
}>`
  min-height: ${(props) => props.nbOutput * 30 + 100}px;
  width: 200px;
  transition: all 0.3s ease-in-out;
`;

const ForceNbOutputInput = styled.input`
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
  padding: 5px;
  border-radius: 5px;
`;

export default AIDataSplitterNode;
