import { useEffect, useState } from "react";
import DefaultPopupWrapper from "./DefaultPopup";
import FilterGrid, { FilterItem } from "./shared/FilterGrid";
import Grid from "./shared/Grid";
import { convertJsonToFlow } from "../../utils/flowUtils";
import { templateTags } from "./AddTemplatePopup";
import { Template, getTemplate, getTemplates } from "../../api/template";
import { useLoading } from "../../hooks/useLoading";
import { LoadingIcon } from "../nodes/Node.styles";
import withCache from "../../api/cache/withCache";

interface TemplatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: (template: any) => void;
}

export default function TemplatePopup({
  isOpen,
  onClose,
  onValidate,
}: TemplatePopupProps) {
  const [templates, setTemplates] = useState<Template[]>();
  const [selectedFilter, setSelectedFilter] = useState<string>();

  const [loading, startLoadingWith] = useLoading();

  async function loadTemplates() {
    setTemplates(await withCache(getTemplates));
  }

  useEffect(() => {
    startLoadingWith(loadTemplates);
  }, []);

  function renderTemplate(
    template: Template,
    onValidate: (templateId: string) => void,
  ) {
    return (
      <div
        className="flex flex-col justify-between rounded-lg bg-subtle-gradient p-4"
        key={template.id}
      >
        <div className="space-y-2">
          <h1 className="text-xl font-bold">{template.title}</h1>
          <p className="text-sm text-slate-400">{template.description}</p>
          <div className="flex flex-row flex-wrap gap-2">
            {template.tags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-700 px-2 py-1 text-xs font-bold text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-row-reverse p-1">
          <button
            className="rounded-lg bg-teal-400/60 px-4 py-1 font-bold shadow-xl transition-all duration-300 ease-in-out hover:bg-teal-400"
            onClick={() => onValidate(template.id)}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  async function handleSelectTemplate(templateId: string): Promise<void> {
    const template = await withCache(getTemplate, templateId);
    const flowData = convertJsonToFlow(template);
    onValidate?.(flowData);
    onClose();
  }

  function handleSelectFilter(filter: string) {
    if (filter === selectedFilter) {
      setSelectedFilter(undefined);
    } else {
      setSelectedFilter(filter);
    }
  }

  const filters: FilterItem[] = templateTags.map((str) => {
    return { name: str, slug: str };
  });

  return (
    <DefaultPopupWrapper
      show={isOpen}
      onClose={onClose}
      popupClassNames=" overflow-auto h-fit mt-5 w-5/6 "
    >
      <div className="flex w-full flex-col space-y-3 overflow-auto rounded-xl bg-zinc-900 p-5 text-slate-200 shadow md:flex-row">
        {loading ? (
          <LoadingIcon className="flex w-full items-center justify-center" />
        ) : (
          <>
            <div className="w-full md:w-1/3 lg:w-1/5">
              <FilterGrid
                filters={filters}
                onSelectFilter={handleSelectFilter}
                selectedFilter={selectedFilter ?? ""}
              />
            </div>
            <Grid
              items={
                templates
                  ? templates.filter((template) => {
                      return (
                        !selectedFilter ||
                        template.tags?.includes(selectedFilter)
                      );
                    })
                  : []
              }
              onValidate={handleSelectTemplate}
              renderItem={renderTemplate}
              numberColMax={2}
            />
          </>
        )}
      </div>
    </DefaultPopupWrapper>
  );
}
