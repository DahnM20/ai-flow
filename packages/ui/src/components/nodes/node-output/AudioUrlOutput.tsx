import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';
import { getGeneratedFileName } from './outputUtils';

interface AudioUrlOutputProps {
    url: string;
    name: string;
}

const AudioUrlOutput: React.FC<AudioUrlOutputProps> = ({ url, name }) => {

    const handleDownloadClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        const link = document.createElement('a');
        link.href = url;
        link.download = getGeneratedFileName(url, name);
        link.target = '_blank';
        link.click();
    };

    return <OutputAudioContainer>
        <OutputAudio controls src={url} />
        <div
            className='absolute top-2 right-3 px-1 py-1 text-slate-100 text-2xl bg-slate-600/75 hover:bg-sky-600/90 rounded-md'
            onClick={handleDownloadClick}>
            <FaDownload />
        </div>
    </OutputAudioContainer>
};

const OutputAudioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 10px;
`;

const OutputAudio = styled.audio`
  min-height: 100px;
  width: 100%;
`;

export default AudioUrlOutput;
