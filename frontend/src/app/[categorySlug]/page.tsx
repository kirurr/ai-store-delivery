import { getCategoryPageBySlug } from "@/category/repository";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const res = await getCategoryPageBySlug(categorySlug);
  if (res.status === false) {
    return <div>{res.message}</div>;
  }
  if (!res.data) return <div>no category</div>;
  return (
    <div>
			<Link href="/">back</Link>
      <h1>Category: {res.data.category.name}</h1>
      {"error" in res.data.products ? (
        <div>Ошибка: {res.data.products.error.message}</div>
      ) : (
        <ul>
          {res.data.products.data.map((product) => (
            <li key={product.id}>
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
