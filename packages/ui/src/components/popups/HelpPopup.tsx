import React from 'react';
import styled from 'styled-components';
import { FaWindowClose } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("tips");

  const tips: string[] = t('tips', { returnObjects: true });

  if (!isOpen) return null;

  return (
    <PopupContainer className='top-0 left-0 absolute bg-black/50 z-20 h-full w-full flex flex-col justify-center items-center'>
      <PopupHeader className='flex flex-row mx-auto justify-center items-center gap-x-2 py-2 px-4 text-xl text-slate-100 bg-[#6576f8] rounded-t-sd'>
        <div>Help</div>
        <div onClick={onClose}>
          <FaWindowClose />
        </div>
      </PopupHeader>
      <PopupContent className='bg-gray-800 text-slate-200 py-3 px-4 overflow-auto text-lg max-h-96'>
        <PopupTipList>
          {tips.map((tip, index) => (
            <PopupTip key={index} className='py-2'>{tip}</PopupTip>
          ))}
        </PopupTipList>
      </PopupContent>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
`;

const PopupHeader = styled.div`
`;


const PopupTipList = styled.ul`
`;

const PopupContent = styled.div`
`;

const PopupTip = styled.li`
`;

export default HelpPopup;