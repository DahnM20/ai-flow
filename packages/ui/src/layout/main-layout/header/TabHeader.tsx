import React from "react";
import { FaPlus } from "react-icons/fa";
import styled from "styled-components";
import Tab from "./Tab";
import { FlowTab } from "../AppLayout";

interface TabHeaderProps {
  tabs: any[];
  currentTab: number;
  onChangeTab: (index: number) => void;
  onDeleteTab: (index: number) => void;
  onAddFlowTab: () => void;
  onChangeTabName?: (index: number, name: string) => void;
  tabPrefix: string;
  children: React.ReactNode;
}

const TabHeader = ({
  tabs,
  currentTab,
  onChangeTab,
  onDeleteTab,
  onAddFlowTab,
  onChangeTabName,
  tabPrefix,
  children,
}: TabHeaderProps) => {
  return (
    <TabsContainer className="z-30 flex h-16 flex-row items-center justify-center border-b-sky-950/50 py-2">
      <div className="mx-auto ml-4 flex w-10 flex-row justify-center pr-2 text-center align-middle">
        <img src="logo.svg" alt="Logo"></img>
      </div>
      <Tabs className="overflow-hidden hover:overflow-x-auto">
        {tabs.map((tab: any, index: number) => (
          <Tab
            key={index}
            index={index}
            active={index === currentTab}
            onChangeTab={onChangeTab}
            onDeleteTab={onDeleteTab}
            onChangeTabName={onChangeTabName}
            name={
              !!tab.metadata?.name
                ? tab.metadata.name
                : !!tab.name
                  ? tab.name
                  : tabPrefix + " " + (index + 1)
            }
          />
        ))}
      </Tabs>
      <AddTabButton
        onClick={onAddFlowTab}
        className="rounded-lg px-1 py-1 text-lg text-slate-200 ring-slate-200 transition-all duration-300 ease-in-out hover:text-slate-50 hover:ring-2"
      >
        <FaPlus />
      </AddTabButton>
      {children}
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  font-family: Roboto;
`;

const Tabs = styled.div`
  white-space: nowrap;
  overflow-y: hidden;
  padding-bottom: 3px;
  max-width: 60%;
`;

const AddTabButton = styled.div``;

export default TabHeader;
