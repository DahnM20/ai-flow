import React, { useContext, useState } from "react";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import { Edge, Node } from "reactflow";
import JSONView from "../side-views/JSONView";
import styled, { css } from "styled-components";
import TopologicalView from "../side-views/TopologicalView";
import { useTranslation } from "react-i18next";
import { TabButton } from "../../layout/main-layout/header/Tab";
import { useVisibility } from "../../providers/VisibilityProvider";
import CurrentNodeView from "../side-views/CurrentNodeView";
import ButtonRunAll from "../buttons/ButtonRunAll";
import { NodeContext } from "../../providers/NodeProvider";

interface SidebarProps {
  nodes: Node[];
  edges: Edge[];
  onChangeFlow: (nodes: Node[], edges: Edge[]) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ nodes, edges, onChangeFlow }) => {
  const { t } = useTranslation("flow");
  const { runAllNodes, currentNodesRunning } = useContext(NodeContext);
  const { getElement, sidepaneActiveTab, setSidepaneActiveTab } =
    useVisibility();

  const sidebar = getElement("sidebar");

  const show = sidebar.isVisible;
  const toggleShow = () => sidebar.toggle();

  return (
    <>
      <SidebarToggle show={show} onClick={toggleShow}>
        <ToggleIcon>
          {show ? <FiChevronsRight /> : <FiChevronsLeft />}
        </ToggleIcon>
      </SidebarToggle>
      <ButtonsContainer show={show}>
        <div
          className={`absolute flex flex-col space-y-3 ${show ? "opacity-100" : "-z-50 opacity-0"} transition-all duration-300 ease-out`}
        >
          <ButtonRunAll
            small
            onClick={show ? runAllNodes : () => {}}
            isRunning={currentNodesRunning?.length > 0}
          />
        </div>
      </ButtonsContainer>
      <SidebarContainer show={show}>
        <HeaderContainer>
          <TabButton
            active={sidepaneActiveTab === "json"}
            onClick={() => setSidepaneActiveTab("json")}
            className="text-md px-1 py-2 hover:text-slate-50"
          >
            <Title>{t("JsonView")}</Title>
          </TabButton>
          <TabButton
            active={sidepaneActiveTab === "topological"}
            onClick={() => setSidepaneActiveTab("topological")}
            className="text-md px-1 py-2 hover:text-slate-50"
          >
            <Title>{t("TopologicalView")}</Title>
          </TabButton>
          <TabButton
            active={sidepaneActiveTab === "current_node"}
            onClick={() => setSidepaneActiveTab("current_node")}
            className="text-md px-1 py-2 hover:text-slate-50"
          >
            <Title>{t("currentNodeView")}</Title>
          </TabButton>
        </HeaderContainer>
        {show && sidepaneActiveTab === "topological" && (
          <TopologicalView nodes={nodes} edges={edges} />
        )}
        {show && sidepaneActiveTab === "json" && (
          <JSONView nodes={nodes} edges={edges} onChangeFlow={onChangeFlow} />
        )}
        {show && sidepaneActiveTab === "current_node" && <CurrentNodeView />}
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

const ButtonsContainer = styled.div<{ show: boolean }>`
  position: fixed;
  right: 0;
  top: 2%;
  transform: translateY(-50%);
  width: 5em;
  transition: width 0.2s ease-in-out;
  z-index: 1000000;

  ${({ show }) =>
    show &&
    css`
      width: 33%;
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
