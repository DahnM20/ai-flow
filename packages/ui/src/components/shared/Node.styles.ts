import styled, { css, keyframes } from "styled-components";
import ReactFlow, {
  MiniMap,
  Controls,
  Panel,
  Handle,
} from 'reactflow';

import { createGlobalStyle } from 'styled-components';
import { darken } from "polished";
import { FiCopy } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

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
  padding: 2px;
  overflow: hidden;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme }) => theme.accent};
`;

export const NodeTitle = styled.div`
  font-size: 1.1em;
  font-weight: 600;
  display: flex;
  align-items: center;
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
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.nodeInputBg};
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.15);
  color: ${({ theme }) => theme.text};
  resize: vertical;
  min-height: 6rem;
  width: 100%;
  transition: all 0.3s ease;
`;

export const NodeIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;  
  height: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 1.5em;
`;

export const NodeContainer = styled.div`
  position: relative;
  width: 450px;
  
  background: ${({ theme }) => theme.nodeGradientBg};
  background-color: ${({ theme }) => theme.bg};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

export const NodeLogsText = styled.p`
  font-size: 1em;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

export const NodeLogs = styled.div<{ showLogs: boolean, noPadding?: boolean }>`
  border-radius: 0 0 8px 8px;
  font-size: 0.9em;
  line-height: 20px;
  padding: ${({ noPadding }) => noPadding ? '0px' : '10px 16px'};
  overflow: hidden;
  word-break: break-word;
  transition: height 0.2s ease-out background 0.3s ease;
  background: ${({ theme }) => theme.outputBg};
  color: ${({ theme }) => theme.accentText};
  cursor: pointer;
  max-height: 700px;
  overflow-y: auto;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;


export const OptionSelector = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: fit-content;
  height: fit-content;
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg};
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.1);
  padding: 3px;
  gap: 5px;
`;

export const OptionButton = styled.button<{ selected: boolean }>`
  flex-grow: 1;
  padding: 10px 10px;
  font-size: 1rem;
  background: ${({ selected, theme }) => selected ? theme.optionButtonBgSelected : null};
  color: ${({ selected, theme }) => selected ? theme.optionButtonColorSelected : theme.optionButtonColor};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-weight: bold; 

  &:hover {
    background-color: ${({ selected, theme }) => selected ? theme.optionButtonBg : darken(0.1, theme.optionButtonBg)};
    color: ${({ theme }) => theme.optionButtonColorSelected};
  }
`;


export const NodeSelect = styled.select`
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  background-color: ${({ theme }) => theme.nodeInputBg};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: ${({ theme }) => theme.text};
  resize: vertical;
  height: fit-content;
  transition: all 0.3s ease;
`;

export const NodeSelectOption = styled.option`
  padding: 10px 16px;
`;

export const ReactFlowStyled = styled(ReactFlow)`
  .react-flow__attribution {
    background: transparent;
  }
`;

export const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.minimapBg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }

  .react-flow__minimap-node {
    fill: ${(props) => props.theme.minimapMaskBg};
    stroke: none;
  }

  @media screen and (max-width: 768px) {
    display: none;
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
  color: ${(props) => props.theme.controlsColor};

  :hover{
    color: #000000;;
  }
`;

export const NodeInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.nodeInputBg};
  padding: 10px 16px;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

export const InputHandle = styled(Handle)`
  z-index: 45;
  background: #72c8fa;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border:none;
  box-shadow: 0 0 10px 2px rgba(114, 200, 250, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: #89d0fc;
    box-shadow: 0 0 15px 7px rgba(114, 200, 250, 0.5);
  }
`;

export const OutputHandle = styled(Handle)`
  z-index: 45;
  background: rgb(224, 166, 79);
  width: 10px;
  height: 10px;
  box-shadow: 0 0 10px 2px rgba(224, 166, 79, 0.3);
  border-radius: 0;
  border:none;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: rgb(234, 176, 89);
    box-shadow: 0 0 15px 7px rgba(224, 166, 79, 0.5);
  }
`;


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingIcon = styled(FaSpinner)`
  animation:  ${spin} 1s linear infinite;
  font-size: 16px;
`;
