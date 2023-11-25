import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';

interface VideoUrlOutputProps {
    url: string;
    name: string;
}

const VideoUrlOutput: React.FC<VideoUrlOutputProps> = ({ url, name }) => {

    const handleDownloadClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const link = document.createElement('a');
        link.href = url;
        link.download = name + '-output-generated.mp4';
        link.target = '_blank';
        link.click();
    };

    return <OutputVideoContainer>
        <OutputVideo controls src={url} /> { }
        <div
            className='absolute top-2 right-3 px-1 py-1 text-slate-100 text-2xl bg-slate-600/75 hover:bg-sky-600/90 rounded-md'
            onClick={handleDownloadClick}>
            <FaDownload />
        </div>
    </OutputVideoContainer>
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