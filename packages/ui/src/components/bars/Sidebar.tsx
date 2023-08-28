import React, { useState } from 'react';
import { FiChevronsRight, FiChevronsLeft } from 'react-icons/fi';
import { Edge, Node } from 'reactflow';
import JSONView from '../side-views/JSONView';
import styled, { css } from 'styled-components';

interface SidebarProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ nodes, edges, onChangeFlow }) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <>
      <SidebarToggle show={show} onClick={toggleShow}>
        <ToggleIcon>
          {show ? <FiChevronsRight /> : <FiChevronsLeft />}
        </ToggleIcon>
      </SidebarToggle>
      <SidebarContainer show={show}>
        <JSONView nodes={nodes} edges={edges} onChangeFlow={onChangeFlow} withCoordinates />
      </SidebarContainer>
      {!show && <div className="sidebar-overlay" onClick={toggleShow} />}
    </>
  );
};

const SidebarContainer = styled.div<{ show: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30%;
  color: ${({ theme }) => theme.text};
  background-color:  ${({ theme }) => theme.bg};
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.2s ease-in-out;
  z-index: 9999;

  ${({ show }) => show && css`
    transform: translateX(0);
  `}
`;

const SidebarToggle = styled.div<{ show: boolean }>`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 80px;
  background-color: #110a0e;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: width 0.2s ease-in-out;
  z-index: 1;

  ${({ show }) => show && css`
    width: 31.5%;
  `}

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ToggleIcon = styled.div`
  color: #a4a4a4d1;
  font-size: 1.5em;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  :hover{
    color: #ffffff;
  }
`;

export default Sidebar;