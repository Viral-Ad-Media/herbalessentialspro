import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="rounded-xl bg-white p-3 inline-block">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Practical, evidence-aware guides to herbal teas and natural wellness.
          </p>
        </div>
        <div className="text-sm">
          <h3 className="mb-3 font-semibold text-white">Explore</h3>
          <ul className="space-y-2">
            <li><Link className="hover:text-mint" href="/blog">All articles</Link></li>
            <li><Link className="hover:text-mint" href="/category/benefits">Tea benefits</Link></li>
            <li><Link className="hover:text-mint" href="/category/side-effects">Side effects & safety</Link></li>
            <li><Link className="hover:text-mint" href="/about">About us</Link></li>
          </ul>
        </div>
        <div className="text-sm leading-relaxed">
          <h3 className="mb-3 font-semibold text-white">Health disclaimer</h3>
          <p>
            Content on this site is for general information only and is not a substitute for
            professional medical advice. Talk to your doctor or pharmacist before using herbs if you
            are pregnant, breastfeeding, or taking medication.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Herbal Essentials Pro
      </div>
    </footer>
  );
}
