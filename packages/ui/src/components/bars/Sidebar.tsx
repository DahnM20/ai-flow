import React, { useContext } from "react";
import { Edge, Node } from "reactflow";
import JSONView from "../side-views/JSONView";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useVisibility } from "../../providers/VisibilityProvider";
import CurrentNodeView from "../side-views/CurrentNodeView";
import ButtonRunAll from "../buttons/ButtonRunAll";
import { NodeContext } from "../../providers/NodeProvider";
import { Tabs, rem } from "@mantine/core";
import { FaFile } from "react-icons/fa";
import { MdCenterFocusStrong } from "react-icons/md";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

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

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <SidebarToggle show={show} onClick={toggleShow}>
        <ToggleIcon>
          {show ? <FiChevronsRight /> : <FiChevronsLeft />}
        </ToggleIcon>
      </SidebarToggle>
      <ButtonsContainer
        show={show}
        className={`absolute  flex flex-col space-y-3 bg-red-500 ${show ? "z-50 opacity-100" : "pointer-events-none -z-50 opacity-0"} transition-all duration-300 ease-out`}
      >
        <ButtonRunAll
          small
          onClick={show ? runAllNodes : () => {}}
          isRunning={currentNodesRunning?.length > 0}
        />
      </ButtonsContainer>

      <SidebarContainer
        show={show}
        key={sidepaneActiveTab}
        className="rounded-l-3xl"
      >
        <Tabs
          defaultValue={sidepaneActiveTab}
          color="cyan"
          variant="pills"
          keepMounted={false}
        >
          <Tabs.List grow>
            <Tabs.Tab
              value="json"
              leftSection={<FaFile style={iconStyle} />}
              onClick={() => setSidepaneActiveTab("json")}
            >
              {t("JsonView")}
            </Tabs.Tab>
            <Tabs.Tab
              value="current_node"
              leftSection={<MdCenterFocusStrong style={iconStyle} />}
              onClick={() => setSidepaneActiveTab("current_node")}
            >
              {t("currentNodeView")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="json">
            <JSONView nodes={nodes} edges={edges} onChangeFlow={onChangeFlow} />
          </Tabs.Panel>

          <Tabs.Panel value="current_node">
            <CurrentNodeView />
          </Tabs.Panel>
        </Tabs>
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
  top: 3%;
  transform: translateY(-50%);
  transition: width 0.2s ease-in-out;
  z-index: 1000000;

  ${({ show }) =>
    show &&
    css`
      right: 31%;
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
