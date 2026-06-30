import type { CSSProperties } from 'react';
import { resolveIcon } from '../../lib/icons';

interface Props {
  name?: string | null;
  class?: string;
  className?: string;
  title?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

export default function Icon({
  name,
  class: classProp,
  className,
  title,
  strokeWidth = 1.9,
  style,
}: Props) {
  const LucideIcon = resolveIcon(name);
  const mergedClassName = [
    'inline-flex shrink-0 align-middle',
    classProp,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <LucideIcon
      className={mergedClassName}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? 'img' : undefined}
      strokeWidth={strokeWidth}
      style={{ width: '1em', height: '1em', ...style }}
    />
  );
}
