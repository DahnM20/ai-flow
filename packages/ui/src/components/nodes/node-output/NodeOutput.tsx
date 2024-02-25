import React, { useState } from "react";
import { copyToClipboard } from "../../../utils/navigatorUtils";
import MarkdownOutput from "./MarkdownOutput";
import { CopyButton, CopyIcon, NodeLogs, NodeLogsText } from "../Node.styles";
import { NodeData } from "../types/node";
import { toastFastInfoMessage } from "../../../utils/toastUtils";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FiCopy } from "react-icons/fi";
import ImageUrlOutput from "./ImageUrlOutput";
import ImageBase64Output from "./ImageBase64Output";
import VideoUrlOutput from "./VideoUrlOutput";
import AudioUrlOutput from "./AudioUrlOutput";
import { getOutputTypeFromExtension } from "./outputUtils";
import PdfUrlOutput from "./PdfUrlOutput";
import GlbOutput from "./GLBOutput";

interface NodeOutputProps {
  data: NodeData;
  showLogs: boolean;
  onClickOutput: () => void;
}

export default function NodeOutput({
  data,
  showLogs,
  onClickOutput,
}: NodeOutputProps) {
  const { t } = useTranslation("flow");

  const handleCopyToClipboard = (event: any) => {
    event.stopPropagation();
    if (data.outputData && typeof data.outputData == "string") {
      copyToClipboard(data.outputData);
      toastFastInfoMessage(t("copiedToClipboard"));
    }
  };

  const getOutputComponent = () => {
    if (!data.outputData) return <></>;

    let output = data.outputData;

    if (typeof output !== "string") {
      output = output[0];
    }

    switch (getOutputType()) {
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
      case "audioUrl":
        return <AudioUrlOutput url={output} name={data.name} />;
      case "pdfUrl":
        return <PdfUrlOutput url={output} name={data.name} />;
      default:
        return <MarkdownOutput data={output} />;
    }
  };

  function getOutputType(): string {
    if (data.config?.outputType) {
      return data.config.outputType;
    }

    if (!data.outputData) {
      return "markdown";
    }

    let outputData = data.outputData;
    let output = "";

    if (typeof outputData !== "string") {
      output = outputData[0];
    } else {
      output = outputData;
    }

    const outputType = getOutputTypeFromExtension(output);

    return outputType;
  }

  const outputType = getOutputType();

  const outputIsMedia =
    (outputType === "imageUrl" ||
      outputType === "imageBase64" ||
      outputType === "videoUrl" ||
      outputType === "audioUrl" ||
      outputType === "pdfUrl") &&
    !!data.outputData;

  return (
    <NodeLogs
      showLogs={showLogs}
      noPadding={outputIsMedia && showLogs}
      onClick={onClickOutput}
      className={`relative flex h-auto w-full flex-grow justify-center p-4 ${showLogs ? "nodrag nowheel" : ""}`}
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
        <NodeLogsText className="flex h-auto w-full justify-center text-center">
          {t("ClickToShowOutput")}
        </NodeLogsText>
      ) : (
        getOutputComponent()
      )}
    </NodeLogs>
  );
}

const StyledCopyIcon = styled(FiCopy)`
  position: fixed;
  right: 15px;
  cursor: pointer;
  z-index: 1;
`;
