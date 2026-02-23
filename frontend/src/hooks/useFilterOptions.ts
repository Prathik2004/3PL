// src/hooks/useFilterOptions.ts
import { useState, useEffect } from 'react';
import { fetchClientsApi, fetchCarriersApi, BackendClientData, BackendCarrierData } from '@/src/utils/filters';
import { DropdownOption } from '@/src/components/ui/dropdowns/SearchDropdown';
import { FilterCarrier } from '@/src/components/common/FilterBar';

export function useFilterOptions() {
  const [clientOptions, setClientOptions] = useState<DropdownOption<string>[]>([]);
  const [carrierOptions, setCarrierOptions] = useState<DropdownOption<FilterCarrier>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; 

    async function loadOptions() {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch data from backend concurrently (for speed)
        const [rawClients, rawCarriers] = await Promise.all([
          fetchClientsApi(),
          fetchCarriersApi()
        ]);

        if (!isMounted) return;

        // 2. Transform the raw backend data into dropdown-friendly `DropdownOption` objects
        // E.g. { id: 'acme', name: 'Acme Corp' } -> { value: 'acme', label: 'Acme Corp' }
        const mappedClients: DropdownOption<string>[] = rawClients.map((client: BackendClientData) => ({
            label: client.name,
            value: client.id
        }));

        const mappedCarriers: DropdownOption<FilterCarrier>[] = rawCarriers.map((carrier: BackendCarrierData) => ({
            label: carrier.name,
            value: carrier.id as FilterCarrier, 
        }));

        // 3. Unshift the "All" default options to the very front of the dropdown list
        setClientOptions([
            { label: 'All', value: 'all' }, 
            ...mappedClients
        ]);

        setCarrierOptions([
            { label: 'All', value: 'all' }, 
            ...mappedCarriers
        ]);

      } catch (err) {
        if (isMounted) {
            console.error("Failed to load filter options", err);
            setError(err instanceof Error ? err : new Error('Unknown error fetching options'));
            
            // Fallback options in case the API completely fails
            setClientOptions([{ label: 'All (Error loading)', value: 'all' }]);
            setCarrierOptions([{ label: 'All (Error loading)', value: 'all' }]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOptions();

    return () => { isMounted = false; };
  }, []);

  return { clientOptions, carrierOptions, isLoading, error };
}
