import MarkdownOutput from "./MarkdownOutput";
import { NodeData } from "../types/node";
import { useTranslation } from "react-i18next";
import { FiFile } from "react-icons/fi";
import ImageUrlOutput from "./ImageUrlOutput";
import ImageBase64Output from "./ImageBase64Output";
import VideoUrlOutput from "./VideoUrlOutput";
import AudioUrlOutput from "./AudioUrlOutput";
import { getOutputTypeFromExtension } from "./outputUtils";
import PdfUrlOutput from "./PdfUrlOutput";
import { OutputType } from "../../../nodes-configuration/types";
import { useState } from "react";
import ThreeDimensionalUrlOutput from "./ThreeDimensionalUrlOutput";

interface OutputDisplayProps {
  data: NodeData;
}

export default function OutputDisplay({ data }: OutputDisplayProps) {
  const { t } = useTranslation("flow");

  const [indexDisplayed, setIndexDisplayed] = useState(0);

  const nbOutput =
    data.outputData != null && typeof data.outputData !== "string"
      ? data.outputData.length
      : 1;

  const getOutputComponent = () => {
    if (!data.outputData) return <></>;

    let output = data.outputData;

    if (typeof output !== "string") {
      output = output[indexDisplayed];
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
      case "3dUrl":
        return <ThreeDimensionalUrlOutput url={output} name={data.name} />;
      case "pdfUrl":
        return <PdfUrlOutput url={output} name={data.name} />;
      case "fileUrl":
        return (
          <a href={output} target="_blank" rel="noreferrer">
            <div className="flex flex-row items-center justify-center space-x-2 py-2 hover:text-sky-400">
              <FiFile className="text-4xl" />
              <p>{t("FileUploaded")}</p>
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
      output = outputData[indexDisplayed];
    } else {
      output = outputData;
    }

    const outputType = getOutputTypeFromExtension(output);

    return outputType;
  }

  return (
    <div
      className="flex h-full w-full flex-col"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {nbOutput > 1 && typeof data.outputData !== "string" && (
        <div className="mt-2 flex flex-row items-center justify-center space-x-4 p-1">
          {data?.outputData?.map((output, index) => (
            <button
              key={index}
              className={`rounded-full ${index === indexDisplayed ? "bg-orange-400" : "bg-slate-200 hover:bg-orange-200"} p-1.5`}
              onClick={() => setIndexDisplayed(index)}
            />
          ))}
        </div>
      )}
      {getOutputComponent()}
    </div>
  );
}
