import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { NodeType } from '../../utils/mappings';

type DnDNode = {
  label: string;
  type: NodeType;
};

type NodeSection = {
  section: string;
  nodes: DnDNode[];
};

const DnDSidebar = () => {
  const { t } = useTranslation('flow');

  const nodeTypes: NodeSection[] = [
    {
      section: t('Input'),
      nodes: [
        { label: t('Text'), type: 'input' },
        { label: t('URL'), type: 'url_input' },
        { label: t('YoutubeVideo'), type: 'youtube-transcript' },
      ],
    },
    {
      section: t('Models'),
      nodes: [
        { label: t('GPT'), type: 'gpt' },
        { label: t('GPTPrompt'), type: 'gpt-prompt' },
        { label: t('NoContextPrompt'), type: 'gpt-no-context-prompt' }
      ],
    },
    {
      section: t('ImageGeneration'),
      nodes: [{ label: 'DALL-E', type: 'dalle-prompt' }],
    },
    {
      section: t('Tools'),
      nodes: [{ label: t('DataSplitter'), type: 'data-splitter' }],
    },
  ];

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <DnDSidebarContainer>
      {nodeTypes.map((section, index) => (
        <Section key={index}>
          <SectionTitle>{section.section}</SectionTitle>
          {section.nodes.map((node, nodeIndex) => (
            <Node
              key={nodeIndex}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              {node.label}
            </Node>
          ))}
        </Section>
      ))}
    </DnDSidebarContainer>
  );
};

const DnDSidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 9vw;
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
  height: 45px;
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
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.nodeBg};
  }

  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 10% no-repeat, ${({ theme }) => theme.bg};
`;

export default DnDSidebar;