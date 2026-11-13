import Link from "next/link";
import { Logo } from "./logo";

const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/category/benefits", label: "Benefits" },
  { href: "/category/wellness", label: "Wellness" },
  { href: "/category/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Herbal Essentials Pro home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-slate transition hover:bg-mist hover:text-leaf"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
