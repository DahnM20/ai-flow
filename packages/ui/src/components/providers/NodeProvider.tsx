import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { nodesTopologicalSort, convertFlowToJson } from '../../utils/flowUtils';
import { SocketContext } from './SocketProvider';
import { toastInfoMessage } from '../../utils/toastUtils';
import { useTranslation } from 'react-i18next';

interface NodeContextType {
    runNode: (nodeName: string) => boolean;
    hasParent: (id: string) => boolean;
    getEdgeIndex: (id: string) => Edge | undefined;
    showOnlyOutput?: boolean;
    isRunning: boolean;
    currentNodeRunning: string;
    errorCount: number;
}


export const NodeContext = createContext<NodeContextType>({
    runNode: () => (false),
    hasParent: () => (false),
    getEdgeIndex: () => (undefined),
    showOnlyOutput: false,
    isRunning: false,
    currentNodeRunning: '',
    errorCount: 0,
});

export const NodeProvider = ({ nodes, edges, showOnlyOutput, isRunning, currentNodeRunning, errorCount, children }: { nodes: Node[]; edges: Edge[]; showOnlyOutput?: boolean; isRunning: boolean; currentNodeRunning: string; errorCount: number; children: ReactNode }) => {

    const { t } = useTranslation('flow');
    const { socket, config, verifyConfiguration } = useContext(SocketContext);

    const runNode = (name: string) => {

        if(!verifyConfiguration()){
            toastInfoMessage(t('ApiKeyRequiredMessage'));
            return false;
        }

        console.log('runNode ' + name)
        const nodesSorted = nodesTopologicalSort(nodes, edges);
        const flowFile = convertFlowToJson(nodesSorted, edges, true);
        socket?.emit('run_node',
            {
                json_file: JSON.stringify(flowFile),
                node_name: name,
                openai_api_key: config?.openai_api_key,
                leonardo_api_key: config?.leonardo_api_key,
            });
        console.log(nodes)
        
        return true;
    };

    const hasParent = (id: string) => {
        return !!edges.find(edge => edge.target === id)
    }

    const getEdgeIndex = (id: string) => {
        return edges.find(edge => edge.target === id)
    }

    return (
        <NodeContext.Provider value={{ runNode, hasParent, getEdgeIndex, showOnlyOutput, isRunning, currentNodeRunning, errorCount, }}>
            {children}
        </NodeContext.Provider>
    );
};