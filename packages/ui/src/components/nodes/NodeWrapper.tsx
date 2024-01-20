import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { NodeContext } from '../../providers/NodeProvider';

type NodeWrapperProps = {
    children: React.ReactNode;
    nodeId: string;
};

function NodeWrapper({ children, nodeId }: NodeWrapperProps) {
    const [showIcon, setShowIcon] = useState(false);
    const { onUpdateNodes, nodes, edges } = useContext(NodeContext);

    const currentNode = nodes.find((node) => node.id === nodeId);
    const currentNodeIsMissingFields = currentNode?.data?.missingFields?.length > 0

    let hideIconTimeout: ReturnType<typeof setTimeout>;


    const showIconWithDelay = () => {
        setShowIcon(true);
    };

    const hideIconWithDelay = () => {
        hideIconTimeout = setTimeout(() => setShowIcon(false), 500);
    };

    const clearHideIconTimeout = () => {
        if (hideIconTimeout) {
            clearTimeout(hideIconTimeout);
        }
    };


    function handleRemoveNode(nodeId: string): void {
        const nodesUpdated = nodes.filter((node) => node.id !== nodeId);
        const edgesUpdated = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        onUpdateNodes(nodesUpdated, edgesUpdated);
    }

    return (
        <div className={`relative group ${currentNodeIsMissingFields ? "border-red-500/80 rounded-lg border-2" : ""}`}
            onClick={showIconWithDelay}
            onMouseLeave={hideIconWithDelay}>
            {children}
            <span
                className="absolute top-0 right-1/2 -translate-y-14 translate-x-1/2 cursor-pointer 
                        text-stone-100 text-xl
                        hover:text-red-400
                        bg-slate-200/10
                        hover:bg-slate-200/20
                        rounded-full
                        p-2
                        "
                onClick={() => handleRemoveNode(nodeId)}
                onMouseEnter={clearHideIconTimeout}
                onMouseLeave={hideIconWithDelay}
                style={{ display: showIcon ? 'block' : 'none' }}
            >
                <AiOutlineClose />
            </span>
        </div>
    );
};

export default NodeWrapper;