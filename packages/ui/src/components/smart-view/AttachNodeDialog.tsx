import { useContext, useState } from "react";
import { Dialog } from "@headlessui/react";
import { NodeContext } from "../../providers/NodeProvider";
import { Node } from "reactflow";
import { Field } from "../../nodes-configuration/types";
import { useTranslation } from "react-i18next";
import { Checkbox, Divider } from "@mantine/core";
import SelectAutocomplete, {
  SelectItem,
} from "../selectors/SelectAutocomplete";

interface AttachNodeDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleClose: () => void;
  handleSubmit: (nodeName: string, fieldNames: string[]) => void;
}

function AttachNodeDialog({
  isOpen,
  setIsOpen,
  handleClose,
  handleSubmit,
}: AttachNodeDialogProps) {
  const { nodes } = useContext(NodeContext);
  const { t } = useTranslation("dialogs");

  const [selectedNode, setSelectedNode] = useState<Node>();
  const [selectedFields, setSelectedField] = useState<string[]>([]);

  function submit() {
    if (!selectedNode) return;
    if (!selectedFields) return;
    handleSubmit(selectedNode?.data.name, selectedFields);
    setIsOpen(false);
  }

  const outputDataFieldName = "outputData";
  function getValidFieldsOptionsForSelectedNode() {
    if (!selectedNode) return [];

    let validFields: string[] = [];

    if (!!selectedNode.data.config) {
      const genericFields = selectedNode.data.config.fields
        ?.filter((field: Field) => !field.isLinked)
        .map((field: Field) => {
          return field.name;
        });
      if (!!genericFields) {
        validFields.push(...genericFields);
      }
    }

    const fieldAvailable = validFields;

    fieldAvailable.push(outputDataFieldName);

    return fieldAvailable.map((field) => {
      return {
        key: field === outputDataFieldName ? "output" : field,
        value: field,
      };
    });
  }

  function handleCheckField(fieldName: string) {
    if (
      selectedFields.includes(outputDataFieldName) &&
      fieldName != outputDataFieldName
    ) {
      setSelectedField((prev) =>
        prev?.filter((field) => field !== outputDataFieldName),
      );
    }

    if (
      fieldName === outputDataFieldName &&
      !selectedFields.includes(outputDataFieldName)
    ) {
      setSelectedField([fieldName]);
    }

    if (selectedFields?.includes(fieldName)) {
      setSelectedField((prev) => prev?.filter((field) => field !== fieldName));
    } else {
      setSelectedField((prev) => [...prev, fieldName]);
    }
  }

  function handleSelectNode(node: Node) {
    setSelectedNode(node);
  }
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto h-3/5 w-4/5 max-w-sm rounded border-2 border-slate-300/10 bg-zinc-900 p-7">
          <Dialog.Title className="mb-4 text-center text-xl font-bold text-slate-200">
            {t("attachNodeTitle")}
          </Dialog.Title>

          <div className="flex flex-row items-baseline justify-center space-x-2">
            <SelectAutocomplete
              values={nodes.map((node) => {
                return { name: node.data.name, value: node };
              })}
              onChange={handleSelectNode}
              selectedValue={selectedNode}
            />
          </div>
          {!!selectedNode && (
            <>
              <Divider my="md" color="white" />
              <div className="pt-2 text-center text-lg">
                Select fields to attach{" "}
              </div>
              <div className="flex flex-row items-baseline justify-center  space-x-2">
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-4">
                  {getValidFieldsOptionsForSelectedNode().map((option) => {
                    return (
                      <div
                        className="flex flex-row space-x-2"
                        key={option.value}
                      >
                        <Checkbox
                          label={option.key}
                          variant="outline"
                          size="md"
                          darkHidden={false}
                          checked={selectedFields?.includes(option.value)}
                          onChange={() => handleCheckField(option.value)}
                          styles={{
                            input: {
                              borderColor: "white",
                            },
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {!!selectedNode && !!selectedFields && (
            <button
              className="mt-10 w-full rounded-lg bg-slate-700 p-3 text-lg font-bold text-slate-100 transition-all duration-300 ease-in-out hover:bg-sky-300/50"
              onClick={submit}
            >
              {t("attachNodeAction")}
            </button>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default AttachNodeDialog;
