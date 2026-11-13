import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { formatDate, readingTime } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPostBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.excerpt, images: p.coverImage ? [p.coverImage] : [] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) notFound();
  const related = p.categorySlug
    ? (await getPostsByCategory(p.categorySlug)).filter((r) => r.id !== p.id).slice(0, 3)
    : [];

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 pt-12">
        {p.categorySlug && (
          <Link href={`/category/${p.categorySlug}`} className="text-xs font-semibold uppercase tracking-wider text-leaf-bright">
            {p.categorySlug.replace("-", " ")}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-[2.6rem]">{p.title}</h1>
        <p className="mt-4 text-lg text-muted">{p.excerpt}</p>
        <p className="mt-4 text-sm text-muted">
          {p.publishedAt && formatDate(p.publishedAt)} · {readingTime(p.content)} min read
        </p>
        {p.coverImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-mist">
            <Image src={p.coverImage} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-herbal mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }} />
      </article>
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-16">
          <h2 className="mb-6 text-2xl font-semibold">Keep reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <PostCard key={r.id} post={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
