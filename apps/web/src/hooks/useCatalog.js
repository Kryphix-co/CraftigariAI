"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
  BACKEND_CATALOG_EVENT,
  mapBackendArtisan,
  mapBackendProduct,
} from "@/lib/backendCatalog";
import { getArtisanById, getStaticProductById, STATIC_PRODUCTS } from "@/lib/catalog";
import {
  DEMO_CATALOG_EVENT,
  getDemoProductRecords,
  hydrateDemoProduct,
  isDemoCatalogStorageEvent,
} from "@/lib/demoCatalog";
const DEMO_FALLBACK_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_ENABLE_DEMO_CATALOG === "true";

async function loadSupplementalProducts() {
  if (!DEMO_FALLBACK_ENABLED) return [...STATIC_PRODUCTS];

  const demoProducts = await Promise.all(
    getDemoProductRecords().map(hydrateDemoProduct),
  );
  return [...demoProducts, ...STATIC_PRODUCTS];
}

function mergeCatalogProducts(...catalogs) {
  const seen = new Set();
  return catalogs.flat().filter((product) => {
    if (!product?.id || seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function filterByArtisan(products, artisanId) {
  return artisanId
    ? products.filter((product) => product.artisanId === artisanId)
    : products;
}

export function useCatalogProducts(artisanId = "") {
  const [products, setProducts] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let objectUrls = [];

    const loadProducts = async () => {
      setReady(false);
      setError("");
      let supplementalProducts = [...STATIC_PRODUCTS];

      try {
        supplementalProducts = await loadSupplementalProducts();
      } catch {
        // The built-in sample catalog must remain available even when the
        // optional browser-local demo store cannot be read.
      }

      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls = supplementalProducts.flatMap(
        (product) => product._objectUrls ?? [],
      );

      try {
        const artisanQuery = artisanId
          ? `&artisanId=${encodeURIComponent(artisanId)}`
          : "";
        const data = await apiGet(
          `/api/products?page=1&limit=100${artisanQuery}`,
        );
        if (!disposed) {
          const backendProducts = (data.items ?? []).map(mapBackendProduct);
          setProducts(
            filterByArtisan(
              mergeCatalogProducts(backendProducts, supplementalProducts),
              artisanId,
            ),
          );
        }
      } catch (requestError) {
        if (disposed) return;
        setProducts(filterByArtisan(supplementalProducts, artisanId));
        setError(
          requestError.code === "API_NOT_CONFIGURED"
            ? "Backend is not configured. Showing sample products."
            : "Backend is currently unavailable. Showing sample products.",
        );
      } finally {
        if (!disposed) setReady(true);
      }
    };

    const handleStorage = (event) => {
      if (DEMO_FALLBACK_ENABLED && isDemoCatalogStorageEvent(event)) {
        void loadProducts();
      }
    };
    const handleCatalogChange = () => void loadProducts();

    void loadProducts();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(DEMO_CATALOG_EVENT, handleCatalogChange);
    window.addEventListener(BACKEND_CATALOG_EVENT, handleCatalogChange);

    return () => {
      disposed = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(DEMO_CATALOG_EVENT, handleCatalogChange);
      window.removeEventListener(BACKEND_CATALOG_EVENT, handleCatalogChange);
    };
  }, [artisanId]);

  return { error, products, ready };
}

export function useCatalogProduct(id) {
  const [product, setProduct] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;
    let objectUrls = [];

    const loadProduct = async () => {
      setReady(false);
      setError("");

      const sampleProduct = getStaticProductById(id);
      if (sampleProduct) {
        if (!disposed) {
          setProduct(sampleProduct);
          setReady(true);
        }
        return;
      }

      if (DEMO_FALLBACK_ENABLED) {
        const record = getDemoProductRecords().find((item) => item.id === id);
        if (record) {
          const demoProduct = await hydrateDemoProduct(record);
          objectUrls = demoProduct?._objectUrls ?? [];
          if (!disposed) {
            setProduct(demoProduct);
            setReady(true);
          }
          return;
        }
      }

      try {
        const data = await apiGet(`/api/products/published/${encodeURIComponent(id)}`);
        if (!disposed) setProduct(mapBackendProduct(data));
      } catch (requestError) {
        if (disposed) return;
        setProduct(null);
        setError(requestError.message || "Unable to load this product.");
      } finally {
        if (!disposed) setReady(true);
      }
    };

    void loadProduct();
    return () => {
      disposed = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  return { error, product, ready };
}

export function usePublicArtisan(id) {
  const [artisan, setArtisan] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let disposed = false;

    const loadArtisan = async () => {
      const sampleArtisan = getArtisanById(id);
      if (sampleArtisan) {
        if (!disposed) {
          setArtisan(sampleArtisan);
          setError("");
          setReady(true);
        }
        return;
      }

      try {
        const data = await apiGet(`/api/artisans/${encodeURIComponent(id)}`);
        if (!disposed) setArtisan(mapBackendArtisan(data.artisan));
      } catch (requestError) {
        if (disposed) return;
        setArtisan(null);
        setError(requestError.message || "Unable to load this artisan.");
      } finally {
        if (!disposed) setReady(true);
      }
    };

    void loadArtisan();
    return () => {
      disposed = true;
    };
  }, [id]);

  return { artisan, error, ready };
}
