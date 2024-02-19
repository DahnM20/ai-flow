import { ModelData } from "./SelectModelPopup";

interface ModelProps {
  model: ModelData;
  onValidate: (modelName: string) => void;
}

export function Model({ model, onValidate }: ModelProps) {
  const realModelName = model.modelName.includes("/")
    ? model.modelName.split("/")[1]
    : model.modelName;

  const authorName = model.modelName.includes("/")
    ? model.modelName.split("/")[0]
    : "";

  return (
    <div
      key={model.modelName}
      className="flex h-32 w-full cursor-pointer flex-row overflow-hidden rounded-lg shadow-lg shadow-black/30 transition-colors hover:bg-zinc-700"
      onClick={() => onValidate(model.modelName)}
    >
      <img
        src={model.coverImage || "default-image-url.jpg"}
        alt={model.modelName}
        className="flex h-full w-1/4  rounded-l-lg object-cover "
      />

      <div className="flex h-full w-full flex-col ">
        <div
          className="text-md flex w-full flex-row items-center space-x-1
                                                            overflow-hidden whitespace-nowrap rounded-tr-lg bg-zinc-950/70 px-2 text-left"
        >
          <p className=" text-xs opacity-30">{authorName + " /"}</p>
          <p className=" text-sm">{realModelName}</p>
        </div>
        <p className="flex h-2/3 flex-col justify-between overflow-auto p-2 text-left text-xs text-slate-300">
          {model.description}
        </p>

        <p className="p-1 text-xs text-slate-400">{model.runCount} 🚀</p>
      </div>
    </div>
  );
}
