import React from "react";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { getGeneratedFileName } from "./outputUtils";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface AudioUrlOutputProps {
  url: string;
  name: string;
}

const AudioUrlOutput: React.FC<AudioUrlOutputProps> = ({ url, name }) => {
  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = getGeneratedFileName(url, name);
    link.target = "_blank";
    link.click();
  };

  return (
    <OutputAudioContainer className="audio-player w-full pt-12">
      <StyledAudioPlayer src={url} />
      <div
        className="absolute right-3 top-2 rounded-md bg-slate-600/75 px-1 py-1 text-2xl text-slate-100 hover:bg-sky-600/90"
        onClick={handleDownloadClick}
      >
        <FaDownload />
      </div>
    </OutputAudioContainer>
  );
};

const StyledAudioPlayer = styled(AudioPlayer)``;

const OutputAudioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 10px;
`;

export default AudioUrlOutput;
