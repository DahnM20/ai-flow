
interface ModelsGridProps {
    models: any
    onValidate: (modelName: string) => void
}

export default function ModelsGrid({ models, onValidate }: ModelsGridProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full'>
            {
                models && models.map((model: { modelName: string; coverImage: string; description: string; runCount: number }) => {

                    const realModelName = model.modelName.includes('/')
                        ? model.modelName.split('/')[1]
                        : model.modelName

                    const authorName = model.modelName.includes('/')
                        ? model.modelName.split('/')[0]
                        : ""

                    return (
                        <div key={model.modelName}
                            className='flex flex-row items-center shadow-lg shadow-black/30 w-full hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer overflow-hidden'
                            onClick={() => onValidate(model.modelName)}>

                            <img src={model.coverImage || 'default-image-url.jpg'}
                                alt={model.modelName} className='flex w-1/4 h-full  object-cover rounded-l-lg ' />

                            <div className='flex flex-col h-full w-full '>
                                <div className='flex flex-row text-md text-left bg-zinc-950/70 space-x-1
                                                            w-full px-2 overflow-hidden whitespace-nowrap rounded-tr-lg items-center'>
                                    <p className=' text-xs opacity-30'>{authorName + " /"}</p>
                                    <p className=' text-sm'>{realModelName}</p>
                                </div>
                                <div className='flex flex-col justify-between flex-grow'>
                                    <p className='text-xs text-slate-300 p-2 text-left'>{model.description}</p>
                                    <p className='text-xs text-slate-400 p-3'>{model.runCount}</p>
                                </div>
                            </div>
                        </div>
                    );

                })
            }
        </div>
    )

}