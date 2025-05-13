import React, { useState, useEffect, useContext, useMemo, FC } from "react";
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
import {
  generateIdForHandles,
  getKeyFromHandleName,
  getTargetHandleKey,
} from "../../utils/flowUtils";
import { getIconComponent } from "./utils/NodeIcons";
import {
  Field,
  NodeConfig,
  NodeSubConfig,
} from "../../nodes-configuration/types";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { useTranslation } from "react-i18next";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import { GenericNodeData, NodeData } from "./types/node";
import HandleWrapper from "../handles/HandleWrapper";
import useHandlePositions from "../../hooks/useHandlePositions";
import { useFormFields } from "../../hooks/useFormFields";
import NodeOutput from "./node-output/NodeOutput";
import { getDynamicConfig } from "../../api/nodes";
import {
  getAdequateConfigFromDiscriminators,
  getDefaultOptions,
  getNbInputs,
  getNbOutputs,
  hasDiscriminatorChanged,
} from "../../utils/nodeConfigurationUtils";
import { evaluateCondition } from "../../utils/evaluateConditions";

interface GenericNodeProps extends NodeProps {
  data: GenericNodeData;
  id: string;
  selected: boolean;
  nodeFields?: Field[];
  iconComponent?: FC;
}

const GenericNode: React.FC<GenericNodeProps> = React.memo(
  ({ data, id, selected, nodeFields, iconComponent }) => {
    const { t } = useTranslation("flow");

    const {
      hasParent,
      showOnlyOutput,
      onUpdateNodeData,
      getIncomingEdges,
      overrideConfigForNode,
      findNode,
      removeEdgesByIds,
    } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const nbOutput = getNbOutputs(data);

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const [showLogs, setShowLogs] = useState<boolean>(
      data.config?.defaultHideOutput == null
        ? true
        : !data.config.defaultHideOutput,
    );
    const [fields, setFields] = useState<Field[]>(
      !!data.config?.fields
        ? data.config.fields
        : !!nodeFields
          ? nodeFields
          : [],
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
      if (!data.config?.fields?.some((field) => field.hasHandle)) return;

      const fieldsToNullify: any = {};

      const edgesKeys = getIncomingEdges(id)?.map((edge) =>
        getTargetHandleKey(edge),
      );

      const fieldsWithValidCondition = fields.filter((field) => {
        if (field?.condition) {
          const condition = field.condition;
          return evaluateCondition(condition, data);
        }
        return true;
      });

      edgesKeys?.forEach((key) => {
        fieldsToNullify[fieldsWithValidCondition[key]?.name] = undefined;
      });

      const fieldsUpdated = fields.map((field) => {
        if (field.name in fieldsToNullify) {
          field.isLinked = true;
        } else {
          field.isLinked = false;
        }
        return field;
      });

      const currentNodeData = findNode(id)?.data;

      if (!!currentNodeData) {
        onUpdateNodeData(id, {
          ...currentNodeData,
          ...fieldsToNullify,
          config: {
            ...currentNodeData.config,
            fields: fieldsUpdated,
            inputNames: fieldsWithValidCondition.map((field) => field.name),
          },
        });
      }
    }, [getIncomingEdges(id)?.length]);

    const outputHandleIds = useMemo(
      () => generateIdForHandles(nbOutput, true),
      [nbOutput],
    );

    const nbInput = useMemo(
      () => getNbInputs(data, fields),
      [data?.config?.inputNames],
    );

    useEffect(() => {
      if (data.processorType !== "merger-prompt") return;

      const incomingEdges = getIncomingEdges(id) || [];
      const incomingEdgeKeys = incomingEdges.map((edge) =>
        getKeyFromHandleName(edge.targetHandle ?? ""),
      );

      const keysToRemove = incomingEdgeKeys.filter((key) => +key >= nbInput);

      const edgesIdToRemove = incomingEdges
        .filter((edge) =>
          keysToRemove.includes(getKeyFromHandleName(edge.targetHandle ?? "")),
        )
        .map((edge) => edge.id);

      if (edgesIdToRemove.length) removeEdgesByIds(edgesIdToRemove);
    }, [data?.config?.inputNames]);

    const [isPlaying, setIsPlaying] = useIsPlaying();

    useHandleShowOutput({
      showOnlyOutput,
      setCollapsed: setCollapsed,
      setShowLogs: setShowLogs,
    });

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

    const { allInputHandleIds, allHandlePositions } = useHandlePositions(
      data,
      nbInput,
      outputHandleIds,
    );

    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    function updateConfigWithDiscriminator(nodeData: NodeData) {
      const newConfig = getAdequateConfigFromDiscriminators(nodeData)?.config;
      if (!newConfig) return;

      // const defaultOptions: any = getDefaultOptions(newConfig.fields, nodeData);

      if (!!newConfig) {
        overrideConfigForNode(id, newConfig, nodeData);
        // onUpdateNodeData(id, {
        //   ...nodeData,
        //   ...defaultOptions,
        //   config: {
        //     ...newConfig,
        //     isDynamicallyGenerated: false,
        //   },
        // });

        setFields(newConfig.fields);
      }
    }

    function handleNodeDataChange(fieldName: string, value: any, target?: any) {
      const selectionStart = target?.selectionStart;
      const selectionEnd = target?.selectionEnd;

      const newNodeData = {
        ...data,
        [fieldName]: value,
      };

      onUpdateNodeData(id, newNodeData);

      if (hasDiscriminatorChanged(fieldName, newNodeData)) {
        updateConfigWithDiscriminator(newNodeData);
      }

      if (!!target) {
        requestAnimationFrame(() => {
          target.selectionStart = selectionStart;
          target.selectionEnd = selectionEnd;
        });
      }

      if (fieldName === "config") {
        updateNodeInternals(id);
      }
    }

    function setDefaultOptions() {
      const defaultOptions: any = getDefaultOptions(data.config.fields, data);

      onUpdateNodeData(id, {
        ...data,
        ...defaultOptions,
      });
    }

    function handleChangeHandlePosition(
      newPosition: Position,
      handleId: string,
    ) {
      onUpdateNodeData(id, {
        ...data,
        handles: {
          ...data.handles,
          [handleId]: newPosition,
        },
      });
      updateNodeInternals(id);
    }

    function updateConfig(config: NodeConfig) {
      const defaultOptions: any = getDefaultOptions(config.fields, data);

      onUpdateNodeData(id, {
        ...data,
        ...defaultOptions,
        config: {
          ...config,
          isDynamicallyGenerated: false,
        },
      });

      setFields(config.fields);
    }

    function updateConfigVariant(variantConf: NodeSubConfig) {
      const defaultConfigEnabled = variantConf.subConfigurations[0].config;
      const discriminators = variantConf.subConfigurations[0].discriminators;

      const defaultFields = defaultConfigEnabled.fields;
      const defaultOptions: any = getDefaultOptions(defaultFields, data);

      onUpdateNodeData(id, {
        ...data,
        ...defaultOptions,
        ...discriminators,
        config: {
          ...defaultConfigEnabled,
          isDynamicallyGenerated: false,
        },
        variantConfig: {
          ...variantConf,
        },
      });

      setFields(defaultFields);
    }

    async function handleGetDynamicConfig() {
      if (data.config.processorType == null) return;

      const newConfig = await getDynamicConfig(data.config.processorType, data);

      if (newConfig.subConfigurations != null) {
        updateConfigVariant(newConfig);
      } else {
        updateConfig(newConfig);
      }
    }

    const NodeIconComponent = !!iconComponent
      ? iconComponent
      : getIconComponent(data.config.icon);

    const displayInputs =
      data.config.hasInputHandle && !data.config.showHandlesNames;

    const hideNodeParams =
      (hasParent(id) && data.config.hideFieldsIfParent) || collapsed;

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
          <NodeTitle>
            {data.appearance?.customName ?? t(data.config.nodeName)}
          </NodeTitle>
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
          color={data.appearance?.color}
          className={`${selected ? "animate-pulse" : ""}`}
        />
        {(!hideNodeParams || data.config.showHandlesNames) && (
          <NodeContent>
            <NodeForm>{formFields}</NodeForm>
            {data.config.isDynamicallyGenerated && (
              <button
                className={`rounded-lg bg-sky-500 p-2 hover:bg-sky-400`}
                onClick={handleGetDynamicConfig}
              >
                {t("Validate")}
              </button>
            )}
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
