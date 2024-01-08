import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { nodeSectionMapping } from '../../../nodes-configuration/sectionConfig';
import { memo, useState } from 'react';
import DraggableNode from './DraggableNode';


const DnDSidebar = () => {
  const { t } = useTranslation('flow');
  const [isOpen, setOpen] = useState(true);

  return (
    <>
      <DnDSidebarContainer isOpen={isOpen} onClick={() => setOpen(!isOpen)} className='shadow-md bg-zinc-950/10 border-r-sky-900/50'>
        {nodeSectionMapping.map((section, index) => (
          <Section key={index} className={`flex flex-col gap-y-2 mb-5 ${!isOpen ? 'opacity-0' : 'transition-opacity'}`}>
            <SectionTitle className="flex flex-row items-center gap-x-2 text-md text-slate-300 ml-1 py-1 border-b-2 border-b-slate-500/20">
              {section.icon && <section.icon />}
              {t(section.label)}
            </SectionTitle>
            {section.nodes?.map((node, nodeIndex) => (
              <DraggableNode key={nodeIndex} node={node} />
            ))}
          </Section>
        ))}
      </DnDSidebarContainer>
      <Tooltip id={`dnd-tooltip`} style={{ zIndex: 100 }} />
    </>
  );
};

const DnDSidebarContainer = styled.div<{ isOpen: boolean }>`
  height: 95%;
  z-index: 1;
  overflow-y: ${({ isOpen }) => (isOpen ? 'auto' : 'hidden')};
  padding: 1rem .75rem;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-95%)')};
  transition: transform 0.3s ease-in-out;

  @media screen and (max-width: 768px) {
    width: 70%;
    font-size: 0.9em;
    padding: 50px 5px;
  }
`;

const Section = styled.div`
`;

const SectionTitle = styled.h2`
`;

export default memo(DnDSidebar);