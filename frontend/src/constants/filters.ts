import { DropdownOption } from '@/src/components/ui/dropdowns/SearchDropdown';
import { FilterSortStatus } from '@/src/types/filter.types';

export const STATUS_OPTIONS: DropdownOption<FilterSortStatus>[] = [
  { label: 'Created', value: 'Created' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'In Transit', value: 'In Transit' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Delayed', value: 'Delayed' },
];

export const EXCEPTION_OPTIONS = [
  { label: 'No Update (>24h)', value: 'no_update', icon: 'orange' },
  { label: 'Missing POD', value: 'missing_pod', icon: 'red' },
  { label: 'Critical Delay', value: 'critical_delay', icon: 'yellow' },
  { label: 'Not Dispatched', value: 'not_dispatched', icon: 'gray' },
];
