import { Popover } from '@headlessui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCogs, FaRobot } from 'react-icons/fa';
import { NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import styled from 'styled-components';
import useHandlePositions from '../../hooks/useHandlePositions';
import useHandleShowOutput from '../../hooks/useHandleShowOutput';
import { useIsPlaying } from '../../hooks/useIsPlaying';
import { useRefreshOnAppearanceChange } from '../../hooks/useRefreshOnAppearanceChange';
import { actions } from "../../nodes-configuration/data/aiAction";
import { GenericNodeData } from '../../types/node';
import { generateIdForHandle } from '../../utils/flowUtils';
import HandleWrapper from '../handles/HandleWrapper';
import { NodeContext } from '../../providers/NodeProvider';
import { NodeBand, NodeLogs, NodeLogsText } from '../shared/Node.styles';
import MarkdownOutput from '../shared/node-output/MarkdownOutput';
import NodePlayButton from '../shared/node-button/NodePlayButton';

interface AIActionNodeData extends GenericNodeData {
    inputText: string;
    actionName: string;
}

interface AIActionNodeProps extends NodeProps {
    data: AIActionNodeData;
}

const AIActionNode: React.FC<AIActionNodeProps> = React.memo(({ data, id, selected }) => {

    const NB_INPUT_HANDLE = 1;
    const updateNodeInternals = useUpdateNodeInternals();
    const { t } = useTranslation('aiActions');

    const [isPlaying, setIsPlaying] = useIsPlaying();
    const [collapsed, setCollapsed] = useState(false);
    const [showLogs, setShowLogs] = useState<boolean>(true);

    const inputHandleId = useMemo(() => generateIdForHandle(0), []);
    const outputHandleId = useMemo(() => generateIdForHandle(0, true), []);

    const allActions = useMemo(() => {
        const savedCustomActions = localStorage.getItem('customActions');
        const customActions = savedCustomActions ? JSON.parse(savedCustomActions) : [];
        const allActions = [...actions, ...customActions];
        return allActions;
    }, [])



    const { showOnlyOutput, isRunning, onUpdateNodeData } = useContext(NodeContext);
    const { allHandlePositions } = useHandlePositions(data, NB_INPUT_HANDLE, outputHandleId);

    useRefreshOnAppearanceChange(updateNodeInternals, id, [collapsed, showLogs]);

    useHandleShowOutput({
        showOnlyOutput,
        id: id,
        setCollapsed: setCollapsed,
        setShowLogs: setShowLogs,
        updateNodeInternals: updateNodeInternals
    });

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
            prompt,
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
            className='flex flex-col items-center w-96 justify-center h-auto text-slate-300 rounded-md shadow-sm shadow-black/80'
            selected={selected}
            collapsed={collapsed}
            key={id}
            onDoubleClick={handleCollapseClick}>

            <HandleWrapper id={inputHandleId} position={
                !!data?.handles && data.handles[inputHandleId]
                    ? data.handles[inputHandleId]
                    : Position.Left}
                linkedHandlePositions={allHandlePositions}
                onChangeHandlePosition={handleChangeHandlePosition} />

            <div className='flex flex-row justify-between items-center w-full px-2' >
                <Popover className="relative">
                    <Popover.Button className={`text-3xl hover:text-sky-200 hover:animate-pulse cursor-pointer py-1 ${!data.actionName ? '' : ''}`} >
                        {
                            !data.actionName
                                ? <>
                                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-yellow-400 opacity-75 ml-4 animate-ping"></span>
                                    <span className="absolute inline-flex rounded-full h-2 w-2 bg-yellow-300 ml-4"></span>
                                    <FaCogs />
                                </>
                                : <FaRobot />
                        }
                    </Popover.Button>
                    <Popover.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <Popover.Panel className="absolute bg-slate-800  text-slate-200 px-2 py-2 z-50">
                        <div className="grid grid-row-4">
                            {allActions.map(action => (
                                <div key={action.name}
                                    onClick={() => handleActionClick(action.name, action.prompt)}
                                    className="cursor-pointer hover:bg-slate-600 p-2 rounded w-64">
                                    {t(action.name)}
                                </div>
                            ))}
                        </div>
                    </Popover.Panel>
                </Popover>

                <div className='text-lg font-bold text-center items-center mx-auto py-2 px-2'> {t(data.actionName)} </div>

                <div>
                    <NodePlayButton isPlaying={isPlaying} nodeName={data.name} onClick={handlePlayClick} />
                </div>
            </div>
            <NodeBand className='w-full h-1' />


            <HandleWrapper id={outputHandleId} position={
                !!data?.handles && data.handles[outputHandleId]
                    ? data.handles[outputHandleId]
                    : Position.Right}
                onChangeHandlePosition={handleChangeHandlePosition}
                linkedHandlePositions={allHandlePositions}
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