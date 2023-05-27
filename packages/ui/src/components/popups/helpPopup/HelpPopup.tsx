import React from 'react';
import styled from 'styled-components';
import { FaWindowClose } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import { tips } from '../../../utils/tips';

interface HelpPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <PopupContainer>
            <PopupHeader>
                <PopupTitle>Help</PopupTitle>
                <PopupCloseButton onClick={onClose}>
                    <FaWindowClose />
                </PopupCloseButton>
            </PopupHeader>
            <PopupContent>
            <PopupTipList>
                {tips.map((tip, index) => (
                    <PopupTip key={index}>{tip}</PopupTip>
                ))}
                </PopupTipList>
            </PopupContent>
        </PopupContainer>
    );
};

const PopupContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #a3a2fc;
`;

const PopupTitle = styled.h3`
  margin: 0;
  color: #fff;
`;

const PopupCloseButton = styled.button`
  border: none;
  background-color: transparent;
  font-size: 1.2rem;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #d4d4d4;
  }
`;

const PopupTipList = styled.ul`
  margin: 10px 0;
`;

const PopupContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const PopupTip = styled.li` // TODO
  margin: 10px 0;
  padding-bottom: 10px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  list-style-type: disc;
`;

export default HelpPopup;