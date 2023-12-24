import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useCachedFetch from '../../hooks/useCachedFetch';
import { LoadingIcon } from '../shared/Node.styles';
import { getRestApiUrl } from '../../utils/config';

interface NodePopupProps {
    show: boolean;
    onClose: () => void;
    onValidate: (data: any) => void;
}

export default function NodePopup({ show, onClose, onValidate }: NodePopupProps) {

    const [models, setModels] = useState<any>()
    const [loading, setLoading] = useState(false)

    const { fetchCachedData } = useCachedFetch()

    useEffect(() => {
        async function getModels() {
            try {
                const url = `${getRestApiUrl()}/node/models`;
                const data = await fetchCachedData(url, `replicate_models`, 600000, {});
                return data;
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        }

        async function configurePopup() {
            setLoading(true)
            const models = await getModels()
            const extractedData = models.results.map((result: { default_example: { model: any; }; cover_image_url: any; description: any; }) => {
                return {
                    modelName: result.default_example.model,
                    coverImage: result.cover_image_url,
                    description: result.description
                };
            }).filter((model: any) => {
                return model.description != null && model.coverImage != null
            });
            setModels(extractedData)
            setLoading(false)
        }

        if (!!models) return;

        configurePopup()

    }, [])

    if (!show) return null;

    if (loading) return (
        <LoadingIcon className='ml-5' />
    )


    return ReactDOM.createPortal(
        <div className='flex flex-col fixed bg-black/50 w-full h-full top-0 left-0 justify-center items-center z-50' onClick={onClose}>
            <div className='bg-zinc-900 shadow text-slate-200 w-4/6 rounded-xl p-5 overflow-auto my-4' onClick={(e) => { e.stopPropagation() }}>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full'>
                    {
                        models && models.map((model: { modelName: string; coverImage: string; description: string; }) => {

                            const realModelName = model.modelName.includes('/')
                                ? model.modelName.split('/')[1]
                                : model.modelName

                            const authorName = model.modelName.includes('/')
                                ? model.modelName.split('/')[0]
                                : ""

                            return (
                                <div key={model.modelName}
                                    className='flex flex-row items-center shadow-lg shadow-black/30 w-full hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer '
                                    onClick={() => onValidate(model.modelName)}>

                                    <img src={model.coverImage || 'default-image-url.jpg'}
                                        alt={model.modelName} className='flex w-1/4 h-full  object-cover rounded-l-lg ' />

                                    <div className='flex flex-col h-full w-full '>
                                        <div className='flex flex-row text-md text-left bg-zinc-950/70 space-x-1
                                                            w-full px-2 overflow-hidden whitespace-nowrap rounded-tr-lg'>
                                            <p className='opacity-30'>{authorName + " /"}</p>
                                            <p className=''>{realModelName}</p>
                                        </div>
                                        <p className='text-xs text-slate-300 p-2 text-left'>{model.description}</p>
                                    </div>
                                </div>
                            );

                        })
                    }
                </div>
            </div>
        </div>,
        document.body
    );
};