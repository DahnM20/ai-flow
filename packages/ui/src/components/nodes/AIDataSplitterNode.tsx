import React, { useContext, useEffect, useState } from 'react';
import { Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { NodeContext } from '../providers/NodeProvider';
import NodePlayButton from '../shared/nodes-parts/NodePlayButton';
import { generateIdForHandle } from '../../utils/flowUtils';
import { InputHandle, NodeTitle, OutputHandle } from '../shared/Node.styles';
import { useIsPlaying } from '../../hooks/useIsPlaying';

interface AIDataSplitterNodeData {
  id: string;
  name: string;
  processorType: string;
  nbOutput: number;
  input: string;
  input_key: string;
  outputData?: string[];
  lastRun: string;
}

interface AIDataSplitterNodeProps extends NodeProps {
  data: AIDataSplitterNodeData;
}

const AIDataSplitterNode: React.FC<AIDataSplitterNodeProps> = React.memo(({ data, id, selected }) => {

  const updateNodeInternals = useUpdateNodeInternals();

  const [isPlaying, setIsPlaying] = useIsPlaying();
  const [collapsed, setCollapsed] = useState(false);

  const { onUpdateNodeData } = useContext(NodeContext);

  useEffect(() => {
    const newNbOutput = data.outputData ? data.outputData.length : 0;
    if (!data.nbOutput || newNbOutput > data.nbOutput) {
      onUpdateNodeData(id, {
        ...data,
        nbOutput: newNbOutput,
      });
    }
    setIsPlaying(false);
  }, [data.outputData]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [data.nbOutput])

  const handlePlayClick = () => {
    setIsPlaying(true);
  };


  const handleCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  const handleForceNbOutputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const forcedNbOutput = Number(event.target.value);

    onUpdateNodeData(id, {
      ...data,
      nbOutput: forcedNbOutput,
    });
  };

  return (
    <DataSplitterNodeContainer selected={selected} nbOutput={data.nbOutput} collapsed={collapsed} key={id} onDoubleClick={handleCollapseClick}>
      {!collapsed
        && <NodeTitle>AI Splitter</NodeTitle>
      }
      <NodePlayButton isPlaying={isPlaying} nodeName={data.name} onClick={handlePlayClick} />
      {!collapsed && (
        <ForceNbOutputInput
          id="nbOutput"
          value={data.nbOutput}
          onChange={handleForceNbOutputChange}
        />
      )}
      <InputHandle className="handle" type="target" position={Position.Left} />
      <div className="output-strip-node-outputs">
        {data.nbOutput && Array.from(Array(data.nbOutput)).map((_, index) => (
          <OutputHandle
            key={generateIdForHandle(index, true)}
            data-tooltip-id={`${id}-tooltip`}
            data-tooltip-content={data.outputData ? data.outputData[index] : ''}
            type="source"
            id={generateIdForHandle(index, true)}
            position={Position.Right}
            style={{
              background: data?.outputData ? (data.outputData[index] ? 'rgb(224, 166, 79)' : '#ddd') : '#ddd',
              top: `${data.nbOutput === 1 ? 50 : (index / (data.nbOutput - 1)) * 80 + 10}%`
            }}
          />
        ))}
        <Tooltip id={`${id}-tooltip`} style={{ zIndex: 100 }} />
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
  width: ${props => props.collapsed ? 'auto' : '120px'};
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