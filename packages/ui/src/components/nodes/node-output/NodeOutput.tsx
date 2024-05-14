import { copyToClipboard } from "../../../utils/navigatorUtils";
import { NodeLogs, NodeLogsText } from "../Node.styles";
import { NodeData } from "../types/node";
import { toastFastInfoMessage } from "../../../utils/toastUtils";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FiCopy } from "react-icons/fi";
import { getOutputExtension } from "./outputUtils";
import { OutputType } from "../../../nodes-configuration/types";
import OutputDisplay from "./OutputDisplay";

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

  function getOutputType(): OutputType {
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

    const outputType = getOutputExtension(output);

    return outputType;
  }

  const outputType = getOutputType();

  const outputIsMedia =
    (outputType === "imageUrl" ||
      outputType === "imageBase64" ||
      outputType === "videoUrl" ||
      outputType === "audioUrl" ||
      outputType === "pdfUrl" ||
      outputType === "3dUrl") &&
    !!data.outputData;

  return (
    <NodeLogs
      showLogs={showLogs}
      noPadding={outputIsMedia && showLogs}
      onDoubleClick={onClickOutput}
      onClick={!showLogs ? onClickOutput : undefined}
      className={`relative flex h-auto w-full flex-grow justify-center p-4 ${showLogs ? "nodrag nowheel" : ""}`}
    >
      {!showLogs && data.outputData ? (
        <NodeLogsText className="flex h-auto w-full justify-center text-center">
          {t("ClickToShowOutput")}
        </NodeLogsText>
      ) : (
        <OutputDisplay data={data} />
      )}
    </NodeLogs>
  );
}
