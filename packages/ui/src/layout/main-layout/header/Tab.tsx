import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styled from "styled-components";

interface TabProps {
  index: number;
  active: boolean;
  onChangeTab: (index: number) => void;
  onDeleteTab: (index: number) => void;
  children: React.ReactNode;
}

const Tab = ({
  index,
  active,
  onChangeTab,
  onDeleteTab,
  children,
}: TabProps) => {
  return (
    <TabButton
      active={active}
      className={`text-md group
                        relative
                        mr-5 inline-block cursor-pointer px-2 py-2 
                        font-medium
                        ${active ? "text-slate-50" : "text-slate-500"} 
                        hover:text-slate-50`}
      onClick={() => onChangeTab(index)}
    >
      {children}
      {active && (
        <span
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-3 transform text-red-300 transition-all duration-300 ease-in-out hover:text-red-500 group-hover:block"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTab(index);
          }}
        >
          <AiOutlineClose />
        </span>
      )}
    </TabButton>
  );
};

export default Tab;

export const TabButton = styled.button<{ active: boolean }>`
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
  transform: ${(props) => (props.active ? "scale(1.15)" : "scale(1)")};

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
    transform: ${(props) => (props.active ? "scaleX(1)" : "scaleX(0)")};
    transition: transform 0.3s ease-in-out;
    z-index: 11;
  }
`;
