import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getUploadAndDownloadUrl,
  uploadWithS3Link,
} from "../../../api/uploadFile";
import { useLoading } from "../../../hooks/useLoading";
import { toastErrorMessage } from "../../../utils/toastUtils";
import { getOutputExtension } from "../../nodes/node-output/outputUtils";
import { LoadingSpinner } from "../../nodes/Node.styles";
import { Input } from "@mantine/core";
import OutputRenderer from "./OutputRenderer";
import { MdFileUpload } from "react-icons/md";
import { ThemeContext } from "../../../providers/ThemeProvider";

export interface UploadInfo {
  url: string;
  extension: string;
}

interface FileUploadFieldProps {
  onFileUpload: (uploadResult: UploadInfo) => void;
  onUrlSubmit: (url: string) => void;
  value?: string;
  isRenderForNode?: boolean;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  onFileUpload,
  onUrlSubmit,
  value = "",
  isRenderForNode = false,
}) => {
  const { t } = useTranslation("flow");
  const [url, setUrl] = useState<string>(value);
  const [showPreview, setShowPreview] = useState<boolean>(!!value);
  const [isLoading, startLoadingWith] = useLoading();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { getStyle } = useContext(ThemeContext);

  useEffect(() => {
    if (value) {
      setUrl(value);
      setShowPreview(true);
    }
  }, [value]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await startLoadingWith(uploadFile, file);
        const outputType = getOutputExtension(file.name);

        const info: UploadInfo = {
          url: result.download_link,
          extension: outputType,
        };

        onFileUpload(info);
        setUrl(info.url);
        setShowPreview(true);
      } catch (error) {
        toastErrorMessage(t("error.upload_failed"));
      }
    }
  };
  const uploadFile = async (file: File) => {
    const filename = file.name;
    const urls = await getUploadAndDownloadUrl(filename);
    await uploadWithS3Link(urls.upload_data, file);
    return urls;
  };

  const handleBlur = () => {
    if (url) {
      onUrlSubmit(url);
      setShowPreview(true);
    }
  };

  return (
    <div data-testid="file-upload-field">
      {isLoading && (
        <div className="text-md my-2 flex w-full items-center justify-center p-2 text-center text-teal-400">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <div className="flex w-full items-center gap-2">
          <Input
            style={{ width: "100%" }}
            placeholder="Enter URL to desired file"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleBlur}
            size="md"
            classNames={{
              input: "text-md",
            }}
            styles={
              isRenderForNode
                ? {
                    input: {
                      backgroundColor: getStyle()?.nodeInputBg,
                      color: getStyle()?.text,
                    },
                  }
                : undefined
            }
          />

          <div
            onClick={handleFileButtonClick}
            className="cursor-pointer p-1 text-lg hover:text-blue-400"
            title="Upload file"
          >
            <MdFileUpload />
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {showPreview && (
        <div className="mt-2">
          <OutputRenderer data={{ outputData: url } as any} thumbnail />
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
