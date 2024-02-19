interface GridProps<T> {
  items: T[];
  renderItem: (item: T, onValidate: (id: string) => void) => JSX.Element;
  onValidate: (id: string) => void;
}

export default function Grid<T>({
  items,
  onValidate,
  renderItem,
}: GridProps<T>) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {items && items.map((item) => renderItem(item, onValidate))}
    </div>
  );
}
