import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { NodeResizer } from '@reactflow/node-resizer';
import MarkdownOutput from '../../tools/markdownOutput/MarkdownOutput';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, NodeLogs, NodeLogsText, NodeBand } from '../../shared/Node.styles';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { useTranslation } from 'react-i18next';
import { generateIdForHandle } from '../../../utils/flowUtils';
import NodeOutput from '../../shared/NodeOutput';

interface InputNodeData {
  inputText: string;
}

const InputNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const { t } = useTranslation('flow');

  const updateNodeInternals = useUpdateNodeInternals();

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [nodeData, setNodeData] = useState<InputNodeData>({
    inputText: data.inputText,
  });
  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);

  useRefreshOnAppearanceChange(updateNodeInternals, id, [showLogs, collapsed]);
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

  const toggleShowLogs = () => {
    setShowLogs(!showLogs);
  };

  return (
    <NodeContainer key={nodeId}>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} />
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <NodeIcon><FaUserCircle /></NodeIcon>
        <NodeTitle>{data.name}</NodeTitle>
        <Handle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
      </NodeHeader>
      <NodeBand/>
      {collapsed && (
        <NodeContent>
          <NodeForm>
                <NodeLabel>{t('Input')}</NodeLabel>
                <NodeTextarea
                  name="inputText"
                  className="nodrag"
                  value={nodeData.inputText}
                  onChange={handleNodeDataChange}
                />
          </NodeForm>
        </NodeContent>
      )}
      <NodeOutput output_data={data.output_data} />
    </NodeContainer>
  );
};

export default InputNode;