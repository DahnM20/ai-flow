import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import styled from 'styled-components';
import { NodeContext } from '../providers/NodeProvider';
import NodePlayButton from '../shared/nodes-parts/NodePlayButton';
import { generateIdForHandle } from '../../utils/flowUtils';
import { InputHandle, NodeBand, NodeLogs, NodeLogsText, NodeTitle, OutputHandle } from '../shared/Node.styles';
import { useIsPlaying } from '../../hooks/useIsPlaying';
import { FaRobot } from 'react-icons/fa';
import { GenericNodeData } from '../../types/node';
import HandleWrapper from '../handles/HandleWrapper';
import { t } from 'i18next';
import MarkdownOutput from '../shared/nodes-parts/MarkdownOutput';
import { Popover } from '@headlessui/react'
import { actions } from "../../nodesConfiguration/data/aiAction";

interface AIActionNodeData extends GenericNodeData {
    inputText: string;
    actionName: string;
}

interface AIActionNodeProps extends NodeProps {
    data: AIActionNodeData;
}

const AIActionNode: React.FC<AIActionNodeProps> = React.memo(({ data, id, selected }) => {

    const updateNodeInternals = useUpdateNodeInternals();

    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [collapsed, setCollapsed] = useState(false);
    const [showLogs, setShowLogs] = useState<boolean>(false);

    const inputHandleId = useMemo(() => generateIdForHandle(0), []);
    const outputHandleId = useMemo(() => generateIdForHandle(0), []);


    const { onUpdateNodeData } = useContext(NodeContext);

    useEffect(() => {
        onUpdateNodeData(id, {
            ...data,
        });
        setIsPlaying(false);
    }, [data.outputData]);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };


    const handleCollapseClick = () => {
        setCollapsed(!collapsed);
    };

    const handleChangeHandlePosition = (newPosition: Position, handleId: string) => {
        onUpdateNodeData(id, {
            ...data,
            handles: {
                ...data.handles,
                [handleId]: newPosition
            }
        });
        updateNodeInternals(id);
    }

    const handleActionClick = (actionName: string, prompt: string) => {
        onUpdateNodeData(id, {
            ...data,
            inputText: prompt,
            actionName: actionName,
        });
    }

    const outputData = !!data.outputData
        ? typeof (data.outputData) === "string"
            ? data.outputData
            : data.outputData[0]
        : ""

    return (
        <AIActionNodeContainer
            className='flex flex-col items-center w-72 justify-center h-auto text-slate-300 rounded-md shadow-md'
            selected={selected}
            collapsed={collapsed}
            key={id}
            onDoubleClick={handleCollapseClick}>

            <HandleWrapper id={inputHandleId} position={
                !!data?.handles && data.handles[inputHandleId]
                    ? data.handles[inputHandleId]
                    : Position.Top}
                onChangeHandlePosition={handleChangeHandlePosition} />

            <NodeBand className='w-full rounded-t-md h-2 mb-2' />

            <Popover className="relative">
                <Popover.Button><FaRobot className='text-6xl hover:text-sky-200 hover:animate-pulse cursor-pointer' /></Popover.Button>
                <Popover.Overlay className="fixed inset-0 bg-black opacity-30" />
                <Popover.Panel className="absolute bg-slate-800  text-slate-200 px-2 py-2 z-50">
                    <div className="grid grid-row-4">
                        {actions.map(action => (
                            <div key={action.name}
                                onClick={() => handleActionClick(action.name, action.prompt)}
                                className="cursor-pointer hover:bg-slate-600 p-2 rounded w-64">
                                {action.name}
                            </div>
                        ))}
                    </div>
                </Popover.Panel>
            </Popover>

            <div className='text-2xl font-bold text-center items-center mx-auto py-2 px-2'> {data.actionName} </div>

            <div className='mb-5' >
                <NodePlayButton isPlaying={isPlaying} nodeName={data.name} onClick={handlePlayClick} />
            </div>


            <HandleWrapper id={outputHandleId} position={
                !!data?.handles && data.handles[outputHandleId]
                    ? data.handles[outputHandleId]
                    : Position.Bottom}
                onChangeHandlePosition={handleChangeHandlePosition}
                isOutput />
            {
                !!data.outputData
                && <NodeLogs
                    className='w-full border-t-2 border-t-slate-800'
                    showLogs={showLogs}
                    onClick={() => setShowLogs(!showLogs)}>
                    {
                        !showLogs
                            ? <NodeLogsText className='text-center'>{t('ClickToShowOutput')}</NodeLogsText>
                            : <MarkdownOutput data={outputData} />
                    }
                </NodeLogs>
            }

        </AIActionNodeContainer>
    );
});

const AIActionNodeContainer = styled.div<{ selected: boolean, collapsed: boolean }>`
  background-color: ${({ theme }) => theme.nodeBg};
  transition: all 0.3s ease-in-out;
`;

export default AIActionNode;