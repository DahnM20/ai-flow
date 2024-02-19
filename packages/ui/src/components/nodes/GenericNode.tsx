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
  NodeLogs,
  NodeLogsText,
} from "./Node.styles";
import useHandleShowOutput from "../../hooks/useHandleShowOutput";
import { useRefreshOnAppearanceChange } from "../../hooks/useRefreshOnAppearanceChange";
import { generateIdForHandle } from "../../utils/flowUtils";
import { ICON_MAP } from "./utils/NodeIcons";
import { Field } from "../../nodes-configuration/nodeConfig";
import MarkdownOutput from "./node-output/MarkdownOutput";
import { NodeContext } from "../../providers/NodeProvider";
import NodePlayButton from "./node-button/NodePlayButton";
import { useTranslation } from "react-i18next";
import { FiCopy } from "react-icons/fi";
import styled from "styled-components";
import { copyToClipboard } from "../../utils/navigatorUtils";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import ImageUrlOutput from "./node-output/ImageUrlOutput";
import ImageBase64Output from "./node-output/ImageBase64Output";
import { GenericNodeData } from "./types/node";
import HandleWrapper from "../handles/HandleWrapper";
import { toastFastInfoMessage } from "../../utils/toastUtils";
import useHandlePositions from "../../hooks/useHandlePositions";
import { useFormFields } from "../../hooks/useFormFields";
import VideoUrlOutput from "./node-output/VideoUrlOutput";

interface GenericNodeProps {
  data: GenericNodeData;
  id: string;
  selected: boolean;
}

const GenericNode: React.FC<NodeProps> = React.memo(
  ({ data, id, selected }) => {
    const { t } = useTranslation("flow");

    const { hasParent, showOnlyOutput, onUpdateNodeData } =
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

      updateNodeInternals(id);
    }, [data.lastRun, data.outputData]);

    useEffect(() => {
      if (textareaRef.current) {
        const newWidth = textareaRef.current.offsetWidth;
        const newHeight = textareaRef.current.offsetHeight;
        if (newWidth !== data.width || newHeight !== data.height) {
          updateNodeInternals(id);
        }
      }
    }, [data, id]);

    useRefreshOnAppearanceChange(updateNodeInternals, id, [
      collapsed,
      showLogs,
    ]);

    useHandleShowOutput({
      showOnlyOutput,
      id: id,
      setCollapsed: setCollapsed,
      setShowLogs: setShowLogs,
      updateNodeInternals: updateNodeInternals,
    });

    const handleNodeDataChange = (fieldName: string, value: any) => {
      onUpdateNodeData(id, {
        ...data,
        [fieldName]: value,
      });
      updateNodeInternals(id);
    };

    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
      setIsPlaying(true);
    };

    const handleOptionChange = (name: string, value: string) => {
      onUpdateNodeData(id, {
        ...data,
        [name]: value,
      });
      updateNodeInternals(id);
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
      handleOptionChange,
      setDefaultOption,
      textareaRef,
      hasParent,
    );

    const outputIsMedia =
      (data.config.outputType === "imageUrl" ||
        data.config.outputType === "imageBase64" ||
        data.config.outputType === "videoUrl") &&
      !!data.outputData;

    const hideNodeParams =
      (hasParent(id) && data.config.hideFieldsIfParent) || collapsed;

    const getOutputComponent = () => {
      if (!data.outputData || !data.lastRun) return <></>;

      let output = data.outputData;

      if (typeof output !== "string") {
        output = output[0];
      }

      switch (data.config.outputType) {
        case "imageUrl":
          return <ImageUrlOutput url={output} name={data.name} />;
        case "imageBase64":
          return (
            <ImageBase64Output
              data={output}
              name={data.name}
              lastRun={data.lastRun}
            />
          );
        case "videoUrl":
          return <VideoUrlOutput url={output} name={data.name} />;
        default:
          return <MarkdownOutput data={output} />;
      }
    };

    const handleCopyToClipboard = (event: any) => {
      event.stopPropagation();
      if (data.outputData && typeof data.outputData == "string") {
        copyToClipboard(data.outputData);
        toastFastInfoMessage(t("copiedToClipboard"));
      }
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

    const NodeIconComponent = ICON_MAP[data.config.icon];

    return (
      <NodeContainer key={id} className="node-wrapper">
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
        <NodeLogs
          showLogs={showLogs}
          noPadding={outputIsMedia && showLogs}
          onClick={() => setShowLogs(!showLogs)}
        >
          {showLogs && data.outputData && !outputIsMedia && (
            <StyledCopyIcon
              className="copy-icon hover:text-white"
              onClick={(event) => {
                handleCopyToClipboard(event);
              }}
            />
          )}
          {!showLogs && data.outputData ? (
            <NodeLogsText className="text-center">
              {t("ClickToShowOutput")}
            </NodeLogsText>
          ) : (
            getOutputComponent()
          )}
        </NodeLogs>
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

const StyledCopyIcon = styled(FiCopy)`
  position: absolute;
  right: 10px;
  cursor: pointer;
  z-index: 1;
`;
