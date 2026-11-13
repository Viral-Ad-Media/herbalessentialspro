import { Marked } from "marked";

/** Markdown -> HTML. Raw HTML in the source is escaped, not rendered. */
const md = new Marked({ gfm: true });
md.use({
  renderer: {
    html({ text }) {
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },
    link({ href, text }) {
      const safe = /^(https?:|\/|#|mailto:)/i.test(href) ? href : "#";
      const ext = /^https?:/i.test(safe);
      return `<a href="${safe}"${ext ? ' rel="noopener nofollow" target="_blank"' : ""}>${text}</a>`;
    },
    image({ href, text }) {
      const safe = /^(https?:|\/)/i.test(href) ? href : "";
      return `<img src="${safe}" alt="${text.replace(/"/g, "&quot;")}" loading="lazy" />`;
    },
  },
});

export function renderMarkdown(src: string) {
  return md.parse(src) as string;
}
