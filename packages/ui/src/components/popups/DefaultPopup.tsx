import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LoadingIcon } from '../shared/Node.styles';

interface DefaultPopupProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function DefaultPopup({ show, onClose, children }: DefaultPopupProps) {

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className='flex flex-col fixed bg-black/50 w-full h-full top-0 left-0 justify-center items-center z-50' onClick={onClose}>
            <div className='flex flex-col justify-center items-center w-4/6 max-h-full' onClick={(e) => { e.stopPropagation() }}>
                {children}
            </div>
        </div >,
        document.body
    );
};