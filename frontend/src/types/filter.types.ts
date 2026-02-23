export type FilterSortStatus = 'created' | 'dispatched' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'delayed' | 'all';
export type FilterCarrier = 'fedex' | 'ups' | 'usps' | 'dhl' | 'all';
export type FilterException = 'no_update' | 'missing_pod' | 'critical_delay' | 'not_dispatched' | 'all';

export interface FilterState {
  client: string;
  carrier: FilterCarrier;
  status: FilterSortStatus;
  exceptions: FilterException;
}
