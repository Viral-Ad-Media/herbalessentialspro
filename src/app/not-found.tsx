import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-script text-3xl text-leaf-bright">Oops</p>
      <h1 className="mt-2 text-3xl font-semibold">This page has steeped too long</h1>
      <p className="mt-3 text-muted">We couldn&apos;t find what you were looking for.</p>
      <Link href="/blog" className="mt-8 inline-block rounded-full bg-leaf px-6 py-3 font-medium text-white">Browse the blog</Link>
    </div>
  );
}
