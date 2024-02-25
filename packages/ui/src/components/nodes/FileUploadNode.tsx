import React, { useContext, useEffect, useState } from "react";
import { FaFileAlt, FaImage, FaLink } from "react-icons/fa";
import { NodeProps, Handle, Position, useUpdateNodeInternals } from "reactflow";
import HandleWrapper from "../handles/HandleWrapper";
import { generateIdForHandle } from "../../utils/flowUtils";
import { NodeContext } from "../../providers/NodeProvider";
import { useIsPlaying } from "../../hooks/useIsPlaying";
import NodePlayButton from "./node-button/NodePlayButton";
import {
  NodeBand,
  NodeContainer,
  NodeHeader,
  NodeIcon,
  NodeInput,
  NodeTitle,
} from "./Node.styles";
import { useTranslation } from "react-i18next";
import { toastErrorMessage } from "../../utils/toastUtils";
import { GenericNodeData } from "./types/node";
import { getOutputTypeFromExtension } from "./node-output/outputUtils";
import NodeOutput from "./node-output/NodeOutput";
import OptionSelector, { Option } from "../selectors/OptionSelector";
import InputWithButton from "../inputs/InputWithButton";
import FileDropZone from "../selectors/FileDropZone";
import {
  getUploadAndDownloadUrl,
  uploadWithS3Link,
} from "../../api/uploadFile";

interface GenericNodeProps extends NodeProps {
  data: GenericNodeData;
  id: string;
  selected: boolean;
}

type FileChoice = "url" | "upload";

const fileChoices: Option<FileChoice>[] = [
  {
    name: "URL",
    icon: <FaLink />,
    value: "url",
  },
  {
    name: "Upload",
    icon: <FaFileAlt />,
    value: "upload",
  },
];

const accept = {
  "video/mp4": [".mp4"],
  "audio/mpeg": [".mp3"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/gif": [".gif"],
  "text/plain": [".txt"],
  "application/pdf": [".pdf"],
};

const FileUploadNode = ({ data, id, selected }: GenericNodeProps) => {
  const { hasParent, showOnlyOutput, isRunning, onUpdateNodeData } =
    useContext(NodeContext);
  const { t } = useTranslation("flow");
  const [files, setFiles] = useState<File[] | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [collapsed, setCollapsed] = useState<boolean>(
    data.outputData ? true : false,
  );
  const [showLogs, setShowLogs] = useState<boolean>(
    data.outputData ? true : false,
  );
  const [url, setUrl] = useState<string | null>(null);

  const [fileChoiceSelected, setFileChoiceSelected] =
    useState<FileChoice | null>(data?.fileChoiceSelected);

  useEffect(() => {
    async function processFiles(files: File[]) {
      if (!files || files.length === 0) return;

      let urls;

      try {
        urls = await getUploadAndDownloadUrl();
        const uploadUrl = urls.upload_link;
        await uploadWithS3Link(uploadUrl, files[0]);
      } catch (error) {
        toastErrorMessage(t("error.upload_failed") as string);
        console.log(error);
        return;
      }

      const outputType = getOutputTypeFromExtension(files[0].name);

      onUpdateNodeData(id, {
        ...data,
        fileUrl: urls.download_link,
        outputData: urls.download_link,
        lastRun: new Date(),
        config: {
          ...data.config,
          outputType,
        },
      });

      setShowLogs(true);
      setCollapsed(true);
    }

    if (files) {
      processFiles(files);
    }
  }, [files]);

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

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleSetFileViaURL = () => {
    if (!url) return;

    const outputType = getOutputTypeFromExtension(url);
    onUpdateNodeData(id, {
      ...data,
      fileUrl: url,
      outputData: url,
      lastRun: new Date(),
      config: {
        ...data.config,
        outputType,
      },
    });

    setShowLogs(true);
    setCollapsed(true);
  };

  function handleFileChoiceSelected(choice: FileChoice | null) {
    setFileChoiceSelected(choice);
    onUpdateNodeData(id, {
      ...data,
      fileChoiceSelected,
    });
  }

  return (
    <NodeContainer>
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <NodeIcon>
          <FaImage />
        </NodeIcon>
        <NodeTitle>{t("File")}</NodeTitle>
        <HandleWrapper
          id={generateIdForHandle(0)}
          position={
            !!data?.handles && data.handles[id]
              ? data.handles[id]
              : Position.Right
          }
          isOutput
          onChangeHandlePosition={handleChangeHandlePosition}
        />
        <NodePlayButton
          isPlaying={isPlaying}
          hasRun={!!data.lastRun}
          onClick={handlePlayClick}
          nodeName={data.name}
        />
      </NodeHeader>
      <NodeBand />
      <OptionSelector
        onSelectOption={(option) => handleFileChoiceSelected(option.value)}
        options={fileChoices}
        selectedOption={fileChoiceSelected}
      />
      {!collapsed && fileChoiceSelected === "upload" && (
        <div className="px-5 py-3">
          <FileDropZone accept={accept} onAcceptFile={setFiles} oneFile />
        </div>
      )}
      {!collapsed && fileChoiceSelected === "url" && (
        <div className="text-slate-200">
          <InputWithButton
            buttonText={t("Load") ?? ""}
            inputPlaceholder={t("EnterModelNameDirectly") ?? ""}
            onInputChange={setUrl}
            onButtonClick={handleSetFileViaURL}
            inputClassName="text-center"
            buttonClassName="rounded-lg bg-sky-500 p-2 hover:bg-sky-400"
          />
        </div>
      )}
      <NodeOutput
        showLogs={showLogs}
        onClickOutput={() => setShowLogs(!showLogs)}
        data={data}
      />
    </NodeContainer>
  );
};

export default FileUploadNode;
