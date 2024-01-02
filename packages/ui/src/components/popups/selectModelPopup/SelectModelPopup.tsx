import { useState, useEffect } from 'react';
import useCachedFetch, { CACHE_PREFIX, DISPENSABLE_CACHE_PREFIX } from '../../../hooks/useCachedFetch';
import { LoadingIcon } from '../../shared/Node.styles';
import { getRestApiUrl } from '../../../utils/config';
import DefaultPopup from '../DefaultPopup';
import ModelsGrid from './ModelsGrid';
import CollectionGrid from './CollectionGrid';
import LoadMoreButton from './LoadMoreButton';

interface SelectModelPopupProps {
    show: boolean;
    onClose: () => void;
    onValidate: (data: any) => void;
}

export default function SelectModelPopup({ show, onClose, onValidate }: SelectModelPopupProps) {

    const [models, setModels] = useState<any>()
    const [highlitedModels, setHighlightedModels] = useState<any>()
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
                const data = await fetchCachedData(url, `${CACHE_PREFIX}_replicate_collections`, 600000, {});
                return data.results;
            } catch (error) {
                console.error('Error fetching configuration:', error);
            }
        }

        async function configurePopup() {
            setOpening(true)
            const collections = await getCollections()
            const models = await getPublicModels()
            const highlightedModels = await getHighlightedModels()
            const extractedData = extractModelsData(models);
            const extractedHighlightedModels = extractModelsData(highlightedModels);
            setModels(extractedData)
            setHighlightedModels(extractedHighlightedModels)
            setCollections(collections)
            setOpening(false)
        }

        if (!!models) return;

        configurePopup()

    }, [])

    useEffect(() => {
        if (!selectedCollection) return

        const loadCollectionModels = async () => {
            setLoading(true)
            const models = await getCollectionModels(selectedCollection)
            const extractedData = extractModelsData(models);
            setModels(extractedData)
            setLoading(false)
        }

        loadCollectionModels()

    }, [selectedCollection])


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
            const data = await fetchCachedData(url, `${CACHE_PREFIX}_replicate_models${!!cursor ? "_" + cursor : ''}`, 600000, {});
            updateCursorFromResponse(data.public)
            return data.public.results;
        } catch (error) {
            console.error('Error fetching configuration:', error);
        }
    }

    async function getHighlightedModels() {
        try {
            let url = `${getRestApiUrl()}/node/models`;
            const data = await fetchCachedData(url, `${CACHE_PREFIX}_replicate_models`, 600000, {});
            return data.highlighted;
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

            const cacheId = `${DISPENSABLE_CACHE_PREFIX}_replicate_${collectionName}_models${!!cursor ? "_" + cursor : ''}`
            const data = await fetchCachedData(url, cacheId, 600000, {});
            updateCursorFromResponse(data)
            return data.models;
        } catch (error) {
            console.error('Error fetching configuration:', error);
        }
    }

    async function handleSelectCollection(collectionName: string) {
        setModels([])
        setCursor("")
        setSelectedCollection(collectionName)
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

    const renderModelSections = () => {
        if (!selectedCollection) {
            return (
                <>
                    <ModelsSection title="Spotlight Models" models={highlitedModels} onValidate={onValidate} />
                    <ModelsSection title="All Models" models={models} onValidate={onValidate} />
                </>
            );
        }
        return <ModelsSection models={models} onValidate={onValidate} />;
    };


    if (opening) return (
        <LoadingIcon className='ml-5' />
    )

    if (!models && !collections) return null


    return (
        <DefaultPopup onClose={onClose} show={show}>
            <div className='flex flex-col bg-zinc-900 shadow text-slate-200 w-full rounded-xl p-5 overflow-auto my-4 space-y-3' >

                <CollectionGrid
                    collections={collections}
                    selectedCollection={selectedCollection}
                    handleSelectCollection={handleSelectCollection}
                />

                {renderModelSections()}

                <LoadMoreButton loading={loading} cursor={cursor} onLoadMore={handleLoadMore} />
            </div>
        </DefaultPopup>)
};


interface ModelSectionProps {
    title?: string;
    models: any;
    onValidate: (data: any) => void;
}

const ModelsSection = ({ title, models, onValidate }: ModelSectionProps) => (
    <>
        {
            title && <h2>{title}</h2>
        }
        <ModelsGrid models={models} onValidate={onValidate} />
    </>
);
