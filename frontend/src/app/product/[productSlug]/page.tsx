import AddProductToCartButton from "@/cart/components/addToCartButton";
import BackButton from "@/product/components/backButton";
import { getProductBySlug } from "@/product/repository";

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
  if (!res.data) return <div>no product</div>;
  return (
    <div>
      <h1>{res.data.name}</h1>
      <BackButton text="back" />
      <AddProductToCartButton id={res.data.id} />
    </div>
  );
}
