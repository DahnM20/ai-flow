import React, { useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaCheck, FaPlay, FaSpinner, FaStop } from 'react-icons/fa';
import { NodeContext } from '../providers/NodeProvider';


interface NodePlayButtonProps {
  isPlaying?: boolean;
  hasRun?: boolean;
  onClick?: () => void;
  nodeName: string;
}

const NodePlayButton: React.FC<NodePlayButtonProps> = ({ isPlaying, hasRun, onClick, nodeName }) => {

  const { runNode, isRunning, currentNodeRunning } = useContext(NodeContext);

  function handleClick() {
    if (isPlaying || isRunning) return;

    if (onClick) {
      onClick();
    }
    runNode(nodeName);
  }

  return (
    <NodePlayButtonContainer
      onClick={() => handleClick()}
      disabled={isRunning && currentNodeRunning !== nodeName}
    >
      {
        isPlaying || (isRunning && currentNodeRunning === nodeName)
          ? <LoadingIcon />
          : (isRunning
            ? hasRun ? <GreenCheckIcon/> : <NodeStopButtonIcon />
            : hasRun ? <GreenCheckIcon/> : <NodePlayButtonIcon />
          )
      }
    </NodePlayButtonContainer>
  );
};



// Animation de rotation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const NodePlayButtonContainer = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: ${props => props.disabled ? '#888' : '#7bb380'};

  &:hover {
    color: ${props => props.disabled ? '#888' : '#57ff2d'};
  }
`;

const NodePlayButtonIcon = styled(FaPlay)`
  transition: transform 0.3s ease-in-out;
  font-size: 16px;
`;

const NodeStopButtonIcon = styled(FaStop)`
  transition: transform 0.3s ease-in-out;
  font-size: 16px;
`;

const GreenCheckIcon = styled(FaCheck)`
  transition: transform 0.3s ease-in-out;
  font-size: 16px;
`;


const LoadingIcon = styled(FaSpinner)`
  animation:  ${spin} 1s linear infinite;
  font-size: 16px;
`;

export default NodePlayButton;