import styled from "styled-components";

interface GridProps<T> {
  items: T[];
  onValidate: (item: T) => boolean;
  renderItem: (item: T, onValidate: (item: T) => boolean) => JSX.Element;
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

const StyledGrid = styled.div<{ maxCols: number }>`
  display: grid;
  width: 100%;
  gap: 1rem;
  ${({ maxCols }) => getGridTemplateColumns(maxCols)}
`;

export default function Grid<T>({
  items,
  onValidate,
  renderItem,
  numberColMax = 5,
  ...props
}: GridProps<T>) {
  return (
    <StyledGrid maxCols={numberColMax} {...props}>
      {items && items.map((item) => renderItem(item, onValidate))}
    </StyledGrid>
  );
}
