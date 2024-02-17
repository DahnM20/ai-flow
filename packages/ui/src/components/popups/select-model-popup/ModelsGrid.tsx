import { Model } from "./Model";

interface ModelsGridProps {
  models: any;
  onValidate: (modelName: string) => void;
}

export interface ModelData {
  modelName: string;
  coverImage: string;
  description: string;
  runCount: number;
}

export default function ModelsGrid({ models, onValidate }: ModelsGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {models &&
        models.map((model: ModelData) => (
          <Model model={model} onValidate={onValidate} />
        ))}
    </div>
  );
}
