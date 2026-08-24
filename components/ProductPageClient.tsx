"use client";

import CafeLoader from "@/app/loading";
import NotFound from "@/app/not-found";
import ProductDetailsClient from "./ProductDetailsClient";
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
  if (isLoading || isFetching || !data?.data) return <CafeLoader />;

  return <ProductDetailsClient product={data.data} />;
}
