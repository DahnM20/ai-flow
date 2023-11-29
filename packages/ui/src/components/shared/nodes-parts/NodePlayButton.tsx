import React, { useContext, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaCheck, FaPlay, FaSpinner, FaStop } from 'react-icons/fa';
import { NodeContext } from '../../providers/NodeProvider';
import TapScale from '../motions/TapScale';
import { LoadingIcon } from '../Node.styles';


interface NodePlayButtonProps {
  isPlaying?: boolean;
  hasRun?: boolean;
  onClick?: () => void;
  nodeName: string;
}

const NodePlayButton: React.FC<NodePlayButtonProps> = ({ isPlaying, hasRun, onClick, nodeName }) => {
  const { runNode, isRunning, currentNodesRunning } = useContext(NodeContext);
  const [isHovered, setHovered] = useState(false);

  const handleClick = () => {
    if (!isPlaying && !isRunning) {
      if (runNode(nodeName) && onClick) {
        onClick();
      }
    }
  }

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const isCurrentNodeRunning = isRunning && currentNodesRunning.includes(nodeName);
  const isDisabled = isCurrentNodeRunning && !isHovered;

  const IconComponent = getIconComponent(isPlaying, isCurrentNodeRunning, hasRun, isHovered);

  return (
    <NodePlayButtonContainer
      onClick={handleClick}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TapScale scale={0.5}>
        <IconComponent />
      </TapScale>
    </NodePlayButtonContainer>
  );
};


function getIconComponent(isPlaying: boolean | undefined, isCurrentNodeRunning: boolean, hasRun: boolean | undefined, isHovered: boolean) {
  if (isPlaying || isCurrentNodeRunning) return LoadingIcon;

  if (hasRun && !isHovered) return CheckIcon;

  return isCurrentNodeRunning ? NodeStopButtonIcon : NodePlayButtonIcon;
}


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

const CheckIcon = styled(FaCheck)`
  transition: transform 0.3s ease-in-out;
  font-size: 16px;
`;


export default NodePlayButton;