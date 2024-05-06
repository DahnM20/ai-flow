const colorList = [
  "transparent",
  "chocolate",
  "firebrick",
  "cyan",
  "greenyellow",
  "gold",
  "blueviolet",
  "magenta",
];

interface ColorSelectorProps {
  onChangeColor: (color: string) => void;
}

export default function ColorSelector({ onChangeColor }: ColorSelectorProps) {
  return (
    <>
      {colorList.map((color, index) => (
        <div
          key={index}
          className="h-4 w-4 rounded-full ring-slate-200 transition-all duration-150 ease-in-out hover:ring-2"
          style={{
            backgroundColor: color,
          }}
          onClick={() => onChangeColor(color)}
        />
      ))}
    </>
  );
}
