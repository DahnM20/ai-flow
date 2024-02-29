import { useState, useEffect } from "react";
import { LoadingIcon } from "../../nodes/Node.styles";
import DefaultPopupWrapper from "../DefaultPopup";
import FilterGrid from "../shared/FilterGrid";
import LoadMoreButton from "../shared/LoadMoreButton";
import { useTranslation } from "react-i18next";
import Grid from "../shared/Grid";
import { Model } from "./Model";
import { useLoading } from "../../../hooks/useLoading";
import withCache from "../../../api/cache/withCache";
import {
  getCollectionModels,
  getCollections,
  getHighlightedModels,
  getPublicModels,
} from "../../../api/replicateModels";

interface SelectModelPopupProps {
  show: boolean;
  onClose: () => void;
  onValidate: (data: any) => void;
}

export default function SelectModelPopup({
  show,
  onClose,
  onValidate,
}: SelectModelPopupProps) {
  const { t } = useTranslation("flow");

  const [models, setModels] = useState<any>();
  const [highlitedModels, setHighlightedModels] = useState<any>();
  const [collections, setCollections] = useState<any>();
  const [selectedCollection, setSelectedCollection] = useState<any>();
  const [opening, startOpeningWith] = useLoading();
  const [loading, startLoadingWith] = useLoading();
  const [cursor, setCursor] = useState("");

  useEffect(() => {
    async function loadAllData() {
      const collections = await withCache(getCollections);
      const { models, cursor: newCursor } = await withCache(getPublicModels);
      const highlightedModels = await withCache(getHighlightedModels);
      const extractedData = extractModelsData(models);
      const extractedHighlightedModels = extractModelsData(highlightedModels);
      setCursor(newCursor);
      setModels(extractedData);
      setHighlightedModels(extractedHighlightedModels);
      setCollections(collections);
    }

    async function configurePopup() {
      await startOpeningWith(loadAllData);
    }

    if (!!models) return;

    configurePopup();
  }, []);

  useEffect(() => {
    if (!selectedCollection) return;

    const loadCollectionModels = async () => {
      const { models, cursor: newCursor } = await withCache(
        getCollectionModels,
        selectedCollection,
      );
      const extractedData = extractModelsData(models);
      setModels(extractedData);
      setCursor(newCursor);
    };

    startLoadingWith(loadCollectionModels);
  }, [selectedCollection]);

  function extractModelsData(models: any) {
    return models
      ?.map(
        (result: {
          default_example: { model: string };
          cover_image_url: string;
          description: string;
          name: string;
          owner: string;
          run_count: number;
        }) => {
          return {
            modelName: result.owner + "/" + result.name,
            coverImage: result.cover_image_url,
            description: result.description,
            runCount: result.run_count,
          };
        },
      )
      .filter((model: any) => {
        return !!model && model.coverImage != null;
      });
  }

  async function handleSelectCollection(collectionName: string) {
    setModels([]);
    setCursor("");
    setSelectedCollection(collectionName);
  }

  async function loadCollectionsModels(cursor?: string) {
    const collections = await withCache(
      getCollectionModels,
      selectedCollection,
      cursor,
    );
    setCollections(collections);
    return collections;
  }

  async function handleLoadMore() {
    let newModels: any[] = [];
    if (selectedCollection) {
      const { models, cursor: newCursor } = await startLoadingWith(
        loadCollectionsModels,
        cursor,
      );
      setCursor(newCursor);
      newModels = extractModelsData(models);
    } else {
      const { models, cursor: newCursor } = await startLoadingWith(
        getPublicModels,
        cursor,
      );
      setCursor(newCursor);
      newModels = extractModelsData(models);
    }
    setModels([...models, ...newModels]);
  }

  const renderModelSections = () => {
    if (!selectedCollection) {
      return (
        <>
          <ModelsSection
            title={t("SpotlightModels")}
            models={highlitedModels}
            onValidate={onValidate}
          />
          <ModelsSection
            title={t("AllModels")}
            models={models}
            onValidate={onValidate}
          />
        </>
      );
    }
    return <ModelsSection models={models} onValidate={onValidate} />;
  };

  if (opening) return <LoadingIcon className="ml-5" />;

  if (!models && !collections) return null;

  return (
    <DefaultPopupWrapper onClose={onClose} show={show}>
      <div className="my-4 flex w-full flex-col space-y-3 overflow-auto rounded-xl bg-zinc-900 p-5 text-slate-200 shadow lg:flex-row">
        <div className="flex lg:w-1/4">
          <FilterGrid
            filters={collections}
            selectedFilter={selectedCollection}
            onSelectFilter={handleSelectCollection}
          />
        </div>

        <div className="flex flex-col gap-2 lg:w-3/4">
          {renderModelSections()}

          <LoadMoreButton
            loading={loading}
            cursor={cursor}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </DefaultPopupWrapper>
  );
}

interface ModelSectionProps {
  title?: string | null;
  models: any;
  onValidate: (data: any) => void;
}

export interface ModelData {
  modelName: string;
  coverImage: string;
  description: string;
  runCount: number;
}

const ModelsSection = ({ title, models, onValidate }: ModelSectionProps) => {
  if (!models || models.length == 0) return null;

  const renderModelItem = (
    model: ModelData,
    onValidate: (modelName: string) => void,
  ) => <Model key={model.modelName} model={model} onValidate={onValidate} />;

  return (
    <>
      {title && <h2>{title}</h2>}
      <Grid
        items={models}
        onValidate={onValidate}
        renderItem={renderModelItem}
      />
    </>
  );
};
