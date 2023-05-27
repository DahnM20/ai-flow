import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaLink } from 'react-icons/fa';
import { NodeProps, Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { NodeBand } from '../../shared/Node.styles';
import NodePlayButton from '../../tools/NodePlayButton';
import { useTranslation } from 'react-i18next';

const URLNode: React.FC<NodeProps> = ({ data, id }) => {
  const { t } = useTranslation('flow');

  const updateNodeInternals = useUpdateNodeInternals();
  const [url, setUrl] = useState(data.url);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    updateNodeInternals(id);
  }, [data.output_data]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    data[event.target.name] = event.target.value;
    updateNodeInternals(id);
  };

  
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <Container>
      <Header>
        <Icon>
          <FaLink />
        </Icon>
        <Title>{t('EnterURL')}</Title>
        <NodePlayButton isPlaying={isPlaying} onClick={handlePlayClick} nodeName={data.name}/>
      </Header>
      <NodeBand/>
      <Content>
        <Input
          type="text"
          name="url"
          value={url}
          onChange={handleInputChange}
          placeholder="https://example.com"
        />
      </Content>
      <Handle type="source" id="output-a" position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
    </Container>
  );
};

const Container = styled.div`
  width: 400px;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  color: ${({ theme }) => theme.text};;
  background-color:  ${({ theme }) => theme.nodeBg};
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const Icon = styled.div`
  margin-right: 10px;
  font-size: 18px;
`;

const Title = styled.div``;

const Content = styled.div`
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.nodeInputBg};
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

  ::placeholder {
    color: ${({ theme }) => theme.nodeInputBg};
  }
`;

export default URLNode;