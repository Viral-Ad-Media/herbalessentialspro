import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { post } from "@/db/schema";
import { getCategories } from "@/lib/posts";
import { PostForm } from "../../post-form";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditPost({ params, searchParams }: Props) {
  const { id } = await params;
  const categories = await getCategories();
  if (id === "new") return <><h1 className="mb-6 text-2xl font-semibold">New post</h1><PostForm categories={categories} /></>;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [p] = await db.select().from(post).where(eq(post.id, n)).limit(1);
  if (!p) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Edit post</h1>
      <PostForm p={p} categories={categories} saved={(await searchParams).saved === "1"} />
    </>
  );
}
