import DefaultPopup from './DefaultPopup';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

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
        <DefaultPopup onClose={onClose} show={show} centered>
            <div className='flex flex-col relative bg-zinc-900 shadow text-slate-200 rounded-xl p-10 overflow-auto my-15'>
                <div className='absolute top-0 right-0 p-4 text-2xl'>
                    <button onClick={onClose} className='hover:text-red-500'>
                        <MdClose />
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-6">{versionInfo.description}</h2>
                <ul className="list-disc list-inside mb-6 space-y-3">
                    {!!features && features.map((feature, index) => (
                        <li key={index} className="text-base">
                            <span className='font-medium text-sky-500'>{feature.title}</span>
                            {feature?.description && ` : ${feature.description}`}
                        </li>
                    ))}
                </ul>
                {
                    imageSrc && (
                        <div className='flex justify-center mb-4'>
                            <img src={imageSrc} alt="Version Updates" className="rounded-md max-w-full h-auto" />
                        </div>
                    )
                }
            </div >
        </DefaultPopup >)
};