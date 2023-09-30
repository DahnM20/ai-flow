import React, { memo } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';

interface RightButtonProps {
  onClick: () => void;
  color?: string;
  icon?: React.ReactNode;
  text?: string;
  bottom?: string;
}

const RightIconButton: React.FC<RightButtonProps> = ({ onClick, color = '#808080', icon = <FiSettings />, bottom = '30px' }) => {
  return (
    <StyledRightButton className="fixed right-0 w-11 rounded-l-lg py-1 mx-auto items-center pl-1 hover:bg-slate-700" color={color} bottom={bottom} onClick={onClick}>
      <div className='text-slate-200 fon align-middle text-xl'>{icon}</div>
    </StyledRightButton>
  );
};

const StyledRightButton = styled.div<{ color: string, bottom: string }>`
  bottom: ${(props) => props.bottom};
  background-color: ${(props) => props.color};
`;

export default memo(RightIconButton);