import { copyToClipboard } from "../../../utils/navigatorUtils";
import MarkdownOutput from "./MarkdownOutput";
import { NodeLogs, NodeLogsText } from "../Node.styles";
import { NodeData } from "../types/node";
import { toastFastInfoMessage } from "../../../utils/toastUtils";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FiCopy, FiFile } from "react-icons/fi";
import ImageUrlOutput from "./ImageUrlOutput";
import ImageBase64Output from "./ImageBase64Output";
import VideoUrlOutput from "./VideoUrlOutput";
import AudioUrlOutput from "./AudioUrlOutput";
import { getOutputTypeFromExtension } from "./outputUtils";
import PdfUrlOutput from "./PdfUrlOutput";
import { OutputType } from "../../../nodes-configuration/types";

interface OutputDisplayProps {
  data: NodeData;
}

export default function OutputDisplay({ data }: OutputDisplayProps) {
  const { t } = useTranslation("flow");

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
      case "text":
        return <p>{output}</p>;
      case "fileUrl":
        return (
          <a href={output} target="_blank" rel="noreferrer">
            <div className="flex flex-row items-center justify-center space-x-2 py-2 hover:text-sky-400">
              <FiFile className="text-4xl" />
              <p>{t("DownloadFile")}</p>
            </div>
          </a>
        );
      default:
        return <MarkdownOutput data={output} />;
    }
  };

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

  return <>{getOutputComponent()}</>;
}
