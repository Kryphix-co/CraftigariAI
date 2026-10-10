"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "craftigari.product-draft.v1";

const INITIAL_MAKING_PROCESS = [
  {
    id: "raw-material",
    stage: "raw-material",
    title: "Raw Material",
    description: "",
    imageMetadata: null,
    imageUrl: "",
    imagePublicId: "",
  },
  {
    id: "making-crafting",
    stage: "making-crafting",
    title: "Making / Crafting",
    description: "",
    imageMetadata: null,
    imageUrl: "",
    imagePublicId: "",
  },
  {
    id: "finished-product",
    stage: "finished-product",
    title: "Finished Product",
    description: "",
    imageMetadata: null,
    imageUrl: "",
    imagePublicId: "",
  },
];

const DEFAULT_DRAFT = {
  transcript: "",
  aiLanguage: "hi",
  aiAnalysis: {
    inputKey: "",
    generatedAt: "",
    suggestions: null,
    questions: [],
    answers: {},
    skippedQuestionIds: [],
  },
  processAiSuggestions: {},
  summary: {
    title: "",
    description: "",
    originalDescription: "",
    translatedDescription: "",
    category: "",
    craftType: "",
    material: "",
    effort: "",
    colors: "",
    tags: [],
  },
  size: "medium",
  selectedPrice: "recommended",
  pricing: {
    materialCost: 300,
    labourCost: 200,
    packagingCost: 50,
    otherExpenses: 50,
    profitPercentage: 25,
    totalCost: 600,
    suggestedPrice: 750,
    finalPrice: 750,
    selectedTier: "recommended",
  },
  serverProductId: null,
  publishedProductId: null,
  photoMetadata: [],
  photoUploads: [],
  voiceMetadata: null,
  makingProcess: INITIAL_MAKING_PROCESS,
};

const ProductDraftContext = createContext(null);

function mergeStoredDraft(storedDraft) {
  return {
    ...DEFAULT_DRAFT,
    ...storedDraft,
    summary: {
      ...DEFAULT_DRAFT.summary,
      ...(storedDraft?.summary ?? {}),
    },
    pricing: {
      ...DEFAULT_DRAFT.pricing,
      ...(storedDraft?.pricing ?? {}),
    },
    aiAnalysis: {
      ...DEFAULT_DRAFT.aiAnalysis,
      ...(storedDraft?.aiAnalysis ?? {}),
      questions: Array.isArray(storedDraft?.aiAnalysis?.questions)
        ? storedDraft.aiAnalysis.questions.slice(0, 4)
        : [],
      answers:
        storedDraft?.aiAnalysis?.answers &&
        typeof storedDraft.aiAnalysis.answers === "object"
          ? storedDraft.aiAnalysis.answers
          : {},
      skippedQuestionIds: Array.isArray(
        storedDraft?.aiAnalysis?.skippedQuestionIds,
      )
        ? storedDraft.aiAnalysis.skippedQuestionIds
        : [],
    },
    processAiSuggestions:
      storedDraft?.processAiSuggestions &&
      typeof storedDraft.processAiSuggestions === "object"
        ? storedDraft.processAiSuggestions
        : {},
    makingProcess: Array.isArray(storedDraft?.makingProcess)
      ? storedDraft.makingProcess.slice(0, 5).map((step) => ({
          id: step.id,
          stage: step.stage ?? "custom",
          title: step.title ?? "",
          description: step.description ?? "",
          imageMetadata: step.imageMetadata ?? null,
          imageUrl: step.imageUrl ?? "",
          imagePublicId: step.imagePublicId ?? "",
        }))
      : INITIAL_MAKING_PROCESS,
    photoUploads: Array.isArray(storedDraft?.photoUploads)
      ? storedDraft.photoUploads
      : [],
  };
}

export function fileFingerprint(file) {
  return `${file.name}:${file.size}:${file.type}:${file.lastModified}`;
}

export function ProductDraftProvider({ children }) {
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [photos, setPhotos] = useState([]);
  const [voice, setVoice] = useState(null);
  const [makingProcessImages, setMakingProcessImages] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const photosRef = useRef([]);
  const voiceRef = useRef(null);
  const makingProcessImagesRef = useRef({});

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storedDraft = window.sessionStorage.getItem(STORAGE_KEY);
        if (storedDraft) {
          setDraft(mergeStoredDraft(JSON.parse(storedDraft)));
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  useEffect(() => {
    makingProcessImagesRef.current = makingProcessImages;
  }, [makingProcessImages]);

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
      if (voiceRef.current?.url) URL.revokeObjectURL(voiceRef.current.url);
      Object.values(makingProcessImagesRef.current).forEach((image) =>
        URL.revokeObjectURL(image.url),
      );
    },
    [],
  );

  const updateDraft = useCallback((patch) => {
    setDraft((current) => ({
      ...current,
      ...patch,
      summary: patch.summary
        ? { ...current.summary, ...patch.summary }
        : current.summary,
      pricing: patch.pricing
        ? { ...current.pricing, ...patch.pricing }
        : current.pricing,
    }));
  }, []);

  const addPhotos = useCallback((files) => {
    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, 3);

    setPhotos((current) => {
      const remainingSlots = Math.max(0, 3 - current.length);
      const additions = imageFiles.slice(0, remainingSlots).map((file) => ({
        file,
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        url: URL.createObjectURL(file),
      }));
      const next = [...current, ...additions];

      setDraft((draftState) => ({
        ...draftState,
        photoMetadata: next.map(({ file }) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })),
        photoUploads: draftState.photoUploads.filter((upload) =>
          next.some(({ file }) => fileFingerprint(file) === upload.fingerprint),
        ),
      }));

      return next;
    });
  }, []);

  const removePhoto = useCallback((id) => {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      const next = current.filter((photo) => photo.id !== id);
      setDraft((draftState) => ({
        ...draftState,
        photoMetadata: next.map(({ file }) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })),
        photoUploads: draftState.photoUploads.filter((upload) =>
          next.some(({ file }) => fileFingerprint(file) === upload.fingerprint),
        ),
      }));
      return next;
    });
  }, []);

  const setVoiceFile = useCallback((file) => {
    setVoice((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      if (!file) return null;
      return { file, url: URL.createObjectURL(file) };
    });
    setDraft((current) => ({
      ...current,
      voiceMetadata: file
        ? { name: file.name, size: file.size, type: file.type }
        : null,
    }));
  }, []);

  const clearVoice = useCallback(() => {
    setVoiceFile(null);
    updateDraft({ transcript: "" });
  }, [setVoiceFile, updateDraft]);

  const updateMakingProcessStep = useCallback((id, patch) => {
    setDraft((current) => ({
      ...current,
      makingProcess: current.makingProcess.map((step) =>
        step.id === id ? { ...step, ...patch, id: step.id } : step,
      ),
    }));
  }, []);

  const setMakingProcessImage = useCallback((id, file) => {
    if (!file?.type.startsWith("image/")) return;

    setMakingProcessImages((current) => {
      if (current[id]?.url) URL.revokeObjectURL(current[id].url);
      return {
        ...current,
        [id]: { file, url: URL.createObjectURL(file) },
      };
    });
    setDraft((current) => ({
      ...current,
      makingProcess: current.makingProcess.map((step) =>
        step.id === id
          ? {
              ...step,
              imageMetadata: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
              },
              imageUrl: "",
              imagePublicId: "",
            }
          : step,
      ),
    }));
  }, []);

  const addMakingProcessStep = useCallback(() => {
    setDraft((current) => {
      if (current.makingProcess.length >= 5) return current;
      return {
        ...current,
        makingProcess: [
          ...current.makingProcess,
          {
            id: crypto.randomUUID(),
            stage: "custom",
            title: "Additional Step",
            description: "",
            imageMetadata: null,
            imageUrl: "",
            imagePublicId: "",
          },
        ],
      };
    });
  }, []);

  const removeMakingProcessStep = useCallback((id) => {
    setDraft((current) => {
      if (current.makingProcess.length <= 3) return current;
      return {
        ...current,
        makingProcess: current.makingProcess.filter((step) => step.id !== id),
      };
    });
    setMakingProcessImages((current) => {
      if (current[id]?.url) URL.revokeObjectURL(current[id].url);
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const moveMakingProcessStep = useCallback((id, direction) => {
    setDraft((current) => {
      const currentIndex = current.makingProcess.findIndex(
        (step) => step.id === id,
      );
      const nextIndex = currentIndex + direction;
      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >= current.makingProcess.length
      ) {
        return current;
      }

      const makingProcess = [...current.makingProcess];
      const [movedStep] = makingProcess.splice(currentIndex, 1);
      makingProcess.splice(nextIndex, 0, movedStep);
      return { ...current, makingProcess };
    });
  }, []);

  const resetDraft = useCallback(() => {
    setPhotos((current) => {
      current.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });
    setVoice((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return null;
    });
    setMakingProcessImages((current) => {
      Object.values(current).forEach((image) =>
        URL.revokeObjectURL(image.url),
      );
      return {};
    });
    setDraft(DEFAULT_DRAFT);
    window.sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      addPhotos,
      addMakingProcessStep,
      clearVoice,
      draft,
      hydrated,
      makingProcessImages,
      moveMakingProcessStep,
      photos,
      removePhoto,
      removeMakingProcessStep,
      resetDraft,
      setMakingProcessImage,
      setVoiceFile,
      updateDraft,
      updateMakingProcessStep,
      voice,
    }),
    [
      addPhotos,
      addMakingProcessStep,
      clearVoice,
      draft,
      hydrated,
      makingProcessImages,
      moveMakingProcessStep,
      photos,
      removePhoto,
      removeMakingProcessStep,
      resetDraft,
      setMakingProcessImage,
      setVoiceFile,
      updateDraft,
      updateMakingProcessStep,
      voice,
    ],
  );

  return (
    <ProductDraftContext.Provider value={value}>
      {children}
    </ProductDraftContext.Provider>
  );
}

export function useProductDraft() {
  const context = useContext(ProductDraftContext);
  if (!context) {
    throw new Error("useProductDraft must be used inside ProductDraftProvider");
  }
  return context;
}

export const PRODUCT_SIZE_LABELS = {
  small: 'छोटा (6–8")',
  medium: 'मध्यम (10–12")',
  large: 'बड़ा (14"+)',
};

export const PRODUCT_PRICE_OPTIONS = {
  minimum: 850,
  recommended: 1150,
  premium: 1450,
};

export function calculateSmartPricingClient(pricing = {}) {
  const materialCost = Math.max(0, Math.round(Number(pricing.materialCost ?? 0)));
  const labourCost = Math.max(0, Math.round(Number(pricing.labourCost ?? 0)));
  const packagingCost = Math.max(0, Math.round(Number(pricing.packagingCost ?? 0)));
  const otherExpenses = Math.max(0, Math.round(Number(pricing.otherExpenses ?? 0)));
  const profitPercentage = Math.max(0, Math.min(1000, Number(pricing.profitPercentage ?? 25)));

  const totalCost = materialCost + labourCost + packagingCost + otherExpenses;
  const expectedProfit = Math.round(totalCost * (profitPercentage / 100));
  const suggestedPrice = totalCost + expectedProfit;

  let finalPrice = suggestedPrice;
  if (pricing.finalPrice !== undefined && pricing.finalPrice !== null && pricing.finalPrice !== "") {
    finalPrice = Math.max(0, Math.round(Number(pricing.finalPrice)));
  }

  const isBelowCost = totalCost > 0 && finalPrice < totalCost;
  const belowCostDifference = isBelowCost ? totalCost - finalPrice : 0;

  const tiers = {
    minimum: totalCost,
    recommended: suggestedPrice,
    premium: totalCost + Math.round(expectedProfit * 1.5),
  };

  return {
    materialCost,
    labourCost,
    packagingCost,
    otherExpenses,
    profitPercentage,
    totalCost,
    expectedProfit,
    suggestedPrice,
    finalPrice,
    minimumSafePrice: totalCost,
    isBelowCost,
    belowCostDifference,
    tiers,
  };
}
