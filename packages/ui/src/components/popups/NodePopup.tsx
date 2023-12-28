import React, { useState, useRef, useEffect } from 'react';
import useCachedFetch from '../../hooks/useCachedFetch';
import { LoadingIcon } from '../shared/Node.styles';
import { getRestApiUrl } from '../../utils/config';
import DefaultPopup from './DefaultPopup';

interface NodePopupProps {
    show: boolean;
    onClose: () => void;
    onValidate: (data: any) => void;
}

export default function NodePopup({ show, onClose, onValidate }: NodePopupProps) {

    const [models, setModels] = useState<any>()
    const [collections, setCollections] = useState<any>()
    const [selectedCollection, setSelectedCollection] = useState<any>()
    const [opening, setOpening] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cursor, setCursor] = useState("")

    const { fetchCachedData } = useCachedFetch()



    useEffect(() => {


        async function getCollections() {
            try {
                const url = `${getRestApiUrl()}/node/collections`;
                const data = await fetchCachedData(url, `replicate_collections`, 600000, {});
                return data.results;
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        }

        async function configurePopup() {
            setOpening(true)
            const collections = await getCollections()
            const models = await getPublicModels()
            const extractedData = extractModelsData(models);
            setModels(extractedData)
            setCollections(collections)
            setOpening(false)
        }

        if (!!models) return;

        configurePopup()

    }, [])


    function updateCursorFromResponse(response: any) {
        if (response?.next)
            setCursor(response.next.split('?cursor=')[1])
        else
            setCursor("")
    }

    function appendCursorToUrl(url: string) {
        if (cursor != null && cursor != "")
            return `${url}?cursor=${cursor}`
        return url
    }

    async function getPublicModels() {
        try {
            let url = `${getRestApiUrl()}/node/models`;
            if (cursor != null && cursor != "")
                url = appendCursorToUrl(url)
            const data = await fetchCachedData(url, `replicate_models_${cursor}`, 600000, {});
            updateCursorFromResponse(data)
            return data.results;
        } catch (error) {
            console.error('Error fetching configuration:', error);
        }
    }

    function extractModelsData(models: any) {
        return models?.map((result: { default_example: { model: string; }; cover_image_url: string; description: string; name: string, owner: string, run_count: number }) => {
            return {
                modelName: result.owner + '/' + result.name,
                coverImage: result.cover_image_url,
                description: result.description,
                runCount: result.run_count,
            };
        }).filter((model: any) => {
            return !!model && model.description != null && model.coverImage != null;
        });
    }

    async function getCollectionModels(collectionName: string) {
        try {
            let url = `${getRestApiUrl()}/node/collections/${collectionName}`;

            if (cursor != null && cursor != "")
                url = appendCursorToUrl(url)

            const data = await fetchCachedData(url, `replicate_${collectionName}_models_${cursor}`, 600000, {});
            updateCursorFromResponse(data)
            return data.models;
        } catch (error) {
            console.error('Error fetching configuration:', error);
        }
    }

    async function handleSelectCollection(collectionName: string) {
        setSelectedCollection(collectionName)
        setModels([])
        setCursor("")
        setLoading(true)
        const models = await getCollectionModels(collectionName)
        const extractedData = extractModelsData(models);
        setModels(extractedData)
        setLoading(false)
    }

    async function handleLoadMore() {
        setLoading(true)
        let newModels: any[] = []
        if (selectedCollection) {
            const models = await getCollectionModels(selectedCollection)
            newModels = extractModelsData(models);
        } else {
            const models = await getPublicModels()
            newModels = extractModelsData(models);
        }
        setModels([...models, ...newModels])
        setLoading(false)
    }


    if (opening) return (
        <LoadingIcon className='ml-5' />
    )


    return (
        <DefaultPopup onClose={onClose} show={show}>
            <div className='flex flex-col bg-zinc-900 shadow text-slate-200 w-full rounded-xl p-5 overflow-auto my-4 space-y-3' >
                <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full p-4 mb-5'>
                    {
                        collections && collections.map((collection: { name: string; slug: string }) => {

                            return (
                                <div key={collection.slug}
                                    className={`flex flex-row items-center shadow-lg w-full
                                    ${collection.slug === selectedCollection ? "bg-zinc-700/70  hover:bg-zinc-500 " : "bg-zinc-950/70  hover:bg-zinc-700"}
                                    transition-colors cursor-pointer py-1`}>
                                    <p className='text-sm text-center
                                                    w-full px-4 overflow-hidden whitespace-nowrap' onClick={() => handleSelectCollection(collection.slug)}>
                                        {collection.name}
                                    </p>
                                </div>
                            );
                        })
                    }
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full'>
                    {
                        models && models.map((model: { modelName: string; coverImage: string; description: string; runCount: number }) => {

                            const realModelName = model.modelName.includes('/')
                                ? model.modelName.split('/')[1]
                                : model.modelName

                            const authorName = model.modelName.includes('/')
                                ? model.modelName.split('/')[0]
                                : ""

                            return (
                                <div key={model.modelName}
                                    className='flex flex-row items-center shadow-lg shadow-black/30 w-full hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer overflow-hidden'
                                    onClick={() => onValidate(model.modelName)}>

                                    <img src={model.coverImage || 'default-image-url.jpg'}
                                        alt={model.modelName} className='flex w-1/4 h-full  object-cover rounded-l-lg ' />

                                    <div className='flex flex-col h-full w-full '>
                                        <div className='flex flex-row text-md text-left bg-zinc-950/70 space-x-1
                                                            w-full px-2 overflow-hidden whitespace-nowrap rounded-tr-lg items-center'>
                                            <p className=' text-xs opacity-30'>{authorName + " /"}</p>
                                            <p className=' text-sm'>{realModelName}</p>
                                        </div>
                                        <div className='flex flex-col justify-between flex-grow'>
                                            <p className='text-xs text-slate-300 p-2 text-left'>{model.description}</p>
                                            <p className='text-xs text-slate-400 p-3'>{model.runCount}</p>
                                        </div>
                                    </div>
                                </div>
                            );

                        })
                    }
                </div>

                {

                    <div className='flex w-full justify-center'>
                        {loading
                            ? <LoadingIcon className='ml-5 w-full flex justify-center items-center' />
                            : <>
                                {
                                    cursor != null && cursor != "" &&
                                    <div className='bg-zinc-950/70 text-center text-md text-slate-200 w-1/4 py-1' onClick={handleLoadMore}>
                                        Load more
                                    </div>
                                }
                            </>
                        }
                    </div>
                }
            </div>
        </DefaultPopup>)
};