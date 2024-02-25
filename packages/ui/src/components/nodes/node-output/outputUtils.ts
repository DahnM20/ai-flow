export const getFileExtension = (url: string) => {
  const extensionMatch = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
  return extensionMatch ? extensionMatch[1] : "";
};

export const getGeneratedFileName = (url: string, nodeName: string) => {
  const extension = getFileExtension(url);
  return `${nodeName}-output.${extension}`;
};

const extensionToTypeMap: { [key: string]: string } = {
  // Image extensions
  ".png": "imageUrl",
  ".jpg": "imageUrl",
  ".gif": "imageUrl",
  ".jpeg": "imageUrl",
  // Video extensions
  ".mp4": "videoUrl",
  ".mov": "videoUrl",
  // Audio extensions
  ".mp3": "audioUrl",
  ".wav": "audioUrl",
  // Other extensions
  ".pdf": "markdown",
  ".txt": "markdown",
  ".glb": "markdown",
};

export function getOutputTypeFromExtension(output: string) {
  if (!output) return "markdown";
  const extension = Object.keys(extensionToTypeMap).find((ext) =>
    output.endsWith(ext),
  );
  return extension ? extensionToTypeMap[extension] : "markdown";
}
