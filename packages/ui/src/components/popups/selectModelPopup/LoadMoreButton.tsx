import { useTranslation } from "react-i18next";
import { LoadingIcon } from "../../shared/Node.styles"

interface LoadMoreButtonProps {
    loading: boolean
    cursor: string | null
    onLoadMore: () => void
}

export default function LoadMoreButton({ loading, cursor, onLoadMore }: LoadMoreButtonProps) {
    const { t } = useTranslation('flow');
    return (
        <div className='flex w-full justify-center'>
            {loading
                ? <LoadingIcon className='ml-5 w-full flex justify-center items-center' />
                : <>
                    {
                        cursor != null && cursor != "" &&
                        <div className='bg-zinc-950/70 hover:bg-zinc-950/50 text-center text-md text-slate-200 w-1/4 py-1' onClick={onLoadMore}>
                            {t('LoadMore')}
                        </div>
                    }
                </>
            }
        </div>
    )
}