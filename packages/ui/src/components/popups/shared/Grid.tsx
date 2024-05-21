import styled from "styled-components";

interface GridProps<T> {
  items: T[];
  renderItem: (item: T, onValidate: (id: string) => void) => JSX.Element;
  onValidate: (id: string) => void;
  numberColMax?: number;
}

const getGridTemplateColumns = (maxCols: number) => {
  return `
    grid-template-columns: repeat(1, minmax(0, 1fr));
    @media (min-width: 640px) {
      grid-template-columns: repeat(${Math.min(2, maxCols)}, minmax(0, 1fr));
    }
    @media (min-width: 768px) {
      grid-template-columns: repeat(${Math.min(3, maxCols)}, minmax(0, 1fr));
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(${Math.min(4, maxCols)}, minmax(0, 1fr));
    }
    @media (min-width: 1280px) {
      grid-template-columns: repeat(${maxCols}, minmax(0, 1fr));
    }
  `;
};

export default function Grid<T>({
  items,
  onValidate,
  renderItem,
  numberColMax = 2,
}: GridProps<T>) {
  return (
    <StyledGrid maxCols={numberColMax}>
      {items && items.map((item) => renderItem(item, onValidate))}
    </StyledGrid>
  );
}

const StyledGrid = styled.div<{ maxCols: number }>`
  display: grid;
  width: 100%;
  gap: 1rem;
  ${({ maxCols }) => getGridTemplateColumns(maxCols)}
`;
