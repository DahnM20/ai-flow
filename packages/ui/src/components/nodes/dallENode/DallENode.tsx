import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { FaDownload, FaImage } from 'react-icons/fa';
import { NodeResizer } from '@reactflow/node-resizer';
import { InputHandle, NodeBand, NodeContainer, NodeContent, NodeForm, NodeHeader, NodeIcon, NodeLabel, NodeLogs, NodeLogsText, NodeTextarea, NodeTitle, OutputHandle } from '../../shared/Node.styles';
import styled from 'styled-components';
import NodePlayButton from '../../tools/NodePlayButton';
import { NodeContext } from '../../providers/NodeProvider';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { generateIdForHandle } from '../../../utils/flowUtils';

interface DallENodeData {
  name: string;
  processorType: string;
  prompt: string;
  input: string;
  output_data?: string;
  onDelete?: (id: string) => void;
}

const DallENode: React.FC<NodeProps> = ({ data, id, selected }) => {

  const { hasParent, showOnlyOutput} = useContext(NodeContext);

  const updateNodeInternals = useUpdateNodeInternals();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [nodeData, setNodeData] = useState<DallENodeData>({
    name: data.name || '',
    processorType: data.processorType || '',
    input: data.input || '',
    prompt: data.prompt,
    output_data: data.output_data || '',
  });
  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    setNodeId(`${data.id}-${Date.now()}`);
    setIsPlaying(false);
    updateNodeInternals(id);
  }, [data.output_data]);

  useRefreshOnAppearanceChange(updateNodeInternals, id, [showLogs, collapsed]);
  useHandleShowOutput({ showOnlyOutput, setCollapsed, setShowLogs, updateNodeInternals, id });
  
  const handleNodeDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNodeData({
      ...nodeData,
      [event.target.name]: event.target.value,
    });
    data[event.target.name] = event.target.value;
    updateNodeInternals(id);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = data.output_data;
    link.download = data.name + '-output-generated.jpg';
    link.target = '_blank'; // Ajout de l'attribut target
    link.click();
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const hideNodeContent = hasParent(id) || collapsed;

  return (
    <NodeContainer key={nodeId}>
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <InputHandle className="handle" type="target" position={Position.Top}/>
        <NodeIcon><FaImage /></NodeIcon>
        <NodeTitle>DALL-E</NodeTitle>
        <OutputHandle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} />
        <NodePlayButton isPlaying={isPlaying} onClick={handlePlayClick} nodeName={data.name}/>
      </NodeHeader>
      <NodeBand/>
      {!hideNodeContent &&  (
        <NodeContent>
          <NodeForm>
            <NodeLabel>Prompt:</NodeLabel>
            <NodeTextarea
              name="prompt"
              className="nodrag"
              value={nodeData.prompt}
              onChange={handleNodeDataChange}
            />
          </NodeForm>
        </NodeContent>
      )}
      <NodeLogs
        showLogs={showLogs}
        onClick={() => setShowLogs(!showLogs)}
      >
        {!showLogs
          ? <NodeLogsText>Click to show image output</NodeLogsText>
          : <>
            {data.output_data && (
              <OutputImageContainer>
                <OutputImage src={data.output_data} alt="Output Image" />
                <DownloadButton onClick={handleDownloadClick}>
                  <FaDownload />
                </DownloadButton>
              </OutputImageContainer>
            )}
          </>
        }
      </NodeLogs>
    </NodeContainer>
  );
};

const OutputImageContainer = styled.div`
  position: relative;
  margin-top: 10px;
`;

const OutputImage = styled.img`
  display: block;
  width: 100%;
  max-width: 400px;
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


export default DallENode;