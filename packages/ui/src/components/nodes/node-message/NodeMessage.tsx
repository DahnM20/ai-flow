import { useTranslation } from "react-i18next";

export interface Message {
  langvar: string;
  kind: "info" | "warning" | "error";
}
interface NodeMessageProps {
  message: Message;
}

export default function NodeMessage({ message }: NodeMessageProps) {
  const { t } = useTranslation("flow");
  let colorClasses = "";

  if (message.kind === "error") {
    colorClasses = "text-red-200 border-red-600";
  }

  if (message.kind === "warning") {
    colorClasses = "text-yellow-200 border-yellow-200";
  }

  if (message.kind === "info") {
    colorClasses = "text-blue-200 border-blue-200";
  }
  return (
    <p
      className={`flex w-full rounded-xl border-2 p-2 text-center ${colorClasses}`}
    >
      {t(message.langvar)}
    </p>
  );
}
