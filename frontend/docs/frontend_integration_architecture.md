# 3PL Frontend Integration Architecture

## 1. System Architecture Explanation

To integrate one frontend with three different backends that share the precise same API contract, we employ the **API Gateway / Facade Pattern** combined with a **Dynamic Base URL Resolution Strategy**.

The fundamental principle here is **Backend Agnosticism**: the frontend UI components and even the data fetching hooks must have absolutely no awareness of whether they are communicating with the Node.js, PHP, or Python backend. They should only know about domain entities (e.g., `Shipment`, `User`) and domain operations (e.g., `getShipments`).

### Architecture Diagram

```text
+-----------------------------------------------------------------------------+
|                                FRONTEND APP                                 |
|                                                                             |
|  [ UI Components ] <---> [ Application State / React Query Hooks ]          |
|                                    |                                        |
|                                    v                                        |
|  +-----------------------------------------------------------------------+  |
|  |                        API SERVICE LAYER                              |  |
|  |  (Domain-specific: ShipmentService, UserService, AuthService)         |  |
|  +-----------------------------------------------------------------------+  |
|                                    |                                        |
|                                    v                                        |
|  +-----------------------------------------------------------------------+  |
|  |                       CORE HTTP TRANSPORT CLIENT                      |  |
|  |  (Interceptors, Default Headers, Standardized Error Handling)         |  |
|  +-----------------------------------------------------------------------+  |
|                                    |                                        |
|                                    v                                        |
|  +-----------------------------------------------------------------------+  |
|  |                  DYNAMIC BASE URL RESOLVER (Config)                   |  |
|  |  (Reads ENV vars, Cookies, or LocalStorage to route requests)         |  |
|  +-----------------------------------------------------------------------+  |
+------------------------------------|----------------------------------------+
                                     |
           +-------------------------+-------------------------+
           |                         |                         |
           v                         v                         v
 +-------------------+     +-------------------+     +-------------------+
 |    BACKEND (JS)   |     |   BACKEND (PHP)   |     | BACKEND (Python)  |
 |                   |     |                   |     |                   |
 | Base URL:         |     | Base URL:         |     | Base URL:         |
 | http://...:8080   |     | http://...:8000   |     | http://...:5000   |
 +-------------------+     +-------------------+     +-------------------+
```

## 2. Backend Switching Strategy

For a scalable setup, we use a **Hybrid Environment/Runtime Strategy**:

- **Production:** Strictly **Environment-Based**. When building the frontend for production, you inject `NEXT_PUBLIC_API_URL` directly. Dynamic switching is disabled in production to optimize performance, prevent security spoofing, and lock the frontend to its designated stable backend.
- **Development/Testing:** **Runtime-Based / Header-Based**. During local development, developers often need to flip between the JS, PHP, and Python backends to verify parity. We read the target backend from an environment variable (`NEXT_PUBLIC_ACTIVE_BACKEND`) but allow an override via a `localStorage` value or a specific HTTP Header (e.g., `X-Backend-Target`). This allows developers to test different backends without restarting the Next.js server.

## 3. Environment Configuration & Base URL Management

Configuration should be strictly typed. We avoid scattered `process.env` calls. Instead, we centralize configuration and validate it at startup using a schema validation library like Zod.

- `NEXT_PUBLIC_BACKEND_JS_URL=http://backend-js.3utilities.com:8080`
- `NEXT_PUBLIC_BACKEND_PHP_URL=http://localhost:8000`
- `NEXT_PUBLIC_BACKEND_PYTHON_URL=http://localhost:5000`
- `NEXT_PUBLIC_ACTIVE_BACKEND=js` // or 'php', 'python'

The `config/env.ts` file parses these and exports a unified `API_BASE_URL` based on the active selection.

## 4. API Layer Abstraction & Service Layer

We segregate the data fetching into three distinct tiers to ensure zero duplication and perfect decoupling:

1.  **Core HTTP Client (`apiClient.ts`):** A wrapper around the native `fetch` (or Axios). This file handles attaching the JWT Authorization header, setting `Content-Type: application/json`, handling timeouts, and parsing JSON. It uses the Dynamic Base URL.
2.  **Service Domain Modules (`ShipmentService.ts`):** Classes or object literal maps representing the API endpoints exactly as documented in your PDF. They use the Core HTTP Client. _Example: `ShipmentService.getAll()`._
3.  **Data Fetching Hooks (e.g., React Query):** The UI components only invoke React Query hooks (`useShipments()`), which in turn call the Service Domain Modules.

## 5. Shared Types (Monorepo Architecture)

Since this is a monorepo, keeping the API contract strictly synchronized is paramount.

- **Creation:** Create a shared package at the monorepo root (e.g., `packages/shared-types` or `shared/`).
- **Contents:** This folder contains pure TypeScript `.ts` files exporting interfaces, enums, and request/response DTOs (Data Transfer Objects). Example: `IShipment`, `ShipmentStatus`, `CreateShipmentRequest`.
- **Usage:** The Next.js frontend and the Node.js backend both import these types directly. Provide copies or generated schemas for the PHP and Python backends (e.g., using OpenAPI/Swagger generation to keep PHP/Python in sync with the TS source of truth).

## 6. Standardized Error Handling Strategy

Backends and networks fail in unpredictable ways. The frontend must normalize all errors:

- **Backend Contract:** Enforce that _all three backends_ return errors in an identical RFC-7807 compliant structure:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid shipment destination",
      "details": { "destination": "Required field" }
    }
  }
  ```
- **Frontend Client:** Inside the `apiClient.ts`, intercept all responses `!response.ok`. Parse the JSON error body, wrap it in a custom `AppApiError` class, and throw it. The UI layer catches this generic `AppApiError` and displays the `message` seamlessly via a Toast notification system, completely abstracted from HTTP status codes.

## 7. Production vs Development Environments

- **Development (`npm run dev`):** The Base URL resolver checks for a developer override (e.g., a query param `?backend=php` that sets a cookie/localStorage var) combined with the `.env.local` defaults.
- **Production (`npm run build`):** The build script hard-codes the API Base URL for the target production backend. The override logic is stripped out via dead-code elimination (`if (process.env.NODE_ENV === 'development') {...}`).

## 8. Recommended Folder Structure

```text
3PL/
├── shared/                       <-- MONOREPO SHARED TYPES
│   ├── types/
│   │   ├── shipment.types.ts     <-- IShipment, DTOs
│   │   ├── user.types.ts
│   │   └── api.types.ts          <-- Standard API Error Response types
│
├── frontend/                     <-- NEXT.JS APP
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts            <-- Zod validation of environments
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts     <-- Core fetch abstraction & Error Interceptor
│   │   │   │   └── urlResolver.ts<-- Logic that switches Base URLs
│   │   │   │
│   │   │   ├── services/         <-- DOMAIN SERVICES
│   │   │   │   ├── shipment.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── user.service.ts
│   │   │   │
│   │   │   └── errors/
│   │   │       └── AppError.ts   <-- Standardized frontend error class
│   │   │
│   │   ├── hooks/
│   │   │   └── api/              <-- React Query / SWR hooks wrapping services
│   │   │       └── useShipments.ts
│   │   │
│   │   └── app/
│   │       └── (routes)          <-- Pure UI components calling hooks
│   ...
```

## 9. Risk Analysis and Edge Cases

| Risk                                                                                                                                                  | Mitigation Strategy                                                                                                                                                                        |
| :---------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Drift Between Backends**<br>One backend updates an endpoint, the others lag behind, breaking the exact contract expectation.                    | **Contract Testing:** Use a tool like **Pact** or a standardized Postman collection. Run automated API tests against _all three_ backends in CI/CD before allowing a frontend deploy.      |
| **CORS Policy Mismatches**<br>The PHP backend has different CORS headers than the JS backend, causing frontend preflight errors during dev switching. | Enforce standard CORS middleware configurations across all three backends to aggressively whitelist the dev `localhost:3001` and the exact production domain.                              |
| **Auth Secret Divergence**<br>A JWT generated by the JS backend is rejected by the PHP backend when a developer actively switches backends.           | In dev, share the _same_ JWT signing secret (`JWT_SECRET`) across all three backends' local `.env` files.                                                                                  |
| **Pagination Formats**<br>Python returns `{"data": [], "count": 10}`, JS returns `{"items": [], "total": 10}`.                                        | The hardest part of multi-backend parity. You must be ruthless about enforcing identical JSON payload shapes. If impossible, the `apiClient.ts` must contain a normalization mapper layer. |

## 10. Final Recommendation / Next Steps

**Do not implement separate `ApiFetch` logic for each backend.**

My strict recommendation is to:

1.  **Refactor `frontend/src/services/api.ts`** to become the single source of truth `Core HTTP Client` using the `urlResolver` pattern.
2.  **Move any existing interfaces** (`IShipment`, `User`) into a `shared/types` folder outside of both `frontend` and `backend-js` so the Node backend and Frontend can consume the exact same source code.
3.  **Implement a Development Debug Panel:** Build a small, visually hidden "Dev Tools" component in the frontend (only visible if `NODE_ENV === 'development'`) that allows you to select the active backend via a dropdown. This will save endless hours of time compared to restarting the dev server to test JS vs PHP vs Python.
