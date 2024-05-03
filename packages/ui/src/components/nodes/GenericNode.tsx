import React, { useState, useEffect, useContext, useMemo } from "react";
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
import { generateIdForHandle, getTargetHandleKey } from "../../utils/flowUtils";
import { ICON_MAP } from "./utils/NodeIcons";
import { Field } from "../../nodes-configuration/types";
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
  nodeFields?: Field[];
}

const GenericNode: React.FC<GenericNodeProps> = React.memo(
  ({ data, id, selected, nodeFields }) => {
    const { t } = useTranslation("flow");

    const {
      hasParent,
      showOnlyOutput,
      onUpdateNodeData,
      getNodeDimensions,
      getIncomingEdges,
    } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [showLogs, setShowLogs] = useState<boolean>(
      data.config?.defaultHideOutput == null
        ? true
        : !data.config.defaultHideOutput,
    );
    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [fields, setFields] = useState<Field[]>(
      !!data.config?.fields
        ? data.config.fields
        : !!nodeFields
          ? nodeFields
          : [],
    );

    const nbOutput =
      data.outputData != null && typeof data.outputData !== "string"
        ? data.outputData.length
        : 1;

    const outputHandleIds = useMemo(() => {
      return new Array(nbOutput)
        .fill(0)
        .map((_, index) => generateIdForHandle(index, true));
    }, [nbOutput]);

    const nbInput = useMemo(() => {
      if (!!data.config.inputNames) {
        return data.config.inputNames.length;
      }
      if (!!fields && fields.some((field) => field.hasHandle)) {
        return fields.length;
      }
      return 1;
    }, []);

    const { allInputHandleIds, allHandlePositions } = useHandlePositions(
      data,
      nbInput,
      outputHandleIds,
    );

    useEffect(() => {
      if (data.isDone) setIsPlaying(false);

      if (!data.config.defaultHideOutput) {
        setShowLogs(true);
      } else {
        setShowLogs(false);
      }
    }, [data.lastRun, data.outputData]);

    useEffect(() => {
      if (!data.config.fields.some((field) => field.hasHandle)) return;

      const fieldsToNullify: any = {};

      const edgesKeys = getIncomingEdges(id)?.map((edge) =>
        getTargetHandleKey(edge),
      );

      edgesKeys?.forEach((key) => {
        fieldsToNullify[fields[key]?.name] = undefined;
      });

      const fieldsUpdated = fields.map((field) => {
        if (field.name in fieldsToNullify) {
          field.isLinked = true;
        } else {
          field.isLinked = false;
        }
        return field;
      });

      onUpdateNodeData(id, {
        ...data,
        ...fieldsToNullify,
        config: {
          ...data.config,
          fields: fieldsUpdated,
          inputNames: fields.map((field) => field.name),
        },
      });
    }, [getIncomingEdges(id)?.length]);

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

    const handleNodeDataChange = (
      fieldName: string,
      value: any,
      target?: any,
    ) => {
      const selectionStart = target?.selectionStart;
      const selectionEnd = target?.selectionEnd;

      onUpdateNodeData(id, {
        ...data,
        [fieldName]: value,
      });

      if (!!target) {
        requestAnimationFrame(() => {
          target.selectionStart = selectionStart;
          target.selectionEnd = selectionEnd;
        });
      }
    };

    function setDefaultOptions() {
      const defaultOptions: any = {};

      //Default options
      data.config.fields
        .filter(
          (field) =>
            field.options?.find((option) => option.default) &&
            !data[field.name],
        )
        .forEach((field) => {
          defaultOptions[field.name] = field.options?.find(
            (option) => option.default,
          )?.value;
        });

      //Default values
      data.config.fields
        .filter(
          (field) => field.defaultValue != null && data[field.name] == null,
        )
        .forEach((field) => {
          defaultOptions[field.name] = field.defaultValue;
        });

      onUpdateNodeData(id, {
        ...data,
        ...defaultOptions,
      });
    }

    const formFields = useFormFields(
      data,
      id,
      handleNodeDataChange,
      setDefaultOptions,
      hasParent,
      {
        showHandles: data.config.showHandlesNames,
        showLabels: data.config.showHandlesNames,
        showOnlyConnectedFields: collapsed,
      },
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

    const displayInputs =
      data.config.hasInputHandle && !data.config.showHandlesNames;

    //const dimensions = getNodeDimensions(id);
    // console.log(dimensions);

    return (
      <NodeContainer key={id} className={`flex h-full w-full flex-col`}>
        <NodeHeader onDoubleClick={toggleCollapsed}>
          {displayInputs && (
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
          {outputHandleIds.map((id, index) => {
            return (
              <HandleWrapper
                key={id}
                id={id}
                position={
                  !!data?.handles && data.handles[id]
                    ? data.handles[id]
                    : Position.Right
                }
                linkedHandlePositions={allHandlePositions}
                onChangeHandlePosition={handleChangeHandlePosition}
                data-tooltip-id={`app-tooltip`}
                data-tooltip-content={
                  data.outputData ? data.outputData[index] : ""
                }
                isOutput
              />
            );
          })}
          <NodePlayButton
            isPlaying={isPlaying}
            hasRun={!!data.lastRun}
            onClick={handlePlayClick}
            nodeName={data.name}
          />
        </NodeHeader>
        <NodeBand
          selected={selected}
          className={`${selected ? "animate-pulse" : ""}`}
        />
        {(!hideNodeParams || data.config.showHandlesNames) && (
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
