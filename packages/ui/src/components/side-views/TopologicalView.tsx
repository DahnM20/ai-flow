import React, { memo } from "react";
import { Edge, Node } from "reactflow";
import { nodesTopologicalSort } from "../../utils/flowUtils";
import styled from "styled-components";
import OutputDisplay from "../nodes/node-output/OutputDisplay";

interface TopologicalViewProps {
  nodes: Node[];
  edges: Edge[];
}

const TopologicalView: React.FC<TopologicalViewProps> = ({ nodes, edges }) => {
  nodes = nodesTopologicalSort(nodes, edges);

  return (
    <TopologicalViewContainer>
      {nodes.map((node) => {
        if (!node.data.outputData) return undefined;
        return (
          <TopologicalViewContent>
            <TopologicalViewNodeName>{node.id}</TopologicalViewNodeName>
            <OutputDisplay data={node.data} />
          </TopologicalViewContent>
        );
      })}
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
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) left / 1.5%
    no-repeat;
`;

const TopologicalViewContent = styled.div`
  white-space: pre-wrap;
  padding: 10px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.nodeInputBg};
`;

function arePropsEqual(
  prevProps: TopologicalViewProps,
  nextProps: TopologicalViewProps,
) {
  const prevNodesOutput = prevProps.nodes.map((node) => node.data.outputData);
  const nextNodesOutput = nextProps.nodes.map((node) => node.data.outputData);

  if (prevNodesOutput.length !== nextNodesOutput.length) return false;

  return prevNodesOutput.toString() === nextNodesOutput.toString();
}

export default memo(TopologicalView, arePropsEqual);
