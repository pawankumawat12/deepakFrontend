"use client";

import NotFound from "@/app/not-found";
import ProductDetailsClient from "./ProductDetailsClient";
import SkeletonLoader from "./SkeletonLoader";
import { useGetStoreProductQuery } from "../redux/services/catalogApi";

type ProductPageClientProps = {
  id: string;
};

export default function ProductPageClient({ id }: ProductPageClientProps) {
  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;
  const { data, isLoading, isFetching, isError } = useGetStoreProductQuery(productId, {
    skip: !isValidId,
  });

  if (!isValidId || isError) return <NotFound />;
  if (isLoading || isFetching || !data?.data) {
    return <SkeletonLoader variant="product-detail" />;
  }

  return <ProductDetailsClient product={data.data} />;
}
