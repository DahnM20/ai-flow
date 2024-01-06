import React, { useContext, memo, useState } from 'react';
import { FiCrosshair, FiDownload, FiUpload } from 'react-icons/fi';
import { Edge, Node } from 'reactflow';
import { convertFlowToJson, convertJsonToFlow, nodesTopologicalSort } from '../../utils/flowUtils';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NodeContext } from '../providers/NodeProvider';
import { FaExclamationTriangle } from 'react-icons/fa';
import DefaultSwitch from '../buttons/DefaultSwitch';

interface JSONViewProps {
    nodes: Node[];
    edges: Edge[];
    onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const JSONView: React.FC<JSONViewProps> = ({ nodes, edges, onChangeFlow }) => {

    const { t } = useTranslation('flow');
    const { onUpdateNodes } = useContext(NodeContext);
    const [showFieldsConfig, setShowFieldsConfig] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(true);

    nodes = nodesTopologicalSort(nodes, edges);
    const data = convertFlowToJson(nodes, edges, showCoordinates, showFieldsConfig);


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
        const fullData = convertFlowToJson(nodes, edges, true, true);
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
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
            <div className='flex flex-col mt-2'>
                <div className='flex flex-row items-center space-x-2'>
                    <DefaultSwitch onChange={(checked: boolean) => setShowFieldsConfig(checked)} checked={showFieldsConfig} />
                    <p className='text-sm'>Show nodes config</p>
                </div>
                <div className='flex flex-row items-center space-x-2'>
                    <DefaultSwitch onChange={(checked: boolean) => setShowCoordinates(checked)} checked={showCoordinates} />
                    <p className='text-sm'>Show coordinates</p>
                </div>
            </div >
            <JSONViewContent className='mt-5'>{JSON.stringify(data, null, 2)}</JSONViewContent>
        </JSONViewContainer >
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
    return prevProps.nodes === nextProps.nodes && prevProps.edges === nextProps.edges;
}

export default memo(JSONView, arePropsEqual);