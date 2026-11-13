import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/db/schema";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-mist">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-5">
          {post.categorySlug && (
            <span className="text-xs font-semibold uppercase tracking-wider text-leaf-bright">
              {post.categorySlug.replace("-", " ")}
            </span>
          )}
          <h3 className="mt-1 text-lg font-semibold leading-snug group-hover:text-leaf">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
          {post.publishedAt && (
            <p className="mt-4 text-xs text-muted">{formatDate(post.publishedAt)}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
