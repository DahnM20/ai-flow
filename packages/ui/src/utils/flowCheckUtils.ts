import { NodeData } from "../components/nodes/types/node";
import { Field } from "../nodes-configuration/nodeConfig";
import { Node } from 'reactflow';

const isFieldLinkedToAnotherNode = (field: Field, nodeData: NodeData) => {
    const nodeFieldsWithSameName = nodeData.inputs?.find(input => input.inputName === field.name);
    return nodeFieldsWithSameName?.inputNode;
}

export const getRequiredNodesForLaunch = (flowFile: NodeData[], nodeName: string, requiredNodes?: string[]) => {
    if(!requiredNodes) requiredNodes = []

    const currentNode = flowFile.find(node => node.name === nodeName);
    const nodesLinked = currentNode?.inputs?.map(input => input.inputNode);

    nodesLinked?.forEach((node) => {
        getRequiredNodesForLaunch(flowFile, node, requiredNodes)
    })

    requiredNodes.push(nodeName)


    return requiredNodes;
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
        nodesToCheck = getRequiredNodesForLaunch(flowFile, name);
    }

    const nodesToUpdate = nodesSorted.filter(node => nodesToCheck.includes(node.data.name));

    const nodesInError = nodesToUpdate
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
