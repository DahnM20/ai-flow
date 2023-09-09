import React, { memo } from 'react';
import { Edge, Node } from 'reactflow';
import { convertFlowToJson, nodesTopologicalSort } from '../../utils/flowUtils';
import styled from 'styled-components';
import ImageUrlOutput from '../shared/nodes-parts/ImageUrlOutput';
import { NodeData } from '../../types/node';
import MarkdownOutput from '../shared/nodes-parts/MarkdownOutput';

interface TopologicalViewProps {
    nodes: Node[];
    edges: Edge[];
}

const TopologicalView: React.FC<TopologicalViewProps> = ({ nodes, edges }) => {

    nodes = nodesTopologicalSort(nodes, edges);
    const data: NodeData[] = convertFlowToJson(nodes, edges, false);

    const handleDownloadClick = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
    };

    const focusToNode = (node: any) => () => {
        // TODO 
        //setCenter(node.x, node.y);
    }


    function getOutputDataComponent(item: NodeData): React.ReactNode {
        if (!item.output_data) return <></>

        if (item.processorType === "stable-diffusion-stabilityai-prompt" || item.processorType === "dalle-prompt") {
            return <ImageUrlOutput url={item.output_data[0]} name={item.name} />
        } else {
            if (typeof item.output_data === "string") {
                return <NodeViewTextData data={item.output_data} />
            }
        }
    }


    return (
        <TopologicalViewContainer>
            {
                data.map((item, index) => {
                    if (!item.output_data) return undefined;
                    return <TopologicalViewContent onClick={focusToNode(item)}>
                        <TopologicalViewNodeName>{item.name}</TopologicalViewNodeName>
                        {getOutputDataComponent(item)}
                    </TopologicalViewContent>
                })
            }
        </TopologicalViewContainer>
    );

};

const TopologicalViewContainer = styled.div`
    padding: 20px;
`;

const TopologicalViewNodeName = styled.div`
    font-size: 0.8em;
    margin-bottom: 10px;
    padding-left: 5%;
    background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) left / 2% no-repeat;
`;

const TopologicalViewContent = styled.div`
    white-space: pre-wrap;
    padding: 10px;
    margin-top: 10px;
    background-color : ${({ theme }) => theme.nodeInputBg};
`;

const NodeViewTextData = styled(MarkdownOutput)`
    padding: 3px;
`

function arePropsEqual(prevProps: TopologicalViewProps, nextProps: TopologicalViewProps) {
    const prevNodesOutput = prevProps.nodes.map(node => node.data.output_data);
    const nextNodesOutput = nextProps.nodes.map(node => node.data.output_data);

    if (prevNodesOutput.length != nextNodesOutput.length) return false;

    return prevNodesOutput.toString() === nextNodesOutput.toString()
}

export default memo(TopologicalView, arePropsEqual);
