import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { nodesTopologicalSort, convertFlowToJson } from '../../utils/flowUtils';
import { SocketContext } from './SocketProvider';

interface NodeContextType {
    runNode: (nodeName: string) => void;
    hasParent: (id: string) => boolean;
    getEdgeIndex: (id: string) => Edge | undefined;
    showOnlyOutput?: boolean;
    isRunning: boolean;
    currentNodeRunning: string;
}


export const NodeContext = createContext<NodeContextType>({ 
    runNode: () => { },
    hasParent: () =>  (false),
    getEdgeIndex: () =>  (undefined),
    showOnlyOutput: false,
    isRunning: false,
    currentNodeRunning: '',
});

export const NodeProvider = ({ nodes, edges, showOnlyOutput, isRunning,currentNodeRunning, children }: { nodes: Node[]; edges: Edge[]; showOnlyOutput?: boolean; isRunning: boolean; currentNodeRunning: string; children: ReactNode }) => {

    const { socket } = useContext(SocketContext);
    
    const runNode = (name: string) => {
        console.log('runNode ' + name)
        const nodesSorted = nodesTopologicalSort(nodes, edges);
        const flowFile = convertFlowToJson(nodesSorted, edges, true);
        socket?.emit('run_node', { json_file: JSON.stringify(flowFile), node_name: name });
        console.log(nodes)
    };

    const hasParent = (id: string) => {
        return !!edges.find(edge => edge.target === id)
    }

    const getEdgeIndex = (id: string) => {
        return edges.find(edge => edge.target === id)
    }

    return (
        <NodeContext.Provider value={{ runNode, hasParent, getEdgeIndex, showOnlyOutput, isRunning, currentNodeRunning }}>
            {children}
        </NodeContext.Provider>
    );
};