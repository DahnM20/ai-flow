import { useState } from "react";
import { FiFile } from "react-icons/fi";
import AudioUrlOutput from "../../nodes/node-output/AudioUrlOutput";
import ImageUrlOutput from "../../nodes/node-output/ImageUrlOutput";
import MarkdownOutput from "../../nodes/node-output/MarkdownOutput";
import PdfUrlOutput from "../../nodes/node-output/PdfUrlOutput";
import ThreeDimensionalUrlOutput from "../../nodes/node-output/ThreeDimensionalUrlOutput";
import VideoUrlOutput from "../../nodes/node-output/VideoUrlOutput";
import { NodeData } from "../../nodes/types/node";
import { OutputType } from "../../../nodes-configuration/types";
import OutputDisplay from "../../nodes/node-output/OutputDisplay";
import { useTranslation } from "react-i18next";

interface OutputRendererProps {
  data: NodeData;
  thumbnail?: boolean;
  showOutputOptions?: boolean;
  fontSize?: number;
}

export default function OutputRenderer({
  data,
  thumbnail,
  showOutputOptions = true,
  fontSize = 1,
}: OutputRendererProps) {
  const { t } = useTranslation("flow");
  const [indexDisplayed, setIndexDisplayed] = useState(0);

  const getOutputComponent = (data: NodeData, outputType: OutputType) => {
    if (!data.outputData) return <></>;

    let output = data.outputData;

    if (typeof output !== "string") {
      output = output[indexDisplayed];
    }

    switch (outputType) {
      case "imageUrl":
        if (thumbnail) {
          return <ImageUrlOutput url={output} name={data.name} />;
        }

        return (
          <div className="flex items-center justify-center">
            <div className=" md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
              <ImageUrlOutput url={output} name={data.name} />
            </div>
          </div>
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
              <FiFile className="text-3xl" />
              <p>{t("FileUploaded")}</p>
            </div>
          </a>
        );
      default:
        return (
          <span
            className={`bg-af-bg-5 rounded-2xl ${thumbnail ? "p-4 text-xs" : "p-5 text-sm md:p-8 md:text-base"}`}
          >
            <MarkdownOutput
              data={
                thumbnail && !!output && output.length > 200
                  ? output.substring(0, 200) + "..."
                  : output
              }
              name={data.name}
              appearance={{
                fontSize: fontSize,
              }}
            />
          </span>
        );
    }
  };

  return (
    <OutputDisplay
      data={data}
      getOutputComponentOverride={getOutputComponent}
    />
  );
}
