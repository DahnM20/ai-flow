import { getOutputExtension } from "../node-output/outputUtils";
import ImageMaskCreatorField from "./ImageMaskCreatorField";

interface ImageMaskCreatorFieldProps {
  onChange: (value: string) => void;
}

const extractImageUrls = (nodes: any[]) => {
  return nodes
    .flatMap((node) => {
      const outputData = node.data.outputData;
      if (typeof outputData === "string") return [outputData];
      if (Array.isArray(outputData)) return outputData;
      return [];
    })
    .filter((url) => getOutputExtension(url) === "imageUrl");
};

export default function ImageMaskCreatorFieldFlowAware({
  onChange,
}: ImageMaskCreatorFieldProps) {
  return <ImageMaskCreatorField imageUrls={[]} onChange={onChange} />;
}
