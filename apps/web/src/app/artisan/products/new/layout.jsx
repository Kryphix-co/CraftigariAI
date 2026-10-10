import { ProductDraftProvider } from "@/features/product/ProductDraftContext";

export default function NewProductLayout({ children }) {
  return <ProductDraftProvider>{children}</ProductDraftProvider>;
}
