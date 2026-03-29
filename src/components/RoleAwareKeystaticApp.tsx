import React from 'react';
import { makePage } from '@keystatic/astro/ui';
import { getKeystaticConfigForRole } from '../lib/keystatic-role-config';
import type { AdminRole } from '../lib/admin-auth';

const FullKeystaticPage = makePage(getKeystaticConfigForRole('superadmin'));
const EditorKeystaticPage = makePage(getKeystaticConfigForRole('editor'));

type Props = {
  role: AdminRole;
};

export default function RoleAwareKeystaticApp({ role }: Props) {
  const Page = role === 'editor' ? EditorKeystaticPage : FullKeystaticPage;
  return <Page />;
}
