import React, { useState, useEffect, useContext, useRef, memo } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeContainer, NodeHeader, NodeIcon, NodeTitle, NodeContent, NodeForm, NodeLabel, NodeTextarea, NodeBand, NodeLogs, NodeLogsText, OptionButton, OptionSelector, NodeInput, InputHandle, OutputHandle } from '../../shared/Node.styles';
import useHandleShowOutput from '../../../hooks/useHandleShowOutput';
import { useRefreshOnAppearanceChange } from '../../../hooks/useRefreshOnAppearanceChange';
import { generateIdForHandle } from '../../../utils/flowUtils';
import { ICON_MAP } from '../../shared/NodeIcons';
import { Field } from '../../../nodesConfiguration/nodeConfig';
import MarkdownOutput from '../../shared/nodes-parts/MarkdownOutput';
import { NodeContext } from '../../providers/NodeProvider';
import NodePlayButton from '../../shared/nodes-parts/NodePlayButton';
import { useTranslation } from 'react-i18next';
import { FiCopy } from 'react-icons/fi';
import styled from 'styled-components';
import { copyToClipboard } from '../../../utils/navigatorUtils';
import { useIsPlaying } from '../../../hooks/useIsPlaying';
import ImageUrlOutput from '../../shared/nodes-parts/ImageUrlOutput';
import ImageBase64Output from '../../shared/nodes-parts/ImageBase64Output';

interface GenericNodeProps {
    data: any;
    id: string;
    selected: boolean;
}


const GenericNode: React.FC<NodeProps> = React.memo(({ data, id, selected }) => {
    const { t } = useTranslation('flow');

    const { hasParent, showOnlyOutput, isRunning, onUpdateNodeData } = useContext(NodeContext);

    const updateNodeInternals = useUpdateNodeInternals();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [showLogs, setShowLogs] = useState<boolean>(false);
    const [nodeId, setNodeId] = useState<string>(`${data.id}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useIsPlaying();

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
            if (newWidth !== data.width || newHeight !== data.height) {
                updateNodeInternals(id);
            }
        }
    }, [data, id]);

    useRefreshOnAppearanceChange(updateNodeInternals, id, [collapsed, showLogs]);

    useHandleShowOutput({
        showOnlyOutput,
        id: id,
        setCollapsed: setCollapsed,
        setShowLogs: setShowLogs,
        updateNodeInternals: updateNodeInternals
    });

    const handleNodeDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onUpdateNodeData(id, {
            ...data,
            [event.target.name]: event.target.value,
        });
        updateNodeInternals(id);
    };

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handleOptionChange = (name: string, value: string) => {
        onUpdateNodeData(id, {
            ...data,
            [name]: value,
        });
        updateNodeInternals(id);
    };


    function setDefaultOption(field: Field) {
        if (field.options) {
            const defaultOption = field.options.find(option => option.default);
            if (defaultOption) {
                onUpdateNodeData(id, {
                    ...data,
                    [field.name]: defaultOption.value,
                });
            }
        }
    }

    const formFields = data.config.fields
        .filter((field: Field) => hasParent(id) && field.hideIfParent != null ? !field.hideIfParent : true)
        .map((field: Field) => {
            switch (field.type) {
                case 'input':
                    return (
                        <>
                            {
                                field.label &&
                                <NodeLabel>{t(field.label)}</NodeLabel>
                            }
                            <NodeInput name={field.name} className="nodrag" defaultValue={data[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                        </>
                    );
                case 'textarea':
                    return (
                        <>
                            {
                                field.label &&
                                <NodeLabel>{t(field.label)}</NodeLabel>
                            }
                            <NodeTextarea ref={textareaRef} name={field.name} className="nodrag" defaultValue={data[field.name]} placeholder={field.placeholder ? String(t(field.placeholder)) : ""} onChange={handleNodeDataChange} />
                        </>
                    );
                case 'option':
                    if (!data[field.name]) {
                        setDefaultOption(field);
                    }
                    return (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                                <OptionSelector>
                                    {field.options?.map(option => (
                                        <OptionButton
                                            selected={data[field.name] === option.value}
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

    const outputIsImage = (data.config.outputType === 'imageUrl' || data.config.outputType === 'imageBase64') && data.output_data;

    const hideNodeParams = (hasParent(id) && data.config.hideFieldsIfParent) || collapsed;

    const getOutputComponent = () => {
        if (!data.output_data) return <></>

        switch (data.config.outputType) {
            case 'imageUrl':
                return <ImageUrlOutput url={data.output_data} name={data.name} />
            case 'imageBase64':
                return <ImageBase64Output data={data.output_data} name={data.name} lastRun={data.lastRun} />
            default:
                return <MarkdownOutput data={data.output_data} />
        }
    }

    const handleCopyToClipboard = (event: any) => {
        event.stopPropagation();
        copyToClipboard(data.output_data);
    }

    const NodeIconComponent = ICON_MAP[data.config.icon];

    console.log('render node ', id)
    return (
        <NodeContainer key={nodeId}>
            {/* <NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={30} maxWidth={700} onResizeEnd={handleResizeField}/> */}
            <NodeHeader onDoubleClick={toggleCollapsed}>
                {
                    data.config.hasInputHandle &&
                    <InputHandle className="handle" type="target" id={generateIdForHandle(0)} position={Position.Top} />
                }
                <NodeIcon>{NodeIconComponent && <NodeIconComponent />}</NodeIcon>
                <NodeTitle>{t(data.config.nodeName)}</NodeTitle>
                <OutputHandle className="handle-out" type="source" id={generateIdForHandle(0)} position={Position.Bottom} />
                <NodePlayButton isPlaying={isPlaying} hasRun={!!data.lastRun} onClick={handlePlayClick} nodeName={data.name} />
            </NodeHeader>
            <NodeBand />
            {!hideNodeParams && (
                <NodeContent>
                    <NodeForm>
                        {formFields}
                    </NodeForm>
                </NodeContent>
            )}
            <NodeLogs
                showLogs={showLogs}
                noPadding={outputIsImage && showLogs}
                onClick={() => setShowLogs(!showLogs)}
            >
                {showLogs && data.output_data && !outputIsImage
                    && <StyledCopyIcon className="copy-icon" onClick={(event) => {
                        handleCopyToClipboard(event);
                    }} />}
                {!showLogs && data.output_data
                    ? <NodeLogsText>{t('ClickToShowOutput')}</NodeLogsText>
                    : getOutputComponent()}
            </NodeLogs>
        </NodeContainer>
    );
}, propsAreEqual);


function propsAreEqual(prevProps: GenericNodeProps, nextProps: GenericNodeProps) {
    if (prevProps.selected !== nextProps.selected || prevProps.id !== nextProps.id) {
        return false;
    }

    for (let key in prevProps.data) {
        if (key !== 'x' && key !== 'y' && prevProps.data[key] !== nextProps.data[key]) {
            return false;
        }
    }

    for (let key in nextProps.data) {
        if (key !== 'x' && key !== 'y' && nextProps.data[key] !== prevProps.data[key]) {
            return false;
        }
    }

    return true;
}


export default GenericNode;

const StyledCopyIcon = styled(FiCopy)`
  position: absolute;
  right: 10px;
  cursor: pointer;
  z-index: 1;
  `;

