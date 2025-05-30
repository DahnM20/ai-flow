export type FilterItem = {
  name: string;
  slug: string;
};

type FilterGridProps = {
  filters: FilterItem[];
  selectedFilter: string;
  onSelectFilter: (slug: string) => void;
};

function FilterGrid({
  filters,
  selectedFilter,
  onSelectFilter,
}: FilterGridProps) {
  function getUpperCaseFirstCharString(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return (
    <div className="grid w-full grid-cols-1 gap-4 px-4">
      {filters &&
        filters.map((filter) => (
          <div
            key={filter.slug}
            className={`flex w-full flex-row items-center rounded-lg shadow-lg
                         ${filter.slug === selectedFilter ? "bg-zinc-700/70 hover:bg-zinc-500" : "bg-zinc-950/70 hover:bg-zinc-700"}
                         cursor-pointer py-1 transition-colors duration-300 ease-in-out`}
          >
            <p
              className="w-full overflow-hidden whitespace-nowrap px-4 text-center text-sm"
              onClick={() => onSelectFilter(filter.slug)}
            >
              {getUpperCaseFirstCharString(filter.name)}
            </p>
          </div>
        ))}
    </div>
  );
}

export default FilterGrid;
