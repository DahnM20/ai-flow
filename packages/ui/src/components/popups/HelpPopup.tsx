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
    <PopupContainer className='top-0 left-0 absolute bg-black/50 z-20 h-full w-full flex flex-col justify-center items-center' onClick={onClose}>
      <div className='w-2/4 shadow-xl' onClick={(e) => { e.stopPropagation() }}>
        <PopupHeader className='flex flex-row h-10 items-center justify-between py-2 px-4 text-xl text-slate-100 bg-[#8FB0A1]/95 border-b-2 border-[#86F0C2] rounded-t-md'>
          <div>Help</div>
          <div onClick={onClose} className='text-slate-300 hover:text-slate-50'>
            <FaWindowClose />
          </div>
        </PopupHeader>
        <PopupContent className='bg-zinc-900 text-slate-300 py-3 px-4 overflow-auto text-lg max-h-96'>
          <div className='flex flex-col justify-center items-center border-b-2 border-zinc-600/50 py-3 text-xl font-bold'>
            <div>
              {t('docAvailable')}
            </div>
            <div>
              <a href="https://docs.ai-flow.net/docs/intro" className='text-[#8FB0A1] hover:text-slate-100 hover:underline' target="_blank"> docs.ai-flow.net </a>
            </div>
          </div>
          <div className='flex justify-center py-2 text-xl font-bold'>
            {t("tipsSection")}
          </div>
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