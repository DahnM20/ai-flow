import { useTranslation } from "react-i18next";
import { LoadingIcon } from "../../nodes/Node.styles";

interface LoadMoreButtonProps {
  loading: boolean;
  cursor: string | null;
  onLoadMore: () => void;
}

export default function LoadMoreButton({
  loading,
  cursor,
  onLoadMore,
}: LoadMoreButtonProps) {
  const { t } = useTranslation("flow");
  return (
    <div className="flex w-full justify-center">
      {loading ? (
        <LoadingIcon className="ml-5 flex w-full items-center justify-center" />
      ) : (
        cursor != null &&
        cursor != "" && (
          <div
            className="text-md w-1/4 transform cursor-pointer rounded-lg bg-teal-800 py-1 text-center text-slate-200 shadow-lg transition-transform hover:scale-105 hover:bg-teal-700"
            onClick={onLoadMore}
          >
            {t("LoadMore")}
          </div>
        )
      )}
    </div>
  );
}
