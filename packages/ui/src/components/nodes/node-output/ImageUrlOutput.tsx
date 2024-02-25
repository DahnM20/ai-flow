import React from "react";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { getGeneratedFileName } from "./outputUtils";

interface ImageUrlOutputProps {
  url: string;
  name: string;
}

const ImageUrlOutput: React.FC<ImageUrlOutputProps> = ({ url, name }) => {
  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = getGeneratedFileName(url, name);
    link.target = "_blank";
    link.click();
  };

  return (
    <OutputImageContainer>
      <OutputImage src={url} alt="Output Image" />
      <div
        className="absolute right-3 top-2 rounded-md bg-slate-600/75 px-1 py-1 text-2xl text-slate-100 hover:bg-sky-600/90"
        onClick={handleDownloadClick}
      >
        <FaDownload />
      </div>
    </OutputImageContainer>
  );
};

const OutputImageContainer = styled.div`
  position: relative;
  margin-top: 10px;
`;

const OutputImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

export default ImageUrlOutput;
