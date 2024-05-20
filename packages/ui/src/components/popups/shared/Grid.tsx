interface GridProps<T> {
  items: T[];
  renderItem: (item: T, onValidate: (id: string) => void) => JSX.Element;
  onValidate: (id: string) => void;
  numberColMax?: number;
}

export default function Grid<T>({
  items,
  onValidate,
  renderItem,
  numberColMax = 5,
  ...props
}: GridProps<T>) {
  const getGridColsClass = (maxCols: number) => {
    const colsClasses = [
      `grid-cols-1`,
      `sm:grid-cols-${Math.min(2, maxCols)}`,
      `md:grid-cols-${Math.min(3, maxCols)}`,
      `lg:grid-cols-${Math.min(4, maxCols)}`,
      `xl:grid-cols-${maxCols}`,
    ];
    return colsClasses.join(" ");
  };
  return (
    <div className={`grid w-full gap-4 ${getGridColsClass(numberColMax)}`}>
      {items && items.map((item) => renderItem(item, onValidate))}
    </div>
  );
}
