import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { NodeType } from '../../utils/mappings';
import { Tooltip } from 'react-tooltip';
import { FaInfoCircle } from 'react-icons/fa';

type DnDNode = {
  label: string;
  type: NodeType;
  helpMessage?: string;
};

type NodeSection = {
  section: string;
  nodes: DnDNode[];
};

const DnDSidebar = () => {
  const { t } = useTranslation('flow');

  const nodeTypes: NodeSection[] = [
    {
      section: 'Input',
      nodes: [
        { label: 'Text', type: 'input', helpMessage: 'inputHelp' },
        { label: 'URL', type: 'url_input', helpMessage: 'urlInputHelp' },
        { label: 'YoutubeVideo', type: 'youtube-transcript', helpMessage: 'youtubeTranscriptHelp' },
      ],
    },
    {
      section: 'Models',
      nodes: [
        { label: 'GPT', type: 'gpt', helpMessage: 'gptHelp' },
        { label: 'GPTPrompt', type: 'gpt-prompt', helpMessage: 'gptPromptHelp' },
        { label: 'NoContextPrompt', type: 'gpt-no-context-prompt', helpMessage: 'noContextPromptHelp' }
      ],
    },
    {
      section: 'ImageGeneration',
      nodes: [{ label: 'DALL-E', type: 'dalle-prompt', helpMessage: 'dallePromptHelp' }],
    },
    {
      section: 'Tools',
      nodes: [{ label: t('DataSplitter'), type: 'data-splitter', helpMessage: 'dataSplitterHelp' }],
    },
  ];

  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <DnDSidebarContainer>
        {nodeTypes.map((section, index) => (
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
  font-size: 13px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.nodeBg};
  }

  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%) right / 10% no-repeat, ${({ theme }) => theme.bg};
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-left: 5px;   // ajoute une marge à gauche pour éloigner l'icône du label
  color: #888;  // change la couleur de l'icône
  font-size: 0.8em;  // change la taille de l'icône
`;

export default DnDSidebar;