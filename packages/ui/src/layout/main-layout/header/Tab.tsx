import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import styled from "styled-components";
import ActionGroup, { Action } from "../../../components/selectors/ActionGroup";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

interface TabProps {
  index: number;
  active: boolean;
  onChangeTab: (index: number) => void;
  onDeleteTab: (index: number) => void;
  onChangeTabName?: (index: number, name: string) => void;
  name: string;
}

type TabActions = "remove" | "name";

const Tab = ({
  index,
  active,
  onChangeTab,
  onDeleteTab,
  onChangeTabName,
  name,
}: TabProps) => {
  const { t } = useTranslation("flow");
  const [showActions, setShowActions] = useState(true);
  const [editName, setEditName] = useState(false);

  const buttonRef = useRef(null);

  let hideActionsTimeout: ReturnType<typeof setTimeout>;

  const hideActionsWithDelay = () => {
    hideActionsTimeout = setTimeout(() => {
      setShowActions(false);
      setEditName(false);
    }, 1500);
  };

  const clearHideActionsTimeout = () => {
    if (hideActionsTimeout) {
      clearTimeout(hideActionsTimeout);
    }
  };

  const actions: Action<TabActions>[] = [
    {
      icon: editName ? <FaCheck /> : <MdEdit />,
      name: t("ChangeName"),
      value: "name",
      onClick: () => {
        setEditName(!editName);
      },
      tooltipPosition: "bottom",
    },
    {
      icon: <MdDelete />,
      name: t("RemoveFlow"),
      value: "remove",
      onClick: () => {
        onDeleteTab(index);
      },
      hoverColor: "text-red-400",
      tooltipPosition: "bottom",
    },
  ];

  return (
    <>
      <TabButton
        active={active}
        ref={buttonRef}
        className={`text-md group
                        relative
                        mr-5 inline-block cursor-pointer px-2 py-2 
                        font-medium
                        ${active ? "text-slate-50" : "text-slate-500"} 
                        hover:text-slate-50`}
        onClick={() => {
          if (active) {
            setShowActions(true);
          } else {
            onChangeTab(index);
          }
        }}
        onMouseEnter={() => {
          clearHideActionsTimeout();
        }}
        onMouseLeave={() => hideActionsWithDelay()}
      >
        {editName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => {
              !!onChangeTabName && onChangeTabName(index, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditName(false);
              }
            }}
          />
        ) : (
          <span className="text-md">{name}</span>
        )}
        {active && (
          <Portal>
            <div
              className={`absolute ${showActions ? "opacity-100" : "pointer-events-none opacity-0"} flex translate-y-2 justify-center transition-all duration-300 ease-in-out`}
              onMouseEnter={() => {
                clearHideActionsTimeout();
              }}
              style={
                !!buttonRef.current ? calculatePosition(buttonRef.current) : {}
              }
            >
              <ActionGroup actions={actions} showIcon />
            </div>
          </Portal>
        )}
      </TabButton>
    </>
  );
};

const Portal = ({ children }: { children: ReactNode }) => {
  const mountNode = document.getElementById("root");

  if (!mountNode) {
    throw new Error("The element #portal-root was not found in the DOM");
  }

  return ReactDOM.createPortal(children, mountNode);
};

function calculatePosition(element: HTMLDivElement) {
  const rect = element.getBoundingClientRect();
  return {
    position: "absolute",
    width: rect.width,
    top: `${rect.bottom + window.scrollY}px`, // Position below the button
    left: `${rect.left + window.scrollX}px`, // Align with the button's left edge
  } as CSSProperties;
}

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
