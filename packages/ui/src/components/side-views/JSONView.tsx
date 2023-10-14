import React, { useContext, memo } from 'react';
import { FiCrosshair, FiDownload, FiUpload } from 'react-icons/fi';
import { Edge, Node } from 'reactflow';
import { convertFlowToJson, convertJsonToFlow, nodesTopologicalSort } from '../../utils/flowUtils';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NodeContext } from '../providers/NodeProvider';
import { FaExclamationTriangle } from 'react-icons/fa';

interface JSONViewProps {
    nodes: Node[];
    edges: Edge[];
    withCoordinates: boolean;
    onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const JSONView: React.FC<JSONViewProps> = ({ nodes, edges, withCoordinates, onChangeFlow }) => {

    const { t } = useTranslation('flow');
    const { onUpdateNodes } = useContext(NodeContext);

    nodes = nodesTopologicalSort(nodes, edges);
    const data = convertFlowToJson(nodes, edges, withCoordinates);


    const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = () => {
            const file = input.files?.[0];

            if (file) {
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = (evt) => {
                    if (evt.target) {
                        const flow = evt.target.result as string;
                        const { nodes, edges } = convertJsonToFlow(JSON.parse(flow));
                        onChangeFlow(nodes, edges);
                    }
                };
            }
        };

        input.click();
    };

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

    const handleDeleteOutput = () => {
        const nodeUpdated = nodes.map(node => {
            node.data.outputData = undefined;
            node.data.lastRun = undefined;
            return node;
        });
        onUpdateNodes(nodeUpdated, edges);
    }

    const handleDeleteAll = () => {
        onUpdateNodes([], []);
    }

    return (
        <JSONViewContainer>
            <JSONViewButtons>
                <JSONViewButton onClick={handleUploadClick}>
                    <FiUpload />
                    {t('Upload')}
                </JSONViewButton>
                <JSONViewButton onClick={handleDownloadClick}>
                    <FiDownload />
                    {t('Download')}
                </JSONViewButton>
                <JSONViewButton onClick={handleDeleteOutput} dangerous>
                    <FiCrosshair />
                    {t('Delete Output')}
                </JSONViewButton>
                <JSONViewButton onClick={handleDeleteAll} dangerous>
                    <FaExclamationTriangle />
                    {t('Delete All')}
                </JSONViewButton>
            </JSONViewButtons>
            <JSONViewContent className='mt-5'>{JSON.stringify(data, null, 2)}</JSONViewContent>
        </JSONViewContainer>
    );

};

const JSONViewContainer = styled.div`
    padding: 20px;
`;

const JSONViewButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const JSONViewButton = styled.button<{ dangerous?: boolean }>`
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background-color: ${props => props.dangerous ? '#F09686' : '#72CCA5'};
    color: white;
    font-size: 0.8em;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${props => props.dangerous ? '#962121' : '#219653'};
    }
`;

const JSONViewContent = styled.pre`
    white-space: pre-wrap;
    font-family: monospace;
    padding: 10px;
    background-color : ${({ theme }) => theme.nodeInputBg};
`;

function arePropsEqual(prevProps: JSONViewProps, nextProps: JSONViewProps) {
    return prevProps.nodes === nextProps.nodes && prevProps.edges === nextProps.edges && prevProps.withCoordinates === nextProps.withCoordinates;
}

export default memo(JSONView, arePropsEqual);