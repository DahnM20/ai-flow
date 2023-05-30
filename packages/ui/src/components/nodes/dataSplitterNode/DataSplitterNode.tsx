import React, { useContext, useEffect, useState } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import styled from 'styled-components';
import ReactTooltip, { Tooltip } from 'react-tooltip';
import { NodeContext } from '../../providers/NodeProvider';
import NodePlayButton from '../../tools/NodePlayButton';
import { generateIdForHandle } from '../../../utils/flowUtils';
import { NodeTitle } from '../../shared/Node.styles';

interface DataSplitterNodeData {
  splitChar: string;
  id: string;
  name: string;
  processorType: string;
  nbOutput: number;
  input: string;
  input_key: string;
  output_data?: string[];
}

interface DataSplitterNodeProps extends NodeProps {
  data: DataSplitterNodeData;
}

const DataSplitterNode: React.FC<DataSplitterNodeProps> = React.memo(({ data, id, selected }) => {

  const { hasParent, showOnlyOutput } = useContext(NodeContext);

  const updateNodeInternals = useUpdateNodeInternals();


  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [nbOutput, setNbOutput] = useState<number>(!!data.nbOutput ? data.nbOutput : 0);
  const [splitChar, setSplitChar] = useState<string>("\n");
  const [customSplitChar, setCustomSplitChar] = useState<string>("");
  const [isCustomSplit, setIsCustomSplit] = useState<boolean>(false);


  useEffect(() => {
    setNodeId(`${data.id}-${Date.now()}`);
    setIsPlaying(false);
    setNbOutput(data.output_data ? data.output_data.length : 0);
    updateNodeInternals(id);
  }, [data.output_data]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleSplitCharChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "custom") {
      setIsCustomSplit(true);
    } else {
      setIsCustomSplit(false);
      setSplitChar(event.target.value);
      data.splitChar = event.target.value;
    }
  };

  const handleCustomSplitCharChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSplitChar(event.target.value);
    setSplitChar(event.target.value);
    data.splitChar = event.target.value;
  };

  const handleForceNbOutputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNbOutput(Number(event.target.value));
  };


  return (
    <DataSplitterNodeContainer selected={selected} nbOutput={nbOutput} key={nodeId}>
      <NodeTitle>Splitter</NodeTitle>
      <NodePlayButton isPlaying={isPlaying} nodeName={data.name} onClick={handlePlayClick} />
      <SplitCharSelect value={splitChar} onChange={handleSplitCharChange}>
        <option value="\n">\n</option>
        <option value=";">;</option>
        <option value=",">,</option>
        <option value="custom">Personnalisé...</option>
      </SplitCharSelect>
      {isCustomSplit && (
        <CustomSplitCharInput value={customSplitChar} onChange={handleCustomSplitCharChange} placeholder="Entrez caractère" />
      )}
      <ForceNbOutputInput
        id="forceNbOutput"
        value={nbOutput}
        onChange={handleForceNbOutputChange}
      />
      <Handle className="handle" type="target" position={Position.Left} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
      <div className="output-strip-node-outputs">
        {Array.from(Array(nbOutput)).map((_, index) => (
            <Handle
              key={generateIdForHandle(index)}
              data-tooltip-id={`${nodeId}-tooltip`}
              data-tooltip-content={data.output_data ? data.output_data[index] : ''}
              type="source"
              id={generateIdForHandle(index)}
              position={Position.Right}
              style={{
                background: data?.output_data ? (data.output_data[index] ? 'rgb(224, 166, 79)' : '#ddd') : '#ddd',
                top: `${nbOutput === 1 ? 50 : (index / (nbOutput - 1)) * 80 + 10}%`, // calculate the top position based on the index
                width: '10px',
                height: '10px',
                borderRadius: '0',
              }}
            />
        ))}
        <Tooltip id={`${nodeId}-tooltip`} style={{zIndex: 100}}/>
      </div>
    </DataSplitterNodeContainer>
  );
});

const DataSplitterNodeContainer = styled.div<{ selected: boolean, nbOutput: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
  padding: 10px;
  border: 2px solid ${props => props.selected ? '#72c8fa' : '#ddd'};
  border-radius: 10px;
  box-shadow: ${props => props.selected ? '0px 0px 15px rgba(114, 200, 250, 0.6)' : '5px 5px 10px rgba(0, 0, 0, 0.2)'};
  height: ${props => props.nbOutput * 30 + 100}px;
  width: 150px;
  transition: all 0.3s ease-in-out;
`;

const ForceNbOutputInput = styled.input`
  margin-top: 10px;
  width: 100%;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;


const SplitCharSelect = styled.select`
  margin-top: 10px;
  width: 50%;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 0.9em;
  color: #333;
  background-color: #e8e8e8;
`;

const CustomSplitCharInput = styled.input`
  margin-top: 10px;
  width: 50%;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 0.9em;
  color: #333;
  background-color: #e8e8e8;
`;

export default DataSplitterNode;