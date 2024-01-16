import React, { useContext, useEffect, useState } from 'react';
import { Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { generateIdForHandle } from '../../utils/flowUtils';
import { InputHandle, NodeTitle, OutputHandle } from './Node.styles';
import { NodeContext } from '../../providers/NodeProvider';
import { useIsPlaying } from '../../hooks/useIsPlaying';
import NodePlayButton from './node-button/NodePlayButton';

interface TransitionNodeData {
    id: string;
    name: string;
    processorType: string;
    nbOutput: number;
    input: string;
    input_key: string;
    outputData?: string[];
    lastRun: string;
}

interface TransitionNodeProps extends NodeProps {
    data: TransitionNodeData;
}

const TransitionNode: React.FC<TransitionNodeProps> = React.memo(({ data, id, selected }) => {


    const { isRunning } = useContext(NodeContext);
    const [nodeId, setNodeId] = useState<string>(`${data.name}-${Date.now()}`);
    const [isPlaying, setIsPlaying] = useIsPlaying();
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        console.log("has been run")
        setNodeId(`${data.name}-${Date.now()}`);
        setIsPlaying(false);
        updateNodeInternals(id);
    }, [data.lastRun]);

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    return (
        <div key={id} className='flex flex-col justify-between items-center 
                    bg-gray-800 text-white 
                    shadow-lg rounded-lg p-4 
                    border border-green-500 hover:bg-gray-700 
                    transition duration-300 ease-in-out'>
            <InputHandle className="handle" type="target" position={Position.Left} />
            <NodePlayButton isPlaying={isPlaying} hasRun={!!data.lastRun} onClick={handlePlayClick} nodeName={data.name} />
            <OutputHandle
                key={generateIdForHandle(0, true)}
                type="source"
                id={generateIdForHandle(0, true)}
                position={Position.Right}
            />
        </div>
    );
});
export default TransitionNode;