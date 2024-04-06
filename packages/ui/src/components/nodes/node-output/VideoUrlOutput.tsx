import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { getGeneratedFileName } from "./outputUtils";
import { useTranslation } from "react-i18next";

interface VideoUrlOutputProps {
  url: string;
  name: string;
}

const VideoUrlOutput: React.FC<VideoUrlOutputProps> = ({ url, name }) => {
  const { t } = useTranslation("flow");
  const [hasError, setHasError] = useState(false);

  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = getGeneratedFileName(url, name);
    link.target = "_blank";
    link.click();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <OutputVideoContainer>
      {hasError ? (
        <p> {t("ExpiredURL")}</p>
      ) : (
        <>
          <OutputVideo controls src={url} onError={handleError} /> {}
          <div
            className="absolute right-3 top-2 rounded-md bg-slate-600/75 px-1 py-1 text-2xl text-slate-100 hover:bg-sky-600/90"
            onClick={handleDownloadClick}
          >
            <FaDownload />
          </div>
        </>
      )}
    </OutputVideoContainer>
  );
};

const OutputVideoContainer = styled.div`
  position: relative;
  margin-top: 10px;
`;

const OutputVideo = styled.video`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

export default VideoUrlOutput;
