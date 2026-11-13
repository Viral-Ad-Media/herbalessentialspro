"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await signOut(); router.push("/"); router.refresh(); }}
      className="rounded-full border border-mist px-4 py-1.5 hover:bg-mist"
    >
      Sign out
    </button>
  );
}
