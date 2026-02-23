import { DropdownOption } from '@/src/components/ui/dropdowns/SearchDropdown';
import { FilterSortStatus } from '@/src/types/filter.types';

export const STATUS_OPTIONS: DropdownOption<FilterSortStatus>[] = [
  { label: 'Created', value: 'created' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Delayed', value: 'delayed' },
];

export const EXCEPTION_OPTIONS = [
  { label: 'No Update (>24h)', value: 'no_update', icon: 'orange' },
  { label: 'Missing POD', value: 'missing_pod', icon: 'red' },
  { label: 'Critical Delay', value: 'critical_delay', icon: 'yellow' },
  { label: 'Not Dispatched', value: 'not_dispatched', icon: 'gray' },
];
