"use client";

import { useRef } from "react";
import PhotoCapture from "@/features/product/PhotoCapture";

export default function MakingProcessStep({
  canMoveDown,
  canMoveUp,
  canRemove,
  image,
  index,
  onImageChange,
  onMoveDown,
  onMoveUp,
  onRemove,
  onUpdate,
  onApplySuggestion,
  step,
  suggestion,
}) {
  const galleryInputRef = useRef(null);

  const handleFilesSelected = (files) => {
    const imageFile = Array.from(files).find((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFile) onImageChange(imageFile);
  };

  return (
    <article className="rounded-xl border border-outline-variant bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] lg:p-5">
      <PhotoCapture
        galleryInputRef={galleryInputRef}
        galleryMultiple={false}
        onFilesSelected={handleFilesSelected}
      />

      <div className="mb-4 flex items-center justify-between gap-3 border-b border-outline-variant pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-on-primary">
            {index + 1}
          </span>
          <span className="truncate font-label text-[12px] font-semibold uppercase tracking-wide text-secondary">
            Process step
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Move step up"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!canMoveUp}
            onClick={onMoveUp}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
          <button
            aria-label="Move step down"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!canMoveDown}
            onClick={onMoveDown}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </button>
          <button
            aria-label="Remove process step"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-error-container hover:text-error disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!canRemove}
            onClick={onRemove}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)]">
        <button
          aria-label={image ? "Replace process photo" : "Upload process photo"}
          className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-outline bg-surface-container-low text-secondary transition-colors hover:border-primary hover:text-primary sm:aspect-square"
          onClick={() => galleryInputRef.current?.click()}
          type="button"
        >
          {image ? (
            <>
              <img
                alt={step.title || `Process step ${index + 1}`}
                className="h-full w-full object-cover"
                src={image.url}
              />
              <span className="absolute inset-x-0 bottom-0 bg-primary/80 px-2 py-1.5 text-center text-[11px] font-semibold text-on-primary backdrop-blur-sm">
                Change photo
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-3 text-center">
              <span className="material-symbols-outlined text-[28px]">add_photo_alternate</span>
              <span className="font-label text-[12px] font-semibold">Upload real photo</span>
              {step.imageMetadata && (
                <span className="text-[10px] font-normal text-secondary">
                  Select this photo again after reload
                </span>
              )}
            </span>
          )}
        </button>

        <div className="flex min-w-0 flex-col gap-3">
          <label className="block">
            <span className="mb-1.5 block font-label text-[12px] font-semibold text-secondary">
              Stage title
            </span>
            <input
              className="h-11 w-full rounded-lg border border-outline bg-surface px-3 font-title text-[15px] font-semibold text-primary outline-none transition-colors focus:border-primary"
              onChange={(event) => onUpdate({ title: event.target.value })}
              placeholder="Name this stage"
              value={step.title}
            />
          </label>

          <label className="block flex-1">
            <span className="mb-1.5 block font-label text-[12px] font-semibold text-secondary">
              Description
            </span>
            <textarea
              className="min-h-[92px] w-full resize-y rounded-lg border border-outline bg-surface px-3 py-2.5 font-body text-[14px] leading-relaxed text-on-surface outline-none transition-colors focus:border-primary"
              onChange={(event) =>
                onUpdate({ description: event.target.value })
              }
              placeholder="Describe what happens during this stage"
              value={step.description}
            />
          </label>
          {suggestion && (
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Gemini suggestion</p>
              <p className="mt-1 text-[13px] font-semibold text-primary">{suggestion.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-secondary">{suggestion.description}</p>
              <button className="mt-2 text-[12px] font-semibold text-primary underline underline-offset-2" onClick={() => onApplySuggestion(suggestion)} type="button">Use this suggestion</button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
