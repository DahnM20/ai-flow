import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { FaRobot, FaUserCircle } from 'react-icons/fa';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, OptionButton, OptionSelector, NodeBand } from '../../shared/Node.styles';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { useTranslation } from 'react-i18next';
import { generateIdForHandle } from '../../../utils/flowUtils';

interface ProcessorNodeState {
  gptVersion: string;
}

const ProcessorNode: React.FC<NodeProps> = React.memo(({ data, id, selected }) => {
  const { t } = useTranslation('flow');

  const updateNodeInternals = useUpdateNodeInternals();

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [nodeState, setNodeState] = useState<ProcessorNodeState>({
    gptVersion: data.gptVersion || 'gpt-4',
  });
  const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);

  useEffect(() => {
    (Object.keys(nodeState) as (keyof ProcessorNodeState)[]).forEach((key) => {
      data[key] = nodeState[key];
    });
  }
  , [nodeState]);

  useEffect(() => {
    setNodeId(`${data.id}-${Date.now()}`);
    updateNodeInternals(id);
  }, [data.output_data]);

  useRefreshOnAppearanceChange(updateNodeInternals, id, [collapsed]);
  useHandleShowOutput({ 
    id: id, 
    setCollapsed: setCollapsed, 
    updateNodeInternals: updateNodeInternals
  });

  const handleNodeStateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNodeState({
      ...nodeState,
      [event.target.name]: event.target.value,
    });
    data[event.target.name] = event.target.value;
    updateNodeInternals(id);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  function setVersion(version: string) {
    setNodeState({
      ...nodeState,
      gptVersion: version,
    })
    data["gptVersion"] = version;
    updateNodeInternals(id);
  }

  return (
    <NodeContainer key={nodeId}>
      <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} />
      <NodeHeader onDoubleClick={toggleCollapsed}>
        <Handle className="handle" type="target" id={generateIdForHandle(0)} position={Position.Top} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
        <NodeIcon><FaRobot /></NodeIcon>
        <NodeTitle>{data.name}</NodeTitle>
        <Handle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
      </NodeHeader>
      <NodeBand/>
      {collapsed && (
        <NodeContent>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px'  }}>
          <OptionSelector>
            <OptionButton selected={nodeState.gptVersion === "gpt-3.5"} onClick={() => setVersion("gpt-3.5")}>GPT3.5</OptionButton>
            <OptionButton selected={nodeState.gptVersion === "gpt-4"} onClick={() => setVersion("gpt-4")}>GPT4</OptionButton>
          </OptionSelector>
          </div>
          <NodeForm>
            <NodeLabel>{t('RoleInitPrompt')}</NodeLabel>
            <NodeTextarea
              className="nodrag"
              name="initData"
              value={data.initData}
              onChange={handleNodeStateChange}
            />
          </NodeForm>
        </NodeContent>
      )}
    </NodeContainer>
  );
});

export default ProcessorNode;