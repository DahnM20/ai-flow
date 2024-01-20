import { t } from "i18next";
import { NodeData } from "../components/nodes/types/node";
import { Field } from "../nodes-configuration/nodeConfig";
import { Node, Edge } from 'reactflow';

const isFieldLinkedToAnotherNode = (field: Field, nodeData: NodeData) => {
    const nodeFieldsWithSameName = nodeData.inputs?.find(input => input.inputName === field.name);
    return nodeFieldsWithSameName?.inputNode;
}

const getNodeMissingFields = (nodeData: NodeData) => {
    const missingFields: string[] = [];

    nodeData.config?.fields?.forEach(field => {
        if (field.required && !nodeData[field.name] && !isFieldLinkedToAnotherNode(field, nodeData)) {
            missingFields?.push(field.name);
        }
    });

    return missingFields;
}

const getNodeToCheckForCurrentNode = (flowFile: NodeData[], nodeIndex: number) => {
    let nodesToCheckForCurrentNode = []

    if (!flowFile[nodeIndex].inputs || flowFile[nodeIndex].inputs.length === 0) {
        nodesToCheckForCurrentNode.push(flowFile[nodeIndex].name);

    } else {
        nodesToCheckForCurrentNode = [...flowFile].slice(0, nodeIndex + 1).map((node) => node.name);
    }

    return nodesToCheckForCurrentNode;

}

export function createErrorMessageForMissingFields(nodesInError: Node[], t: any) {
    let errorMessage = t('MissingFieldsMessage') + '\n\n';

    nodesInError.forEach(node => {
        const nodeData = node.data as NodeData;
        errorMessage += `${t('Node')}: ${nodeData.config.nodeName}\n`;
        errorMessage += `${t('MissingFields')}:\n`;

        nodeData.missingFields?.forEach(field => {
            errorMessage += ` - ${field}\n`;
        });

        errorMessage += '\n\n';
    });
    return errorMessage;
}

export function getNodeInError(flowFile: NodeData[], nodesSorted: Node[], name?: string,) {
    let nodesToCheck = flowFile.map((node) => node.name)
    if (!!name) {
        const currentNodeIndex = flowFile.findIndex((data) => data.name === name);
        nodesToCheck = getNodeToCheckForCurrentNode(flowFile, currentNodeIndex);
    }

    const nodeToUpdate = nodesSorted.filter(node => nodesToCheck.includes(node.data.name));

    const nodesInError = nodeToUpdate
        .map(node => {
            const flowFileCurrentNodeData = flowFile.find((data) => data.name === node.data.name);
            if (flowFileCurrentNodeData) {
                node.data.missingFields = getNodeMissingFields(flowFileCurrentNodeData);
            }
            return node;
        })
        .filter((node) => node.data.missingFields?.length > 0);
    return nodesInError;
}
