import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import { nodeSectionMapping } from "../../../nodes-configuration/sectionConfig";
import { memo, useEffect, useState } from "react";
import DraggableNode from "./DraggableNode";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HIDE_SIDEBAR_ANIMATION_DURATION = 300;

const DnDSidebar = () => {
  const { t } = useTranslation("flow");
  const [isOpen, setOpen] = useState(true);

  const [contentVisible, setContentVisible] = useState(isOpen);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isOpen) {
      setContentVisible(true);
    } else {
      timeoutId = setTimeout(
        () => setContentVisible(false),
        HIDE_SIDEBAR_ANIMATION_DURATION,
      );
    }

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  return (
    <>
      <div
        className={`relative flex w-1/2
        transform
        transition-transform md:w-full duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out ${!isOpen ? "-translate-x-full" : "translate-x-0"}`}
      >
        <div
          className={`absolute left-full top-1/2 z-50 flex translate-x-2 transform 
          text-2xl font-bold
          text-slate-300 hover:font-extrabold hover:text-slate-100`}
          onClick={() => setOpen(!isOpen)}
          data-tooltip-id={`dnd-tooltip`}
          data-tooltip-content={`${isOpen ? t("HideSidebar") : t("ShowSidebar")}`}
          data-tooltip-place="right"
        >
          {!isOpen ? <FiChevronRight /> : <FiChevronLeft />}
        </div>
        {contentVisible && (
          <DnDSidebarContainer
            className={` font-sm md:font-md flex transform flex-col overflow-hidden  border-r-sky-900/50 bg-zinc-950/10 px-3 py-2 shadow-md hover:overflow-y-auto`}
          >
            {contentVisible
              ? nodeSectionMapping.map((section, index) => (
                  <Section
                    key={index}
                    className={`mb-5 flex flex-col gap-y-2 ${!isOpen ? "opacity-0" : ""} 
                  transition-opacity duration-${HIDE_SIDEBAR_ANIMATION_DURATION} ease-in-out`}
                  >
                    <SectionTitle className="text-md ml-1 flex flex-row items-center gap-x-2 border-b-2 border-b-slate-500/20 py-1 text-slate-300">
                      {section.icon && <section.icon />}
                      {t(section.label)}
                    </SectionTitle>
                    {section.nodes?.map((node, nodeIndex) => (
                      <DraggableNode key={nodeIndex} node={node} />
                    ))}
                  </Section>
                ))
              : undefined}
          </DnDSidebarContainer>
        )}
      </div>
      <Tooltip id={`dnd-tooltip`} style={{ zIndex: 100 }} />
    </>
  );
};

const DnDSidebarContainer = styled.div``;

const Section = styled.div``;

const SectionTitle = styled.h2``;

export default memo(DnDSidebar);
