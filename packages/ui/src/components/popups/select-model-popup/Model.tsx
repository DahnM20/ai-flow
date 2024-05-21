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
      className="group relative flex h-96 w-full transform cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
      onClick={() => onValidate(model.modelName)}
    >
      <img
        src={model.coverImage || "default-image-url.jpg"}
        alt={model.modelName}
        className="h-2/3 w-full object-cover"
      />

      <p className="absolute right-0 top-0 m-2 rounded-md bg-slate-800/90 p-1 text-xs text-slate-400">
        {model.runCount} 🚀
      </p>
      <div className="relative flex h-1/3 w-full flex-col border-t border-teal-600/20">
        <div
          className="absolute inset-0 bg-cover bg-center blur-md filter"
          style={{
            backgroundImage: `url(${model.coverImage || "default-image-url.jpg"})`,
          }}
        />
        <div className="relative h-full w-full overflow-auto bg-zinc-800/80 p-3">
          <div className="flex flex-row items-center space-x-2 overflow-hidden">
            <p className="text-md truncate font-semibold" title={realModelName}>
              {realModelName}
            </p>
          </div>
          <p
            className="mt-1 flex-grow overflow-auto text-xs text-gray-300"
            title={model.description}
          >
            {model.description}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-lg border border-teal-600/30"></div>
    </div>
  );
}
