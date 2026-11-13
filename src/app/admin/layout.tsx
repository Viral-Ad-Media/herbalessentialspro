import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SignOutButton } from "./sign-out";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/sign-in");
  if ((s.user as { role?: string }).role !== "admin") {
    return <p className="mx-auto max-w-3xl px-4 py-16">Your account doesn&apos;t have admin access.</p>;
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="text-xl font-semibold">Admin</Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{s.user.email}</span>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
