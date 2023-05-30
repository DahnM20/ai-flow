import styled, { css } from "styled-components";
import ReactFlow, {
  MiniMap,
  Controls,
  Panel,
} from 'reactflow';

import { createGlobalStyle } from 'styled-components';
import { darken } from "polished";
import { FiCopy } from "react-icons/fi";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;

export const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  background-color: ${({ theme }) => theme.nodeBg};
  padding: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
`;

export const NodeBand = styled.div`
  padding: 5px;
  overflow: hidden;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme }) => theme.accent};
  cursor: pointer;
`;

export const NodeWrapper = styled.div`
  position: relative;
  resize: both;
  background-color: ${({ theme }) => theme.nodeBg};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

export const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-left: 10px;
  color: ${({ theme }) => theme.text};
`;

export const NodeContent = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.text};
`;

export const NodeForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NodeLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const NodeTextarea = styled.textarea`
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.nodeInputBg};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 80px;
  max-height: 300px;
  transition: all 0.3s ease;
`;

export const NodeIcon = styled.div`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.text};
`;

export const NodeContainer = styled.div`
  position: relative;
  min-width: 400px;
  resize: both;
  background-color: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

export const NodeLogsText = styled.p`
  font-size: 1em;
  padding: 10px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

export const NodeLogs = styled.div<{ showLogs: boolean }>`
  border-radius: 0 0 8px 8px;
  font-size: 0.85em;
  padding: 10px;
  overflow: hidden;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme }) => theme.outputBg};
  color: ${({ theme }) => theme.accentText};
  cursor: pointer;
  max-width: 700px;

  ${({ showLogs }) =>
    showLogs
      ? css`
          height: fit-content;
        `
      : css`
          height: 0;
        `};
`;


export const OptionSelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg};
`;

export const OptionButton = styled.button<{ selected: boolean }>`
  flex-grow: 1;
  padding: 10px;
  background-color: ${({ selected, theme }) => selected ? theme.nodeInputBg : theme.bg};
  color: ${({ selected, theme }) => selected ? theme.accentText : theme.text};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: bold; 

  &:hover {
    background-color: ${({ selected, theme }) => selected ? theme.nodeInputBg : darken(0.1, theme.bg)};
    color: ${({ theme }) => theme.accentText};
  }
`;

export const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;

export const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.bg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${(props) => props.theme.nodeBg};
    stroke: none;
  }
`;

export const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    path {
      fill: currentColor;
    }
  }
`;

export const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CopyIcon = styled(FiCopy)`
  color: #000000;
`;