import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, NodeLogs, NodeLogsText } from '../../shared/Node.styles';

interface LLMNodeData {
  name: string;
  processorType: string;
  initData: string;
  input: string;
  output: string;
  output_data?: string,
  onDelete?: (id: string) => void;
}

const LLMNode: React.FC<NodeProps> = React.memo(({ data, id, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const [collapsed, setCollapsed] = useState<boolean>(true);

  const [nodeData, setNodeData] = useState<LLMNodeData>({
    name: data.name || '',
    processorType: data.processorType || '',
    initData: data.initData || '',
    input: data.input || '',
    output: data.output || '',
    output_data: data.output_data || '',
  });
  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);

  useEffect(() => {
    setNodeId(`${data.id}-${Date.now()}`);
    updateNodeInternals(id);
  }, [data.output_data]);

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

  return (
    <NodeContainer key={nodeId}>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} />
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <Handle className="handle" type="target" position={Position.Top} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
        <NodeIcon><FaRobot /></NodeIcon>
        <NodeTitle>{"LLLM - " + nodeData.name}</NodeTitle>
        {/* <FiX className="processor-node-delete-icon" onClick={handleDelete} /> */}
        <Handle className="handle-out" type="source" id="output-a" position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
      </NodeHeader>
      {collapsed && (
        <NodeContent>
          <NodeForm>
            <NodeLabel>Role init prompt:</NodeLabel>
            <NodeTextarea
              className="processor-node-textarea nodrag"
              name="initData"
              value={nodeData.initData}
              onChange={handleNodeDataChange}
            />
          </NodeForm>
        </NodeContent>
      )}
    </NodeContainer>
  );
});

export default LLMNode;