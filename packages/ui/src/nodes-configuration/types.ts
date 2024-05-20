export type SectionType = "models" | "image-generation" | "tools" | "input";
export type FieldType =
  | "input"
  | "inputInt"
  | "textarea"
  | "select"
  | "option"
  | "inputNameBar"
  | "boolean"
  | "slider"
  | "textfield"
  | "numericfield"
  | "switch"
  | "textToDisplay";

export type OutputType =
  | "imageUrl"
  | "videoUrl"
  | "audioUrl"
  | "pdfUrl"
  | "imageBase64"
  | "markdown"
  | "text"
  | "fileUrl"
  | "3dUrl";

export interface Option {
  label: string;
  value: string;
  default?: boolean;
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: string | number;
  max?: number;
  min?: number;
  options?: Option[];
  hideIfParent?: boolean;
  required?: boolean;
  hasHandle?: boolean;
  isLinked?: boolean;
  associatedField?: string;
  description?: string;
}

export interface NodeConfig {
  processorType?: string;
  nodeName: string;
  icon: string;
  inputNames?: string[];
  fields: Field[];
  hideFieldsIfParent?: boolean;
  outputType: OutputType;
  defaultHideOutput?: boolean;
  hasInputHandle?: boolean;
  section: SectionType;
  helpMessage?: string;
  showHandlesNames?: boolean;
}
