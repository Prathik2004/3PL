'use client';

import { useTransition, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FilterState, FilterSortStatus, FilterCarrier } from '@/src/types/filter.types';

export const useFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters: FilterState = {
    status: (searchParams.get('status') as FilterSortStatus) || 'all',
    carrier: (searchParams.get('carrier') as FilterCarrier) || 'all',
    client: searchParams.get('client') || 'all',
    exceptions: (searchParams.get('exceptions') as FilterState['exceptions']) || 'all',
  };

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === 'all' || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  return { filters, updateFilter, clearFilters, isPending };
};
