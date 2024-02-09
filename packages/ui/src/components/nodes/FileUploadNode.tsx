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
  NodeTitle,
} from "./Node.styles";
import { useTranslation } from "react-i18next";
import { getRestApiUrl } from "../../config/config";
import { toastInfoMessage } from "../../utils/toastUtils";
import axios, { AxiosProgressEvent, AxiosRequestConfig } from "axios";

const FileUploadNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const { hasParent, showOnlyOutput, isRunning, onUpdateNodeData } =
    useContext(NodeContext);
  const { t } = useTranslation("flow");
  const [files, setFiles] = useState<File[] | null>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const accept = {
    "video/mp4": [".mp4"],
    "audio/mpeg": [".mp3"],
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive = false,
  } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        if (!!files) {
          setFiles([...files, ...acceptedFiles]);
        } else {
          setFiles(acceptedFiles);
        }
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

      const uploadUrl = urls.upload_url;

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

      console.log("File successfully uploaded");
      console.log(urls.download_url);
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

  return (
    <NodeContainer className="pb-2">
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
    </NodeContainer>
  );
};

export default FileUploadNode;
