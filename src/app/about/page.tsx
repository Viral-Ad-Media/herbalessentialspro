import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: "Who we are and how we write about herbs." };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-script text-2xl text-leaf-bright">Hello, and welcome</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">About Herbal Essentials Pro</h1>
      <div className="prose-herbal mt-6">
        <p>
          Herbal Essentials Pro started with a simple idea: herbal teas and natural remedies deserve
          clear, honest information. That means not hype, and not fear either.
        </p>
        <h2>How we write</h2>
        <ul>
          <li><strong>Evidence-aware.</strong> We say when research is strong, mixed or missing.</li>
          <li><strong>Safety first.</strong> Every guide covers who should be careful and why.</li>
          <li><strong>Practical.</strong> You get real brewing ratios, steep times and storage tips.</li>
        </ul>
        <h2>A note on medical advice</h2>
        <p>
          We are not a substitute for your doctor or pharmacist. If you are pregnant,
          breastfeeding, managing a health condition or taking medication, please check with a
          professional before trying a new herb.
        </p>
      </div>
    </div>
  );
}
