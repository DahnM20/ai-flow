import React from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';

interface RightButtonProps {
  onClick: () => void;
  color?: string;
  icon?: React.ReactNode;
  text?: string;
  bottom?: string;
}

const RightIconButton: React.FC<RightButtonProps> = ({ onClick, color = '#808080', icon = <FiSettings />,  bottom = '30px' }) => {
  return (
    <StyledRightButton color={color} bottom={bottom} onClick={onClick}>
      <StyledIcon>{icon}</StyledIcon>
    </StyledRightButton>
  );
};

const StyledRightButton = styled.div<{ color: string, bottom: string }>`
  position: fixed;
  bottom: ${(props) => props.bottom};
  right: 0;
  width: 45px;
  height: 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 5px;
  padding-left: 10px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #313131;
  }
`;

const StyledIcon = styled.div`
  color: #fff;
  font-size: 20px;

  svg {
    vertical-align: middle;
  }
`;

export default RightIconButton;