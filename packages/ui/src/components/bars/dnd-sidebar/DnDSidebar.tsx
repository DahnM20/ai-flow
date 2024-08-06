import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import { getSections } from "../../../nodes-configuration/sectionConfig";
import { memo, useEffect, useState } from "react";
import DraggableNode from "./DraggableNode";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useVisibility } from "../../../providers/VisibilityProvider";
import useIsTouchDevice from "../../../hooks/useIsTouchDevice";
import Section from "./Section";

const HIDE_SIDEBAR_ANIMATION_DURATION = 300;

const DnDSidebar = () => {
  const { t } = useTranslation("flow");
  const { getElement } = useVisibility();
  const sidebar = getElement("dragAndDropSidebar");

  const [contentVisible, setContentVisible] = useState(sidebar?.isVisible);

  const [sections, setSections] = useState(getSections());
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (sidebar.isVisible) {
      setContentVisible(true);
    } else {
      timeoutId = setTimeout(
        () => setContentVisible(false),
        HIDE_SIDEBAR_ANIMATION_DURATION,
      );
    }

    return () => clearTimeout(timeoutId);
  }, [sidebar]);

  useEffect(() => {
    const handleHiddenListChanged = (e: any) => {
      setSections(getSections());
    };

    window.addEventListener("nodesHiddenListChanged", handleHiddenListChanged);

    return () => {
      window.removeEventListener(
        "nodesHiddenListChanged",
        handleHiddenListChanged,
      );
    };
  }, []);

  return (
    <>
      <div
        className={`relative flex w-1/2
        transform
        transition-transform md:w-full duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out ${!sidebar.isVisible ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div
          className={`absolute left-full top-1/2 z-50 flex translate-x-2 transform 
          text-2xl font-bold
          text-slate-300 hover:font-extrabold hover:text-slate-100`}
          onClick={sidebar.toggle}
          // data-tooltip-id={`dnd-tooltip`}
          // data-tooltip-content={`${sidebar.isVisible ? t("HideSidebar") : t("ShowSidebar")}`}
          // data-tooltip-place="right"
        >
          {!sidebar.isVisible ? <FiChevronRight /> : <FiChevronLeft />}
        </div>
        {contentVisible && (
          <DnDSidebarContainer
            className={` font-sm md:font-md flex transform flex-col  border-r-sky-900/50 bg-zinc-950/10 px-3 py-2 shadow-md  ${isTouchDevice ? "overflow-y-auto" : " overflow-hidden hover:overflow-y-auto"}
             ${!sidebar.isVisible ? "opacity-0" : ""} 
                  transition-opacity duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out`}
          >
            {contentVisible
              ? sections.map((section, index) => (
                  <Section key={index} index={index} section={section}>
                    {section.nodes?.map((node, nodeIndex) => (
                      <DraggableNode key={nodeIndex} node={node} />
                    ))}
                  </Section>
                ))
              : undefined}
          </DnDSidebarContainer>
        )}
      </div>
      <Tooltip
        className="hidden transition-all md:block"
        id={`dnd-tooltip`}
        style={{ zIndex: 100 }}
        delayShow={300}
      />
    </>
  );
};

const DnDSidebarContainer = styled.div``;

export default memo(DnDSidebar);
