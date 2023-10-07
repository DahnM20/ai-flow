import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';

interface ImageUrlOutputProps {
  url: string;
  name: string;
}

const ImageUrlOutput: React.FC<ImageUrlOutputProps> = ({ url, name }) => {

  const handleDownloadClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = name + '-output-generated.jpg';
    link.target = '_blank';
    link.click();
  };

  return <OutputImageContainer>
    <OutputImage src={url} alt="Output Image" />
    <div
      className='absolute top-2 right-3 px-1 py-1 text-slate-100 text-2xl bg-slate-600/75 hover:bg-sky-400/90 rounded-md'
      onClick={handleDownloadClick}>
      <FaDownload />
    </div>
  </OutputImageContainer>
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