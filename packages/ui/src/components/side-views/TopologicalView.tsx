import React, { memo } from "react";
import { Edge, Node } from "reactflow";
import { nodesTopologicalSort } from "../../utils/flowUtils";
import styled from "styled-components";
import OutputDisplay from "../nodes/node-output/OutputDisplay";
import TopologicalViewNode from "./TopologicalViewNode";

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
          <TopologicalViewNode key={node.id} data={node.data} id={node.id} />
        );
      })}
    </TopologicalViewContainer>
  );
};

const TopologicalViewContainer = styled.div`
  padding: 20px;
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
