import type { Category, Post } from "@/db/schema";
import { deletePost, savePost } from "./actions";

export function PostForm({ p, categories, saved }: { p?: Post; categories: Category[]; saved?: boolean }) {
  const action = savePost.bind(null, p?.id ?? null);
  const field = "w-full rounded-xl border border-mist bg-white px-4 py-2.5 outline-none focus:border-leaf-bright";
  return (
    <div>
      {saved && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2 text-sm text-leaf">Saved.</p>}
      <form action={action} className="space-y-4">
        <label className="block text-sm font-medium">Title
          <input name="title" required defaultValue={p?.title} className={`${field} mt-1`} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">Slug (URL)
            <input name="slug" defaultValue={p?.slug} placeholder="auto from title" className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-medium">Category
            <select name="categorySlug" defaultValue={p?.categorySlug ?? ""} className={`${field} mt-1`}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">Cover image URL
          <input name="coverImage" defaultValue={p?.coverImage ?? ""} placeholder="/uploads/2022/08/image.jpg" className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium">Excerpt
          <textarea name="excerpt" rows={2} defaultValue={p?.excerpt} className={`${field} mt-1`} />
        </label>
        <label className="block text-sm font-medium">Content (Markdown)
          <textarea name="content" rows={22} defaultValue={p?.content} className={`${field} mt-1 font-mono text-sm`} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={p?.published ?? false} /> Published
        </label>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-leaf px-6 py-2.5 font-medium text-white hover:bg-leaf-bright">Save</button>
          {p && p.published && (
            <a href={`/${p.slug}`} target="_blank" className="rounded-full border border-mist px-6 py-2.5 hover:bg-mist">View</a>
          )}
        </div>
      </form>
      {p && (
        <form action={deletePost.bind(null, p.id)} className="mt-10 border-t border-mist pt-6">
          <button className="text-sm text-red-600 hover:underline">Delete this post</button>
        </form>
      )}
    </div>
  );
}
