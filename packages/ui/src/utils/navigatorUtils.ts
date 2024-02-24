export const copyToClipboard = (text: string) => {
  if (window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "absolute";
    textarea.style.left = "-99999999px";

    document.body.prepend(textarea);

    textarea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.log(err);
    } finally {
      textarea.remove();
    }
  }
};
