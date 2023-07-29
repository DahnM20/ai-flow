import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
import { FaInfoCircle } from 'react-icons/fa';
import { nodeSectionMapping } from '../../nodesConfiguration/nodeConfig';


const DnDSidebar = () => {
  const { t } = useTranslation('flow');

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <DnDSidebarContainer>
        {nodeSectionMapping.map((section, index) => (
          <Section key={index}>
            <SectionTitle>{t(section.section)}</SectionTitle>
            {section.nodes.map((node, nodeIndex) => (
              <Node
                key={nodeIndex}
                onDragStart={(event) => onDragStart(event, node.type)}
                draggable
              >
                {t(node.label)}
                {
                  node.helpMessage &&
                  <StyledInfoIcon
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

const DnDSidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 9.5vw;
  background: ${({ theme }) => theme.sidebarBg};
  z-index: 1;
  overflow-y: auto;
  padding: 75px 10px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.accentText};
`;

const Node = styled.div`
  height: 40px;
  padding: 6px 10px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.nodeBg};
  }

  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 5% no-repeat, ${({ theme }) => theme.bg};
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-left: 5px;
  color: #888;
  font-size: 0.8em;
`;

export default DnDSidebar;