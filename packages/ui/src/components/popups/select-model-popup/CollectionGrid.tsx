
type CollectionItem = {
    name: string;
    slug: string;
};

type CollectionGridProps = {
    collections: CollectionItem[];
    selectedCollection: string;
    handleSelectCollection: (slug: string) => void;
};

function CollectionGrid({ collections, selectedCollection, handleSelectCollection }: CollectionGridProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 w-full p-4 mb-5'>
            {collections && collections.map(collection => (
                <div key={collection.slug}
                    className={`flex flex-row items-center shadow-lg w-full
                         ${collection.slug === selectedCollection ? "bg-zinc-700/70 hover:bg-zinc-500" : "bg-zinc-950/70 hover:bg-zinc-700"}
                         transition-colors cursor-pointer py-1`}>
                    <p className='text-sm text-center w-full px-4 overflow-hidden whitespace-nowrap'
                        onClick={() => handleSelectCollection(collection.slug)}>
                        {collection.name}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CollectionGrid;
