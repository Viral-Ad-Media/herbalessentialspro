import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { post } from "@/db/schema";
import { formatDate } from "@/lib/format";

export default async function AdminHome() {
  const posts = await db.select().from(post).orderBy(desc(post.updatedAt));
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Posts ({posts.length})</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-leaf px-5 py-2 text-sm font-medium text-white hover:bg-leaf-bright">
          New post
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        {posts.map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-4 border-b border-mist px-5 py-4 last:border-0 hover:bg-cream">
            <div className="min-w-0">
              <p className="truncate font-medium">{p.title}</p>
              <p className="text-xs text-muted">/{p.slug} · updated {formatDate(p.updatedAt)}</p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${p.published ? "bg-green-100 text-leaf" : "bg-mist text-slate"}`}>
              {p.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
