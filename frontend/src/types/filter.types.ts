export type FilterSortStatus = 'active' | 'pending' | 'completed' | 'all';
export type FilterCarrier = 'fedex' | 'ups' | 'usps' | 'dhl' | 'all';
export type FilterException = 'no_update' | 'missing_pod' | 'critical_delay' | 'all';

export interface FilterState {
  client: string;
  carrier: FilterCarrier;
  status: FilterSortStatus;
  exceptions: FilterException;
}
