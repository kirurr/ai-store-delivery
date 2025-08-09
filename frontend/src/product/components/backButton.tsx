"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackButton({ text }: { text: string }) {
  const router = useRouter();

  return (
    <Link href="#" onClick={() => router.back()}>
      {text}
    </Link>
  );
}
