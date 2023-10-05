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
      <div className='w-2/4 shadow-xl'>
        <PopupHeader className='flex flex-row h-10 items-center justify-between py-2 px-4 text-xl text-slate-100 bg-slate-800 border-b-2 border-slate-400 rounded-t-md'>
          <div>Help</div>
          <div onClick={onClose} className='text-slate-300 hover:text-slate-50'>
            <FaWindowClose />
          </div>
        </PopupHeader>
        <PopupContent className='bg-zinc-800 text-slate-300 py-3 px-4 overflow-auto text-lg max-h-96'>
          <PopupTipList>
            {tips.map((tip, index) => (
              <PopupTip key={index} className='py-3'>{tip}</PopupTip>
            ))}
          </PopupTipList>
        </PopupContent>
      </div>
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