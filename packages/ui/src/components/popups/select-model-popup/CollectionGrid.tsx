type CollectionItem = {
  name: string;
  slug: string;
};

type CollectionGridProps = {
  collections: CollectionItem[];
  selectedCollection: string;
  handleSelectCollection: (slug: string) => void;
};

function CollectionGrid({
  collections,
  selectedCollection,
  handleSelectCollection,
}: CollectionGridProps) {
  return (
    <div className="mb-5 grid w-full grid-cols-1 gap-4 p-4">
      {collections &&
        collections.map((collection) => (
          <div
            key={collection.slug}
            className={`flex w-full flex-row items-center shadow-lg
                         ${collection.slug === selectedCollection ? "bg-zinc-700/70 hover:bg-zinc-500" : "bg-zinc-950/70 hover:bg-zinc-700"}
                         cursor-pointer py-1 transition-colors`}
          >
            <p
              className="w-full overflow-hidden whitespace-nowrap px-4 text-center text-sm"
              onClick={() => handleSelectCollection(collection.slug)}
            >
              {collection.name}
            </p>
          </div>
        ))}
    </div>
  );
}

export default CollectionGrid;
