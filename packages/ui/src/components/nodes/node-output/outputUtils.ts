

export const getFileExtension = (url: string) => {
    const extensionMatch = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    return extensionMatch ? extensionMatch[1] : '';
};


export const getGeneratedFileName = (url: string, nodeName: string) => {
    const extension = getFileExtension(url);
    return `${nodeName}-output.${extension}`;
}