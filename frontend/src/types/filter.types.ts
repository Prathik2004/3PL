// Matches exactly what the DB stores in the `status` field
export type FilterSortStatus =
  | 'Created'
  | 'Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Cancelled'
  | 'all';

// Carrier is now any string (dynamic from DB) — kept as string union for flexibility
export type FilterCarrier = string;

export type FilterException = 'no_update' | 'missing_pod' | 'critical_delay' | 'not_dispatched' | 'all';

export interface FilterState {
  client: string;
  carrier: FilterCarrier;
  status: FilterSortStatus;
  exceptions: FilterException;
}
