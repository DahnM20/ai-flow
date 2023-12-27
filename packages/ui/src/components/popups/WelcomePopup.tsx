import React, { useState, useRef, useEffect } from 'react';
import DefaultPopup from './DefaultPopup';
import { useTranslation } from 'react-i18next';

type Feature = {
    title: string;
    description: string;
}

type VersionInfo = {
    versionNumber: string;
    description: string;
}

interface WelcomePopupProps {
    show: boolean;
    onClose: () => void;
}
export default function WelcomePopup({ show, onClose }: WelcomePopupProps) {

    const { t } = useTranslation('version');

    const versionInfo = t('versionInfo', { returnObjects: true }) as VersionInfo;
    const features = t('features', { returnObjects: true }) as Feature[];
    const imageSrc = t('imageSrc');


    return (
        <DefaultPopup onClose={onClose} show={show}>
            <div className='flex flex-col bg-zinc-900 shadow text-slate-200 rounded-xl p-5 overflow-auto my-4' >
                <h2 className="text-lg font-semibold mb-4">What's New in Version {versionInfo.versionNumber}</h2>
                {versionInfo.description && <p className="mb-3">{versionInfo.description}</p>}
                <ul className="list-disc list-inside mb-4">
                    {!!features && features.map((feature, index) => (
                        <li key={index}>{feature.title} {!!feature?.description ? `: ${feature.description}` : ""}</li>
                    ))}
                </ul>
                {imageSrc && <div className="flex justify-center">
                    <img src={imageSrc} alt="Version Updates" className="rounded-md mb-4" />
                </div>}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </DefaultPopup>)
};