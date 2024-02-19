import { useState } from "react";
import DefaultPopupWrapper from "./DefaultPopup";

export type TemplateFormData = {
  title: string;
  description: string;
  tags?: string[];
};

interface AddTemplatePopupProps {
  show: boolean;
  onClose: () => void;
  onValidate: (data: TemplateFormData) => void;
}

export const templateTags = [
  "productivity",
  "text",
  "image",
  "video",
  "sound",
] as const;

export type TemplateTag = (typeof templateTags)[number];

export default function AddTemplatePopup({
  show,
  onClose,
  onValidate,
}: AddTemplatePopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<Set<TemplateTag>>(new Set());

  function handleUpdateTag(tag: TemplateTag) {
    setTags((prev) => {
      const newSet = new Set(prev);
      if (prev.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  }

  function handleValidate() {
    if (title.length > 0) {
      onValidate({
        title,
        description,
        tags: Array.from(tags),
      });
    }
  }

  return (
    <DefaultPopupWrapper show={show} onClose={onClose} centered>
      <div className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-subtle-gradient px-6 py-4 text-slate-200 shadow-xl">
        <h3 className="text-lg font-bold text-slate-300"> Save as template</h3>
        <input
          placeholder="Name"
          className="text-slate-20 w-full rounded-lg bg-zinc-950/60 px-2 py-1"
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <textarea
          placeholder="Description"
          className="w-full rounded-lg bg-zinc-950/60 px-2 py-1 text-slate-200"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex flex-row space-x-2">
          {templateTags.map((tag) => (
            <span
              key={tag}
              className={`rounded-lg px-2 py-1 text-slate-200 ${tags.has(tag) ? "bg-sky-300/80" : "bg-zinc-950/60 hover:bg-zinc-800"} `}
              onClick={() => handleUpdateTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-row space-x-2">
          <button
            className="rounded-lg bg-teal-400/80 px-4 py-1 shadow-xl transition-all duration-300 ease-in-out hover:bg-teal-400"
            onClick={handleValidate}
          >
            Save
          </button>
          <button
            className="rounded-lg bg-slate-400/80 px-4 py-1 shadow-xl transition-all duration-300 ease-in-out hover:bg-slate-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </DefaultPopupWrapper>
  );
}
