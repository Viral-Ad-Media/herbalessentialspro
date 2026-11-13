export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function readingTime(markdown: string) {
  return Math.max(1, Math.round(markdown.split(/\s+/).length / 220));
}
