export function stripHtml(html: string) {
  if (!html) return "";
  // remove tags
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string) {
  if (!text) return 0;
  const cleaned = stripHtml(text);
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(words: number, wpm = 200) {
  if (!words || words <= 0) return 0;
  return Math.max(1, Math.round(words / wpm));
}

export function getPostStats(content: string, wpm = 200) {
  const wordCount = countWords(content || "");
  const minutes = estimateReadingTime(wordCount, wpm);
  return { wordCount, readingTimeMinutes: minutes };
}

export default getPostStats;
