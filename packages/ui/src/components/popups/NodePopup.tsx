import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface NodePopupProps {
    show: boolean;
    children: React.ReactNode;
    onClose: () => void;
    onValidate: (data: any) => void;
}

export default function NodePopup({ show, onClose, onValidate, children }: NodePopupProps) {

    const [models, setModels] = useState<any>()

    useEffect(() => {
        async function getModels() {
            try {
                const url = 'http://localhost:5000/node/models';
                const response = await axios.get(url);
                return response.data;
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        }

        async function configurePopup() {
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
        }

        if (!!models) return;

        configurePopup()

    }, [])

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className='flex flex-col fixed bg-black/50 w-full h-full top-0 left-0 justify-center items-center z-50'>
            <div className='bg-zinc-900 shadow text-slate-200 w-4/6 rounded-xl p-5 overflow-auto'>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full'>
                    {
                        models && models.map((model: { modelName: string; coverImage: string; description: string; }) => {
                            return (
                                <div key={model.modelName}
                                    className='flex flex-row items-center shadow-lg shadow-black/30 w-full hover:bg-zinc-700 '
                                    onClick={() => onValidate(model.modelName)}>

                                    <img src={model.coverImage || 'default-image-url.jpg'} alt={model.modelName} className='w-1/4 h-full  object-cover ' />

                                    <div className='flex flex-col h-full w-full'>
                                        <p className='text-xs text-left bg-zinc-950/50 w-full px-2 overflow-hidden whitespace-nowrap'>{model.modelName}</p>

                                        <p className='text-xs text-slate-300 p-2 text-left'>{model.description}</p>
                                    </div>
                                </div>
                            );

                        })
                    }
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        document.body
    );
};