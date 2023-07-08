import React, { useState, useEffect, useContext, useRef } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, NodeBand, NodeLogs, NodeLogsText, OptionButton, OptionSelector, NodeInput, InputHandle, OutputHandle } from '../../shared/Node.styles';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { generateIdForHandle } from '../../../utils/flowUtils';
import { ICON_MAP } from '../../shared/NodeIcons';
import { Field } from '../../../nodesConfiguration/nodeConfig';
import MarkdownOutput from '../../tools/markdownOutput/MarkdownOutput';
import { NodeContext } from '../../providers/NodeProvider';
import NodePlayButton from '../../tools/NodePlayButton';
import { useTranslation } from 'react-i18next';
import { FiCopy } from 'react-icons/fi';
import styled from 'styled-components';
import { copyToClipboard } from '../../../utils/navigatorUtils';

const GenericNode: React.FC<NodeProps> = React.memo(({ data, id, selected }) => {
    const { t } = useTranslation('flow');

    const { hasParent, showOnlyOutput } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [nodeData, setNodeData] = useState<any>(data);
    const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setNodeId(`${data.id}-${Date.now()}`);
        setIsPlaying(false);
        updateNodeInternals(id);
    }, [data.lastRun]);

    useEffect(() => {
        if (textareaRef.current) {
            const newWidth = textareaRef.current.offsetWidth;
            const newHeight = textareaRef.current.offsetHeight;
            if (newWidth !== nodeData.width || newHeight !== nodeData.height) {
                updateNodeInternals(id);
            }
        }
    }, [nodeData, id]);

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


    function setDefaultOption(field: Field) {
        if (field.options) {
            const defaultOption = field.options.find(option => option.default);
            if (defaultOption) {
                nodeData[field.name] = defaultOption.value;
            }
        }
    }

    const formFields = data.config.fields.map((field: Field) => {
        switch (field.type) {
            case 'input':
                return (
                    <>
                        {
                            field.label &&
                            <NodeLabel>{t(field.label)}</NodeLabel>
                        }
                        <NodeInput name={field.name} className="nodrag" value={nodeData[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                    </>
                );
            case 'textarea':
                return (
                    <>
                        {
                            field.label &&
                            <NodeLabel>{t(field.label)}</NodeLabel>
                        }
                        <NodeTextarea ref={textareaRef} name={field.name} className="nodrag" value={nodeData[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                    </>
                );
            case 'option':
                if(!nodeData[field.name]) {
                    setDefaultOption(field);
                }
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
            {/* <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} maxWidth={700} onResizeEnd={handleResizeField}/> */}
            <NodeHeader onDoubleClick={toggleCollapsed}>
                {
                    data.config.hasInputHandle &&
                    <InputHandle className="handle" type="target" id={generateIdForHandle(0)} position={Position.Top}/>
                }
                <NodeIcon>{NodeIconComponent && <NodeIconComponent />}</NodeIcon>
                <NodeTitle>{t(data.config.nodeName)}</NodeTitle>
                <OutputHandle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} />
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
                {showLogs && !!data.output_data && <StyledCopyIcon className="copy-icon" onClick={(event) => {
                    event.stopPropagation();
                    copyToClipboard(data.output_data);
                }} />}
                {!showLogs ? <NodeLogsText>Click to show output</NodeLogsText> : <MarkdownOutput data={data.output_data} />}
            </NodeLogs>
        </NodeContainer>
    );
});

export default GenericNode;

const StyledCopyIcon = styled(FiCopy)`
  position: absolute;
  right: 10px;
  cursor: pointer;
  z-index: 1;
  `;

