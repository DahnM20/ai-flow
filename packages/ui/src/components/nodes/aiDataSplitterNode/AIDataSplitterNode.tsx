import React, { useContext, useEffect, useState } from 'react';
import { Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { NodeContext } from '../../providers/NodeProvider';
import NodePlayButton from '../../tools/NodePlayButton';
import { generateIdForHandle } from '../../../utils/flowUtils';
import { InputHandle, NodeTitle, OutputHandle } from '../../shared/Node.styles';
import { useIsPlaying } from '../../../hooks/useIsPlaying';

interface AIDataSplitterNodeData {
  id: string;
  name: string;
  processorType: string;
  nbOutput: number;
  input: string;
  input_key: string;
  output_data?: string[];
}

interface AIDataSplitterNodeProps extends NodeProps {
  data: AIDataSplitterNodeData;
}

const AIDataSplitterNode: React.FC<AIDataSplitterNodeProps> = React.memo(({ data, id, selected }) => {

  const { hasParent, showOnlyOutput } = useContext(NodeContext);

  const updateNodeInternals = useUpdateNodeInternals();


  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
  const [isPlaying, setIsPlaying] = useIsPlaying();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setNodeId(`${data.id}-${Date.now()}`);
    setIsPlaying(false);
    const nbOutput = data.output_data ? data.output_data.length : 0;
    if (nbOutput > getNbOutput()) {
      data.nbOutput = nbOutput;
    }
    updateNodeInternals(id);
  }, [data.output_data]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };


  const handleCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  const handleForceNbOutputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const forcedNbOutput = Number(event.target.value);
    
    if(!forcedNbOutput) return;
    if(forcedNbOutput && data.output_data && forcedNbOutput < data.output_data.length) return;

    data.nbOutput = forcedNbOutput;
    updateNodeInternals(id);
  };

  const getNbOutput = () => {
    return !!data.nbOutput ? data.nbOutput : 0;
  }


  return (
    <DataSplitterNodeContainer selected={selected} nbOutput={getNbOutput()} collapsed={collapsed} key={nodeId} onDoubleClick={handleCollapseClick}>
      {!collapsed
        && <NodeTitle>AI Splitter</NodeTitle>
      }
      <NodePlayButton isPlaying={isPlaying} nodeName={data.name} onClick={handlePlayClick} />
      {!collapsed && (
        <ForceNbOutputInput
          id="nbOutput"
          value={getNbOutput()}
          onChange={handleForceNbOutputChange}
        />
      )}
      <InputHandle className="handle" type="target" position={Position.Left} />
      <div className="output-strip-node-outputs">
        {Array.from(Array(getNbOutput())).map((_, index) => (
          <OutputHandle
            key={generateIdForHandle(index)}
            data-tooltip-id={`${nodeId}-tooltip`}
            data-tooltip-content={data.output_data ? data.output_data[index] : ''}
            type="source"
            id={generateIdForHandle(index)}
            position={Position.Right}
            style={{
              background: data?.output_data ? (data.output_data[index] ? 'rgb(224, 166, 79)' : '#ddd') : '#ddd',
              top: `${getNbOutput() === 1 ? 50 : (index / (getNbOutput() - 1)) * 80 + 10}%`
            }}
          />
        ))}
        <Tooltip id={`${nodeId}-tooltip`} style={{ zIndex: 100 }} />
      </div>
    </DataSplitterNodeContainer>
  );
});

const DataSplitterNodeContainer = styled.div<{ selected: boolean, nbOutput: number, collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
  padding: 10px;
  border: 2px solid ${props => props.selected ? '#72c8fa' : '#ddd'};
  border-radius: 10px;
  box-shadow: ${props => props.selected ? '0px 0px 5px rgba(114, 200, 250, 0.6)' : 'rgba(0, 0, 0, 0.05) 2px 1px 1px'};
  min-height: 250px;
  height: ${props => props.nbOutput * 30 + 100}px;
  width: ${props => props.collapsed ? 'auto' : '150px'};
  transition: all 0.3s ease-in-out;
`;

const ForceNbOutputInput = styled.input`
  margin-top: 10px;
  width: 50%;
  padding: 4px;
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.nodeInputBg};
  padding: 5px;
  border-radius: 5px;
`;

export default AIDataSplitterNode;