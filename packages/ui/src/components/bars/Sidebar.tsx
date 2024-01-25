import React, { useState } from "react";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import { Edge, Node } from "reactflow";
import JSONView from "../side-views/JSONView";
import styled, { css } from "styled-components";
import TopologicalView from "../side-views/TopologicalView";
import { useTranslation } from "react-i18next";
import { TabButton } from "../../layout/main-layout/header/Tab";

interface SidebarProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ nodes, edges, onChangeFlow }) => {
  const { t } = useTranslation("flow");

  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("json");
  const toggleShow = () => setShow(!show);

  return (
    <>
      <SidebarToggle show={show} onClick={toggleShow}>
        <ToggleIcon>
          {show ? <FiChevronsRight /> : <FiChevronsLeft />}
        </ToggleIcon>
      </SidebarToggle>
      <SidebarContainer show={show}>
        <HeaderContainer>
          <TabButton
            active={activeTab === "json"}
            onClick={() => setActiveTab("json")}
            className="text-md px-1 py-2 hover:text-slate-50"
          >
            <Title>{t("JsonView")}</Title>
          </TabButton>
          <TabButton
            active={activeTab === "topological"}
            onClick={() => setActiveTab("topological")}
            className="text-md px-1 py-2 hover:text-slate-50"
          >
            <Title>{t("TopologicalView")}</Title>
          </TabButton>
        </HeaderContainer>
        {show && activeTab === "topological" && (
          <TopologicalView nodes={nodes} edges={edges} />
        )}
        {show && activeTab === "json" && (
          <JSONView nodes={nodes} edges={edges} onChangeFlow={onChangeFlow} />
        )}
      </SidebarContainer>
      {!show && <div className="sidebar-overlay" onClick={toggleShow} />}
    </>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

const Title = styled.div`
  font-weight: bold;
  margin: 0 10px;
`;

const SidebarContainer = styled.div<{ show: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30%;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bg};
  box-shadow: -3px 0 3px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.2s ease-in-out;
  z-index: 9999;

  ${({ show }) =>
    show &&
    css`
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

  ${({ show }) =>
    show &&
    css`
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

  :hover {
    color: #ffffff;
  }
`;

export default Sidebar;
