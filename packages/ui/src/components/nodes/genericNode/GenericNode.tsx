import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, NodeBand, NodeLogs, NodeLogsText, OptionButton, OptionSelector, NodeInput } from '../../shared/Node.styles';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { generateIdForHandle } from '../../../utils/flowUtils';
import { ICON_MAP } from '../../shared/NodeIcons';
import { Field } from '../../../nodesConfiguration/nodeConfig';
import MarkdownOutput from '../../tools/markdownOutput/MarkdownOutput';
import { NodeContext } from '../../providers/NodeProvider';
import NodePlayButton from '../../tools/NodePlayButton';
import { useTranslation } from 'react-i18next';

const GenericNode: React.FC<NodeProps> = React.memo(({ data, id, selected }) => {
    const { t } = useTranslation('flow');

    const { hasParent, showOnlyOutput } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [nodeData, setNodeData] = useState<any>(data);
    const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        setNodeId(`${data.id}-${Date.now()}`);
        setIsPlaying(false);
        updateNodeInternals(id);
    }, [data.lastRun]);

    useRefreshOnAppearanceChange(updateNodeInternals, id, [collapsed, showLogs]);
    
    useHandleShowOutput({
        showOnlyOutput,
        id: id,
        setCollapsed: setCollapsed,
        setShowLogs: setShowLogs,
        updateNodeInternals: updateNodeInternals
    });

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

    const handleOptionChange = (name: string, value: string) => {
        setNodeData({
            ...nodeData,
            [name]: value,
        });

        data[name] = value;
        updateNodeInternals(id);
    };

    const formFields = data.config.fields.map((field: Field) => {
        switch (field.type) {
            case 'input':
                return (
                    <>
                        <NodeLabel>{t(field.label)}</NodeLabel>
                        <NodeInput name={field.name} className="nodrag" value={nodeData[field.name]} onChange={handleNodeDataChange} />
                    </>
                );
            case 'textarea':
                return (
                    <>
                        <NodeLabel>{t(field.label)}</NodeLabel>
                        <NodeTextarea name={field.name} className="nodrag" value={nodeData[field.name]} onChange={handleNodeDataChange} />
                    </>
                );
            case 'option':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                            <OptionSelector>
                                {field.options?.map(option => (
                                    <OptionButton
                                        selected={nodeData[field.name] === option.value}
                                        onClick={() => handleOptionChange(field.name, option.value)}
                                    >
                                        {t(option.label)}
                                    </OptionButton>
                                ))}
                            </OptionSelector>
                        </div>
                    </>
                );
        }
    });

    const NodeIconComponent = ICON_MAP[data.config.icon];

    return (
        <NodeContainer key={nodeId}>
            <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} />
            <NodeHeader onDoubleClick={toggleCollapsed}>
                {
                    data.config.hasInputHandle &&
                    <Handle className="handle" type="target" id={generateIdForHandle(0)} position={Position.Top} style={{ background: '#72c8fa', width: '10px', height: '10px' }} />
                }
                <NodeIcon>{NodeIconComponent && <NodeIconComponent />}</NodeIcon>
                <NodeTitle>{data.config.nodeName}</NodeTitle>
                <Handle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} style={{ background: 'rgb(224, 166, 79)', width: '10px', height: '10px', borderRadius: '0' }} />
                <NodePlayButton isPlaying={isPlaying} hasRun={!!data.lastRun} onClick={handlePlayClick} nodeName={data.name} />
            </NodeHeader>
            <NodeBand />
            {collapsed && (
                <NodeContent>
                    <NodeForm>
                        {formFields}
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
});

export default GenericNode;