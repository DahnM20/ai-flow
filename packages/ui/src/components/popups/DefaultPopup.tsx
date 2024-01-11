import React from 'react';
import ReactDOM from 'react-dom';

interface DefaultPopupWrapperProps {
    show: boolean;
    onClose: () => void;
    centered?: boolean;
    children: React.ReactNode;
}

export default function DefaultPopupWrapper({ show, onClose, centered, children }: DefaultPopupWrapperProps) {

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className='flex flex-col fixed bg-black/50 w-full h-full top-0 left-0 justify-center items-center z-50'
            onClick={onClose} onTouchEnd={onClose}>
            <div className={`flex flex-col items-center w-10/12 md:w-4/6 max-h-full ${centered ? '' : 'mb-auto'}`}
                onClick={(e) => { e.stopPropagation() }} onTouchEnd={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div >,
        document.body
    );
};