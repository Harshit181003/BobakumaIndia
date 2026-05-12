import { ProductsGridSkeleton } from "./ProductsGrid";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="mt-6 h-12 w-full" />
      <ProductsGridSkeleton />
    </div>
  );
}
