import { useContext, useState } from 'react'
import { Combobox, Dialog } from '@headlessui/react'
import { NodeContext } from '../providers/NodeProvider';
import { Node } from 'reactflow';

interface AttachNodeDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleClose: () => void;
    handleSubmit: (nodeName: string, fieldName: string) => void;
}

function AttachNodeDialog({ isOpen, setIsOpen, handleClose, handleSubmit }: AttachNodeDialogProps) {
    const { nodes } = useContext(NodeContext);

    const [selectedNode, setSelectedNode] = useState<Node>()
    const [selectedField, setSelectedField] = useState<string>()
    const [query, setQuery] = useState('')
    const [queryField, setQueryField] = useState('')

    function submit() {
        if (!selectedNode) return;
        if (!selectedField) return;
        handleSubmit(selectedNode?.data.name, selectedField);
        setIsOpen(false);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-zinc-900/90 h-3/5 w-3/5 p-4">
                    <Dialog.Title className="text-lg font-bold text-slate-200 text-center">Attach Node </Dialog.Title>

                    <div className='flex items-center justify-center'>
                        <Combobox value={selectedNode} onChange={setSelectedNode}>
                            <Combobox.Input onChange={(event) => setQuery(event.target.value)} />
                            <Combobox.Options>
                                {nodes.map((node) => (
                                    <Combobox.Option key={node.data.name} value={node}>
                                        {node.data.name}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </div>

                    {
                        !!selectedNode &&
                        <Combobox value={selectedField} onChange={setSelectedField}>
                            <Combobox.Input onChange={(event) => setQueryField(event.target.value)} />
                            <Combobox.Options>
                                {Object.keys(selectedNode.data).map((field: string) => (
                                    <Combobox.Option key={field} value={field}>
                                        {field}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    }

                    <button className='text-sky-300 bg-slate-700 p-5' onClick={submit}> Submit </button>


                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default AttachNodeDialog;