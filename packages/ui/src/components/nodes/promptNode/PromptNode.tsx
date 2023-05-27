import React, { useState, useRef, useEffect, useContext } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { FaPlay, FaRobot, FaUserCircle } from 'react-icons/fa';
import { NodeResizer } from '@reactflow/node-resizer';
import MarkdownOutput from '../../tools/markdownOutput/MarkdownOutput';
import { NodeBand, NodeContainer, NodeContent, NodeForm, NodeHeader, NodeIcon, NodeLabel, NodeLogs, NodeLogsText, NodeTextarea, NodeTitle } from '../../shared/Node.styles';
import NodePlayButton from '../../tools/NodePlayButton';
import { NodeContext } from '../../providers/NodeProvider';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { generateIdForHandle } from '../../../utils/flowUtils';

interface PromptNodeData {
  inputText: string;
}

const PromptNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  
  const { hasParent, showOnlyOutput } = useContext(NodeContext);

  const updateNodeInternals = useUpdateNodeInternals();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [nodeData, setNodeData] = useState<PromptNodeData>({
    inputText: data.inputText || '',
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

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <NodeContainer key={nodeId}>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} />
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <Handle className="handle" type="target" id={generateIdForHandle(0)} position={Position.Top} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
        <NodeIcon><FaUserCircle /></NodeIcon>
        <NodeTitle>Prompt</NodeTitle>
        <Handle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
        <NodePlayButton isPlaying={isPlaying} onClick={handlePlayClick} nodeName={data.name}/>
      </NodeHeader>
      <NodeBand/>
      {collapsed && (
        <NodeContent>
          <NodeForm>
            <NodeLabel>Prompt:</NodeLabel>
            <NodeTextarea
              name="inputText"
              className="nodrag"
              value={nodeData.inputText}
              onChange={handleNodeDataChange}
            />
          </NodeForm>
        </NodeContent>
      )}
      <NodeLogs
        showLogs={showLogs}
        onClick={() => setShowLogs(!showLogs)}
      >
        {!showLogs ? <NodeLogsText>Click to show output</NodeLogsText> : <MarkdownOutput data={data.output_data} />}
      </NodeLogs>
    </NodeContainer>
  );
};

export default PromptNode;