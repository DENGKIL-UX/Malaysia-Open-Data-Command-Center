'use client';

import { useEffect } from 'react';
import { useLang } from '@/i18n';

/**
 * Syncs the Zustand language store with document.documentElement.lang.
 * Rendered inside <Providers> in layout.tsx so the <html lang> attribute
 * stays in sync with the persisted language preference.
 */
export function LangAttrSync() {
  const lang = useLang((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
