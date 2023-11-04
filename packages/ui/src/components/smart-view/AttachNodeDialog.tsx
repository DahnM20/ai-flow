import { useContext, useState } from 'react'
import { Combobox, Dialog } from '@headlessui/react'
import { NodeContext } from '../providers/NodeProvider';
import { Node } from 'reactflow';
import { FiChevronDown } from 'react-icons/fi';
import { Field } from '../../nodesConfiguration/nodeConfig';
import { useTranslation } from 'react-i18next';

interface AttachNodeDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleClose: () => void;
    handleSubmit: (nodeName: string, fieldName: string) => void;
}

const CustomCombobox = ({ items, selectedItem, onChange, query, setQuery }: any) => {
    return (
        <Combobox value={selectedItem} onChange={onChange}>
            <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg 
                    bg-white text-left shadow-md 
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 
                    sm:text-sm">
                    <Combobox.Input
                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        onChange={(event) => setQuery(event.target.value)} />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                    <Combobox.Options>
                        {items.map((item: any) => (
                            <Combobox.Option key={item.key} value={item.value} className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                }`
                            }>
                                {item.key}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </div>
        </Combobox>
    )
}

function AttachNodeDialog({ isOpen, setIsOpen, handleClose, handleSubmit }: AttachNodeDialogProps) {
    const { nodes } = useContext(NodeContext);
    const { t } = useTranslation('dialogs');

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

    function getValidFieldsOptionsForSelectedNode() {
        if (!selectedNode) return [];

        let validFields: string[] = []

        if (!!selectedNode.data.config) {
            const genericFields = selectedNode.data.config.fields.map((field: Field) => {
                return field.name;
            })
            validFields.push(...genericFields);
        }

        const fieldAvailable = Object.keys(selectedNode.data).filter(key => validFields.includes(key));
        fieldAvailable.push('outputData')

        return fieldAvailable.map(field => {
            return { key: field, value: field }
        })

    }

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded bg-zinc-900/90 h-3/5 w-4/5 p-4">
                    <Dialog.Title className="text-lg font-bold text-slate-200 text-center mb-4">{t('attachNodeTitle')}</Dialog.Title>
                    <CustomCombobox
                        items={nodes.map(node => {
                            return { key: node.data.name, value: node }
                        })}
                        selectedItem={selectedNode?.data.name}
                        onChange={setSelectedNode}
                        query={query}
                        setQuery={setQuery}
                    />
                    {!!selectedNode &&
                        <CustomCombobox
                            items={getValidFieldsOptionsForSelectedNode()}
                            selectedItem={selectedField}
                            onChange={setSelectedField}
                            query={queryField}
                            setQuery={setQueryField}
                        />
                    }
                    {
                        (!!selectedNode && !!selectedField)
                        && <button className='text-sky-300 bg-slate-700 p-5 mt-4 w-full' onClick={submit}>{t('attachNodeAction')}</button>
                    }
                </Dialog.Panel>
            </div>
        </Dialog>
    );

}

export default AttachNodeDialog;