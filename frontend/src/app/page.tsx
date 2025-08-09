import { StrapiCategory, StrapiCollectionResponse } from "@shared";
import Link from "next/link";

export default async function Home() {
  const response = await fetch("http://gateway:4000/").catch((err) =>
    console.log(err),
  );
  const categories =
    (await response!.json()) as StrapiCollectionResponse<StrapiCategory>;
  return (
    <>
      <Link href="/signin">Sign In</Link>
      <Link href="/signup">Sign Up</Link>
      <ul>
        {categories!.data!.map((category) => (
          <li key={category.id}>
            <Link href={`/${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
