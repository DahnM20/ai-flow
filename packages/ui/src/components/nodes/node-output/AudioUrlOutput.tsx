import React from "react";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { getFileTypeFromUrl, getGeneratedFileName } from "./outputUtils";

import VideoJS from "../../players/VideoJS";

interface AudioUrlOutputProps {
  url: string;
  name: string;
}

const AudioUrlOutput: React.FC<AudioUrlOutputProps> = ({ url, name }) => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    controls: true,
    autoplay: false,
    loop: false,
    muted: false,
    fluid: true,
    bigPlayButton: false,
    plugins: {
      wavesurfer: {
        backend: "MediaElement",
        displayMilliseconds: false,
        debug: false,
        waveColor: "rgb(72, 159, 159)",
        progressColor: "rgba(32, 32, 32, 0.719)",
        cursorColor: "rgba(226, 226, 226, 0.616)",
        hideScrollbar: true,
      },
    },
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    const mimeType = `audio/${getFileTypeFromUrl(url)}`;
    player.src({ src: url, type: mimeType });
  };

  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = url;
    link.download = getGeneratedFileName(url, name);
    link.target = "_blank";
    link.click();
  };

  return (
    <OutputAudioContainer className="audio-player w-full">
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} key={url} />
      <div
        className="absolute right-3 top-2 rounded-md bg-slate-600/75 px-1 py-1 text-2xl text-slate-100 hover:bg-sky-600/90"
        onClick={handleDownloadClick}
      >
        <FaDownload />
      </div>
    </OutputAudioContainer>
  );
};

const OutputAudioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 10px;
`;

export default AudioUrlOutput;
