import React from 'react';
import { FaDownload } from 'react-icons/fa';
import styled from 'styled-components';

interface ImageUrlOutputProps {
  url: string;
  name: string;
}

const ImageUrlOutput: React.FC<ImageUrlOutputProps> = ({ url, name }) => {

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name + '-output-generated.jpg';
    link.target = '_blank';
    link.click();
  };

  return <OutputImageContainer>
    <OutputImage src={url} alt="Output Image" />
    <DownloadButton onClick={handleDownloadClick}>
      <FaDownload />
    </DownloadButton>
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

const DownloadButton = styled.a`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #4285f4;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0d47a1;
  }
`;
export default ImageUrlOutput;