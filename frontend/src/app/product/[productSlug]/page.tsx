import ProductButton from "@/product/components/productButton";
import BackButton from "@/product/components/backButton";
import { getProductBySlug } from "@/product/repository";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;

  const res = await getProductBySlug(productSlug);
  if (res.status === false) {
    return <div>{res.message}</div>;
  }
  if (!res.data) return notFound()
  return (
    <div>
      <BackButton text="back" />
      <h1>{res.data.name}</h1>
      <ProductButton id={res.data.id} />
    </div>
  );
}
