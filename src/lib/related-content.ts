type RelatableItem = {
  slug: string;
  title: string;
  category?: string;
  tags?: string[];
  summary?: string;
  extraText?: string[];
  date?: string;
  href: string;
  typeLabel: string;
  badgeTone?: 'primary' | 'surface' | 'error' | 'warning' | 'success' | 'info';
};

function normalizeToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((token) => token.length >= 3);
}

function uniqueTokens(values: string[]) {
  return Array.from(new Set(values.flatMap(normalizeToken)));
}

export function buildRelationTokens(item: {
  slug: string;
  category?: string;
  tags?: string[];
  summary?: string;
  extraText?: string[];
}) {
  return uniqueTokens([
    item.slug,
    item.category ?? '',
    ...(item.tags ?? []),
    item.summary ?? '',
    ...(item.extraText ?? []),
  ]);
}

export function findRelatedContent<TCurrent extends RelatableItem, TCandidate extends RelatableItem>(
  current: TCurrent,
  candidates: TCandidate[],
  limit = 3,
) {
  const sourceTokens = buildRelationTokens(current);

  return candidates
    .filter((candidate) => candidate.href !== current.href)
    .map((candidate) => {
      const candidateTokens = buildRelationTokens(candidate);
      const sharedCount = candidateTokens.filter((token) => sourceTokens.includes(token)).length;
      const sameCategory = current.category && candidate.category === current.category ? 2 : 0;
      const score = sharedCount + sameCategory;

      return {
        ...candidate,
        score,
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
    })
    .slice(0, limit);
}
