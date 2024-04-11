import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import OutputDisplay from "../nodes/node-output/OutputDisplay";
import styled from "styled-components";

interface TopologicalViewNodeProps {
  id: string;
  data: any;
}

const TopologicalViewNode: React.FC<TopologicalViewNodeProps> = ({
  id,
  data,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <TopologicalViewContent>
      <TopologicalViewNodeName
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-100 hover:text-sky-400"
      >
        <span className="font-mono">{id}</span>
        <div className="text-md ">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </TopologicalViewNodeName>
      {isOpen && <OutputDisplay data={data} />}
    </TopologicalViewContent>
  );
};
const TopologicalViewNodeName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 0.5em;
  font-size: 0.8em;
  margin-bottom: 10px;
  padding-left: 3%;
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) left / 1.5%
    no-repeat;
`;

const TopologicalViewContent = styled.div`
  white-space: pre-wrap;
  padding: 10px;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.nodeInputBg};
`;

export default TopologicalViewNode;
