import React, { useContext, useEffect, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { FaFileAlt, FaCheckCircle, FaImage } from "react-icons/fa";
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
import { getRestApiUrl } from "../../config/config";
import { toastInfoMessage } from "../../utils/toastUtils";
import axios, { AxiosProgressEvent } from "axios";
import { GenericNodeData } from "./types/node";
import { getOutputTypeFromExtension } from "./node-output/outputUtils";
import NodeOutput from "./node-output/NodeOutput";

interface GenericNodeProps extends NodeProps {
  data: GenericNodeData;
  id: string;
  selected: boolean;
}

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

  const accept = {
    "video/mp4": [".mp4"],
    "audio/mpeg": [".mp3"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/gif": [".gif"],
    "text/plain": [".txt"],
    "application/pdf": [".pdf"],
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive = false,
  } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length == 1) {
        setFiles(acceptedFiles);
      }
    },
  });

  async function getUploadAndDownloadUrl() {
    try {
      const url = `${getRestApiUrl()}/upload`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      toastInfoMessage("Error uploading file ");
      console.error("Error uploading file :", error);
      throw error;
    }
  }

  useEffect(() => {
    async function processFiles(files: File[]) {
      if (!files || files.length === 0) return;

      const urls = await getUploadAndDownloadUrl();

      console.log("URLS : ", urls);

      const uploadUrl = urls.upload_link;

      console.log("Upload URL : ", uploadUrl);

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;

          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          console.log(`Upload progress: ${percentCompleted}%`);
        },
      };

      await axios.put(uploadUrl, files[0], config);

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

      console.log("File successfully uploaded");
      console.log(urls.download_link);
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

  return (
    <NodeContainer>
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <NodeIcon>
          <FaImage />
        </NodeIcon>
        <NodeTitle>{"File"}</NodeTitle>
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
      {collapsed ? null : (
        <div
          className={`${isDragActive ? " border-sky-300 " : "border-slate-500 "} 
        m-5 flex  flex-col items-center space-y-3 rounded-lg  border-2 border-dashed p-4 text-slate-200 transition-all hover:text-sky-300`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          {files ? (
            <>
              <FaCheckCircle className="text-4xl text-green-400" />
              <p>{files.length} file(s) selected</p>
              {files.map((file) => (
                <p key={file.name}>{file.name}</p>
              ))}
            </>
          ) : (
            <>
              <FaFileAlt className="text-4xl" />
              <p className="text-center text-lg">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag and drop a file here or click to select"}
              </p>
            </>
          )}
        </div>
      )}
      {!collapsed && !files && (
        <div className="flex w-full flex-col items-center justify-center space-y-2 px-2 pb-4 text-slate-200">
          <p> {t("Or")} </p>
          <div className="flex w-2/3  flex-row space-x-2">
            <NodeInput
              className="text-center"
              placeholder={t("EnterModelNameDirectly") ?? ""}
              onChange={(event) => setUrl(event.target.value)}
            />
            <button
              className="rounded-lg bg-sky-500 p-2 hover:bg-sky-400"
              onClick={handleSetFileViaURL}
            >
              {" "}
              {t("Load")}{" "}
            </button>
          </div>
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
