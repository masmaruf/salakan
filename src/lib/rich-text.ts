import { marked } from 'marked';

const entityMap: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

export function renderMarkdown(value?: string) {
  if (!value?.trim()) return '';
  return marked.parse(value, { breaks: true }) as string;
}

export function markdownToText(value?: string) {
  if (!value?.trim()) return '';

  const html = renderMarkdown(value);
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (entity) => entityMap[entity] ?? entity)
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerptMarkdown(value?: string, maxLength = 160) {
  const text = markdownToText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
