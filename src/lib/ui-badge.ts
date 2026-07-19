export type BadgeTone = 'primary' | 'surface' | 'error' | 'warning' | 'success' | 'info';
export type BadgeVariant = 'outline' | 'soft' | 'ghost';

export const badgeBaseClass =
  'badge inline-flex h-auto min-h-[1.9rem] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium tracking-[0.03em] shadow-none';

export const badgeToneClasses: Record<BadgeTone, Record<BadgeVariant, string>> = {
  primary: {
    outline: 'badge-outline border-m3-primary/10 bg-primary-container/45 text-m3-primary',
    soft: 'border-transparent bg-primary-container/75 text-m3-primary',
    ghost: 'border-transparent bg-primary-container/40 text-m3-primary/85',
  },
  surface: {
    outline: 'badge-outline border-outline-variant/70 bg-surface-container-low/75 text-on-surface-variant',
    soft: 'border-transparent bg-surface-container-high/80 text-on-surface-variant',
    ghost: 'border-transparent bg-surface-container-low/55 text-on-surface-variant/90',
  },
  error: {
    outline: 'badge-outline border-m3-error/10 bg-error-container/60 text-m3-error',
    soft: 'border-transparent bg-error-container/85 text-m3-error',
    ghost: 'border-transparent bg-error-container/55 text-m3-error/85',
  },
  warning: {
    outline: 'badge-outline border-warning/12 bg-tertiary-container/65 text-warning',
    soft: 'border-transparent bg-tertiary-container/85 text-warning',
    ghost: 'border-transparent bg-tertiary-container/55 text-warning/85',
  },
  success: {
    outline: 'badge-outline border-success/12 bg-success/10 text-success',
    soft: 'border-transparent bg-success/16 text-success',
    ghost: 'border-transparent bg-success/10 text-success/85',
  },
  info: {
    outline: 'badge-outline border-info/10 bg-secondary-container/70 text-info',
    soft: 'border-transparent bg-secondary-container/90 text-info',
    ghost: 'border-transparent bg-secondary-container/55 text-info/85',
  },
};

interface GetBadgeClassesOptions {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  baseClass?: string;
  className?: string;
}

export function getBadgeClasses(options: GetBadgeClassesOptions = {}) {
  const {
    tone = 'primary',
    variant = 'outline',
    baseClass = badgeBaseClass,
    className = '',
  } = options;

  return [baseClass, badgeToneClasses[tone][variant], className].filter(Boolean).join(' ');
}
