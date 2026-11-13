import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { getCategories, getPublishedPosts } from "@/lib/posts";

export const revalidate = 300;

export default async function Home() {
  const [posts, categories] = await Promise.all([getPublishedPosts(7), getCategories()]);
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <Image
          src="/uploads/2022/04/photo-1533038590840-1cde6e668a91-2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="font-script text-2xl text-mint">Brewed with care</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
            Herbal teas &amp; natural wellness, explained honestly
          </h1>
          <p className="mt-5 max-w-xl text-white/80">
            Benefits, brewing tips and the safety notes most sites leave out, so you can choose the
            right cup for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="rounded-full bg-leaf-bright px-6 py-3 font-medium text-white hover:bg-leaf">
              Read the blog
            </Link>
            <Link href="/category/side-effects" className="rounded-full border border-white/40 px-6 py-3 font-medium hover:bg-white/10">
              Safety first
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-2xl bg-white p-5 ring-1 ring-black/5 transition hover:ring-leaf-bright"
            >
              <h2 className="font-semibold text-leaf">{c.name}</h2>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4">
          <Link href={`/${featured.slug}`} className="group grid overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto">
              {featured.coverImage && (
                <Image src={featured.coverImage} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-leaf-bright">Latest</span>
              <h2 className="mt-2 text-2xl font-semibold leading-snug group-hover:text-leaf md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-muted">{featured.excerpt}</p>
              <span className="mt-6 font-medium text-leaf">Read article →</span>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Fresh from the blog</h2>
          <Link href="/blog" className="text-sm font-medium text-leaf hover:underline">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>
    </>
  );
}
