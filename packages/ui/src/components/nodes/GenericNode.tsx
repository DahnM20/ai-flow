import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import {
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeTitle,
  NodeContent,
  NodeForm,
  NodeBand,
} from "./Node.styles";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { generateIdForHandle } from "../../utils/flowUtils";
import { ICON_MAP } from "./utils/NodeIcons";
import { Field } from "../../nodes-configuration/nodeConfig";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { useTranslation } from "react-i18next";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { GenericNodeData } from "./types/node";
import HandleWrapper from "../handles/HandleWrapper";
import useHandlePositions from "../../hooks/useHandlePositions";
import { useFormFields } from "../../hooks/useFormFields";
import NodeOutput from "./node-output/NodeOutput";

interface GenericNodeProps extends NodeProps {
  data: GenericNodeData;
  id: string;
  selected: boolean;
}

const GenericNode: React.FC<GenericNodeProps> = React.memo(
  ({ data, id, selected }) => {
    const { t } = useTranslation("flow");

    const { hasParent, showOnlyOutput, onUpdateNodeData, getNodeDimensions } =
      useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [showLogs, setShowLogs] = useState<boolean>(
      data.config.defaultHideOutput == null
        ? true
        : !data.config.defaultHideOutput,
    );
    const [isPlaying, setIsPlaying] = useIsPlaying();

    const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);

    const nbInput = useMemo(() => {
      return !!data.config.inputNames ? data.config.inputNames.length : 1;
    }, []);

    const { allInputHandleIds, allHandlePositions } = useHandlePositions(
      data,
      nbInput,
      outputHandleId,
    );

    useEffect(() => {
      if (data.isDone) setIsPlaying(false);

      if (!data.config.defaultHideOutput) {
        setShowLogs(true);
      } else {
        setShowLogs(false);
      }
    }, [data.lastRun, data.outputData]);

    useHandleShowOutput({
      showOnlyOutput,
      setCollapsed: setCollapsed,
      setShowLogs: setShowLogs,
    });

    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    const handleNodeDataChange = (fieldName: string, value: any) => {
      onUpdateNodeData(id, {
        ...data,
        [fieldName]: value,
      });
    };

    function setDefaultOption(field: Field) {
      if (field.options) {
        const defaultOption = field.options.find((option) => option.default);
        if (defaultOption) {
          onUpdateNodeData(id, {
            ...data,
            [field.name]: defaultOption.value,
          });
        }
      }
    }

    const formFields = useFormFields(
      data,
      id,
      handleNodeDataChange,
      setDefaultOption,
      hasParent,
    );

    const hideNodeParams =
      (hasParent(id) && data.config.hideFieldsIfParent) || collapsed;

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

    const NodeIconComponent = ICON_MAP[data.config.icon];

    //const dimensions = getNodeDimensions(id);
    // console.log(dimensions);

    return (
      <NodeContainer key={id} className={`flex h-full w-full flex-col`}>
        <NodeHeader onDoubleClick={toggleCollapsed}>
          {data.config.hasInputHandle && (
            <>
              {allInputHandleIds.map((id) => {
                return (
                  <HandleWrapper
                    key={id}
                    id={id}
                    position={
                      !!data?.handles && data.handles[id]
                        ? data.handles[id]
                        : Position.Left
                    }
                    linkedHandlePositions={allHandlePositions}
                    onChangeHandlePosition={handleChangeHandlePosition}
                  />
                );
              })}
            </>
          )}
          <NodeIcon>{NodeIconComponent && <NodeIconComponent />}</NodeIcon>
          <NodeTitle>{t(data.config.nodeName)}</NodeTitle>
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
          <NodePlayButton
            isPlaying={isPlaying}
            hasRun={!!data.lastRun}
            onClick={handlePlayClick}
            nodeName={data.name}
          />
        </NodeHeader>
        <NodeBand />
        {!hideNodeParams && (
          <NodeContent>
            <NodeForm>{formFields}</NodeForm>
          </NodeContent>
        )}
        <NodeOutput
          showLogs={showLogs}
          onClickOutput={() => setShowLogs(!showLogs)}
          data={data}
        />
      </NodeContainer>
    );
  },
  propsAreEqual,
);

function propsAreEqual(
  prevProps: GenericNodeProps,
  nextProps: GenericNodeProps,
) {
  if (
    prevProps.selected !== nextProps.selected ||
    prevProps.id !== nextProps.id
  ) {
    return false;
  }

  for (let key in prevProps.data) {
    if (
      key !== "x" &&
      key !== "y" &&
      prevProps.data[key] !== nextProps.data[key]
    ) {
      return false;
    }
  }

  for (let key in nextProps.data) {
    if (
      key !== "x" &&
      key !== "y" &&
      nextProps.data[key] !== prevProps.data[key]
    ) {
      return false;
    }
  }

  return true;
}

export default GenericNode;
