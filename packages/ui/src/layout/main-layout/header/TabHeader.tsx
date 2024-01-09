import React from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import Tab from './Tab';


interface TabHeaderProps {
    tabs: any[];
    currentTab: number;
    onChangeTab: (index: number) => void;
    onDeleteTab: (index: number) => void;
    onAddFlowTab: () => void;
    tabPrefix: string;
    children: React.ReactNode;
}

const TabHeader = ({ tabs, currentTab, onChangeTab, onDeleteTab, onAddFlowTab, tabPrefix, children }: TabHeaderProps) => {
    return (
        <TabsContainer className='flex flex-row items-center justify-center h-16 py-2 border-b-sky-950/50 z-30'>
            <div className='ml-4 mx-auto flex flex-row text-center align-middle justify-center'>
                <img src="logo.png" className='w-16' alt="Logo"></img>
            </div>
            <Tabs>
                {tabs.map((tab: any, index: number) => (
                    <Tab
                        key={index}
                        index={index}
                        active={index === currentTab}
                        onChangeTab={onChangeTab}
                        onDeleteTab={onDeleteTab}>
                        {tabPrefix} {index + 1}
                    </Tab>
                ))}
            </Tabs>
            <AddTabButton onClick={onAddFlowTab} className='text-lg text-slate-200 hover:text-slate-50 hover:ring-2 ring-slate-200 rounded-lg py-1 px-1'>
                <FaPlus />
            </AddTabButton>
            {
                children
            }
        </TabsContainer>
    );
};


const TabsContainer = styled.div`
  font-family: Roboto;
`;

const Tabs = styled.div`
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: auto;
  padding-bottom: 3px;
  max-width: 60%;
`;

const AddTabButton = styled.div`
`;

export default TabHeader;
