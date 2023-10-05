import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { FaInfoCircle, FaToolbox } from 'react-icons/fa';
import { nodeSectionMapping } from '../../nodesConfiguration/nodeConfig';
import { memo, useState } from 'react';


const DnDSidebar = () => {
  const { t } = useTranslation('flow');
  const [isOpen, setOpen] = useState(true);

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <DnDSidebarContainer isOpen={isOpen} onClick={() => setOpen(!isOpen)} className='bg-zinc-950/50 shadow-md border-r-2 border-r-sky-900/50'>
        {nodeSectionMapping.map((section, index) => (
          <Section key={index} className='flex flex-col gap-y-2 mb-5'>
            <SectionTitle className="flex flex-row items-center gap-x-2 text-md text-slate-300 ml-1 py-1 border-b-2 border-b-slate-500/20">
              {section.icon && <section.icon />}
              {t(section.section)}
            </SectionTitle>
            {section.nodes.map((node, nodeIndex) => (
              <Node
                key={nodeIndex}
                onDragStart={(event) => onDragStart(event, node.type)}
                draggable
                onClick={(e) => e.stopPropagation()}
                className='flex flex-row w-full gap-x-1 text-md 
                text-slate-200 
                justify-center items-center text-center
                h-auto py-2 rounded-md 
                hover:ring-2
                hover:ring-slate-200/50
                font-medium
                shadow-md
                cursor-grab'
              >
                {t(node.label)}
                {
                  node.helpMessage &&
                  <StyledInfoIcon
                    className='text-sm'
                    data-tooltip-id={`dnd-tooltip`}
                    data-tooltip-content={t(node.helpMessage)}
                  />
                }
              </Node>
            ))}
          </Section>
        ))}
      </DnDSidebarContainer>
      <Tooltip id={`dnd-tooltip`} style={{ zIndex: 100 }} />
    </>
  );
};

const DnDSidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 12%;
  z-index: 1;
  overflow-y: ${({ isOpen }) => (isOpen ? 'auto' : 'hidden')};
  padding: 75px 10px;

  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-95%)')};
  transition: transform 0.3s ease-in-out;

  @media screen and (max-width: 768px) {
    width: 30%;
    font-size: 0.9em;
    padding: 50px 5px;
  }
`;

const Section = styled.div`
`;

const SectionTitle = styled.h2`
`;

const Node = styled.div`
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 2% no-repeat, ${({ theme }) => theme.bg};
`;

const StyledInfoIcon = styled(FaInfoCircle)`
`;

export default memo(DnDSidebar);