# 3PL API Integration Plan

This document outlines the plan for integrating the backend API with the Shipments module of the 3PL frontend.

## Overview
The Shipments API endpoints will replace the current hardcoded data across the frontend components. To centralize the logic, a new service module (e.g., `src/services/shipmentService.ts`) should be created to handle all API calls related to shipments using `fetch` or `axios`. Additionally, the Bearer Token must be injected into the Authorization header for all API calls.

## Endpoints and Component Mapping

### 1. Get All Shipments (GET `/api/shipments`)
**Component**: `src/components/ui/Dashboard/ShipmentTable.tsx`
- **Purpose**: Retrieve a paginated list of shipments to display in the data table.
- **Action Required**: 
  - Remove the hardcoded `const shipments: ShipmentRowProps[]`.
  - Introduce `useEffect` combined with a data fetching hook (or library like React Query/SWR) to load active shipments.
  - Integrate query parameters for `page`, `limit`, and any active filters from the filtering components.
- **Data Hooking**: The paginated JSON array from the response (`data.data`) will need to be mapped to the properties of `ShipmentRowProps`.

### 2. Create Shipment - Manual (POST `/api/shipments`)
**Component**: `src/components/ui/NewShipmentModal.tsx`
- **Purpose**: Submit a user-filled form to add a single shipment.
- **Action Required**: 
  - Add `onSubmit` handler for the form inputs (Shipment Id, Client details, etc.).
  - Map the state variables into the API's expected JSON structure: `shipment_id`, `client_name`, `origin`, `destination`, `dispatch_date`, `expected_delivery_date`, `carrier_name`.
  - Handle success (201 Created) visually by showing a success toast and closing the modal.
  - Handle errors (400 Bad Request) properly by rendering form validation feedback below inputs or as a generic alert.

### 3. Bulk Upload Shipments (POST `/api/shipments/upload`)
**Component**: `src/components/ui/BulkUploadModal.tsx`
- **Purpose**: Upload a CSV file containing multiple shipment records.
- **Action Required**: 
  - Use `FormData` to append the selected CSV file as the `file` field.
  - Set the appropriate Content-Type `multipart/form-data`.
  - On successfully parsing the response (201/207), show a summary of `successful_count` and `error_count`, optionally displaying specific row errors using the `errors` array in the UI.

### 4. Update Shipment Status (PUT `/api/shipments/:id/status`)
**Component**: `src/components/ui/EditShipmentModal.tsx`
- **Purpose**: Update an existing shipment, especially marking its status, delivery dates, and POD tracking.
- **Action Required**: 
  - Send the updated fields: `status`, `delivered_date`, and `pod_received`.
  - On completion, refetch or optimistically update the ShipmentTable component's active data store.
  - Pass the active `shipmentId` appropriately to the route parameters.

### 5. Cancel Shipment - Soft Delete (DELETE `/api/shipments/:id`)
**Component**: `src/components/ui/DeleteModal.tsx`
- **Purpose**: Marks a shipment as Cancelled instead of a hard removal.
- **Action Required**:
  - Connect the "Delete Shipment" confirmation button to the `DELETE` API call.
  - Trigger a UI state update to remove/filter "Cancelled" items from the immediate view or update their status badges to "Cancelled".
  - Show a cancellation successful notification.

## Next Steps
1. Create a `src/services/api.ts` file configured with the base `baseURL`, setting the `Authorization: Bearer <jwt_token>` header on an axios interceptor.
2. Formally type the Request and Response objects using TypeScript interfaces in `src/types/types.ts` to reflect the expected JSON structure specified in the PDF documentation.
3. Migrate each modal/table component sequentially to handle promise lifecycles (loading, success, error) gracefully while integrating these endpoints.
