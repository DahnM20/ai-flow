import React from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Importing an icon for the delete button
import styled from 'styled-components';

interface TabProps {
    index: number;
    active: boolean;
    onChangeTab: (index: number) => void;
    onDeleteFlow: (index: number) => void;
    children: React.ReactNode;
};

const Tab = ({ index, active, onChangeTab, onDeleteFlow, children }: TabProps) => {
    return (
        <TabButton
            active={active}
            className={`relative inline-block
                        group
                        text-md mr-5 px-2 py-2 cursor-pointer 
                        font-medium
                        ${active ? 'text-slate-50' : 'text-slate-500'} 
                        hover:text-slate-50`}
            onClick={() => onChangeTab(index)}
        >
            {children}
            {
                active &&
                <span
                    className="absolute  top-1/2 right-0 transform -translate-y-1/2 translate-x-3 hidden group-hover:block text-red-300 hover:text-red-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFlow(index);
                    }}
                >
                    <AiOutlineClose />
                </span>
            }
        </TabButton>
    );
};

export default Tab;

export const TabButton = styled.button<{ active: boolean }>`
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  transform: ${(props) => (props.active ? 'scale(1.15)' : 'scale(1)')};

  &::after {
    content: "";
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    left: 15%;
    right: 15%;
    height: 3px;
    background: ${(props) => props.theme.accent};
    transform: ${(props) => (props.active ? 'scaleX(1)' : 'scaleX(0)')};
    transition: transform 0.3s ease-in-out;
    z-index: 11;
  }
`;