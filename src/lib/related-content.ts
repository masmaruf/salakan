import type { KONTEN_RELASI_TYPES } from './content-taxonomy';

export type RelationContentType = (typeof KONTEN_RELASI_TYPES)[number];

export type ManualRelationRef = {
  type: RelationContentType;
  slug: string;
  label?: string;
};

export type RelatableItem = {
  slug: string;
  title: string;
  type: RelationContentType;
  category?: string;
  tags?: string[];
  summary?: string;
  extraText?: string[];
  keywords?: string[];
  manualRefs?: ManualRelationRef[];
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
  keywords?: string[];
}) {
  return uniqueTokens([
    item.slug,
    item.category ?? '',
    ...(item.tags ?? []),
    item.summary ?? '',
    ...(item.extraText ?? []),
    ...(item.keywords ?? []),
  ]);
}

function hasManualRelation(source: Pick<RelatableItem, 'manualRefs'>, candidate: Pick<RelatableItem, 'type' | 'slug'>) {
  return (source.manualRefs ?? []).some((item) => item.type === candidate.type && item.slug === candidate.slug);
}

export function findRelatedContent<TCurrent extends RelatableItem, TCandidate extends RelatableItem>(
  current: TCurrent,
  candidates: TCandidate[],
  limit = 3,
) {
  const sourceTokens = buildRelationTokens(current);
  const sourceTags = new Set((current.tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean));

  return candidates
    .filter((candidate) => candidate.href !== current.href)
    .map((candidate) => {
      const candidateTokens = buildRelationTokens(candidate);
      const sharedTokens = candidateTokens.filter((token) => sourceTokens.includes(token));
      const sharedTags = (candidate.tags ?? []).filter((tag) => sourceTags.has(tag.trim().toLowerCase()));
      const sameCategory = current.category && candidate.category === current.category ? 4 : 0;
      const sameType = candidate.type === current.type ? 2 : 0;
      const manualBoost =
        hasManualRelation(current, candidate) || hasManualRelation(candidate, current)
          ? 24
          : 0;
      const tagScore = sharedTags.length * 6;
      const tokenScore = Math.min(sharedTokens.length, 6);
      const score = manualBoost + tagScore + sameCategory + sameType + tokenScore;

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
