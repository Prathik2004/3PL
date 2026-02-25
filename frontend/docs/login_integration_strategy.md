# Login Page Integration Strategy

## 1. Analysis of Existing Implementation

Based on a detailed review of the frontend and backend codebases:

### Current State

- **Connection Status:** ❌ **Not Connected**. The frontend `LoginCard.tsx` is an isolated, purely static UI component.
- **Frontend Layer:** The `LoginCard` manages local state for a `selectedRole`, renders mock placeholders, and has a static "Sign In" `BasicButton` with no `onClick` handler.
- **Backend API Layer (Jails / JS Backend):** The backend actively exposes a `POST /api/auth/login` endpoint (handled by `loginUser` in the JS backend). It requires an `email` and `password`. It responds with authentication tokens (JWT: `accessToken` and `refreshToken`).

## 2. Integration Strategy

To connect the `LoginCard` to the backend cleanly, scalably, and securely without introducing tight coupling, we will use the following strategies:

### A. Authentication Handling

- **Mechanism:** JWT (JSON Web Tokens) issued by the backend.
- **Storage:**
  - `accessToken` -> `localStorage` (Short-lived, sent in headers).
  - `refreshToken` -> Wait, typically HttpOnly cookies are best, but looking at the backend code, it returns `tokens` directly in the JSON response payload. Therefore, the frontend will store the `accessToken` and `refreshToken` securely in `localStorage` (as `apiClient.ts` already looks for `localStorage.getItem("accessToken")`).
- **State Management:** Use a React Context (`AuthContext`) to maintain global logged-in state across the application without prop drilling.

### B. Separation of Concerns

1. **UI Components (`LoginCard.tsx`):** Handles visual rendering, capturing raw input, and triggering a higher-level hook. Does _not_ make `fetch` calls directly.
2. **Domain Hook (`useLogin.ts`):** A custom hook (potentially bridging `react-query` or just exposing a generic async function) that orchestrates the loading state, error catching, and routing push logic.
3. **API Service (`auth.service.ts`):** Contains the exact API mappings. Knows the route (`/api/auth/login`) and the payload structure.
4. **Transport Layer (`apiClient.ts`):** Already implemented in the previous architecture phase. Injects the base config and handles specific `AppApiError` transformations.

## 3. Implementation Plan & Folder Structure Impact

### Folder Structure Additions

```text
frontend/src/
├── lib/
│   ├── services/
│   │   └── auth.service.ts   <-- (NEW) API mappings for /auth endpoints
│   └── context/
│       └── AuthContext.tsx   <-- (NEW) Manages global user/token state
├── hooks/
│   └── useLogin.ts           <-- (NEW) Bridges UI loading/errors with API
└── components/
    └── ui/login/
        ├── LoginCard.tsx     <-- (MODIFY) Wire up to useLogin
        └── BasicInput.tsx    <-- (MODIFY) Need to ensure it supports controlled `onChange`
```

### Steps to Implement

1. **Service Layer (`auth.service.ts`)**:
   Create the exact DTO types for Login (e.g., `LoginPayload`, `LoginResponse`) and implement `authService.login(payload)`.

2. **Hook Layer (`useLogin.ts`)**:
   Create a hook that exposes `login(email, password)`, `isLoading`, and `error`. It handles writing the tokens to `localStorage` and pushing the router to `/dashboard`.

3. **UI Wiring (`LoginCard.tsx`)**:
   Add `email` and `password` to the component state. Pass them to the `useLogin` hook when the user clicks the "Sign In" button. Display error messages globally (via toast) or underneath the inputs.

## 4. Example Implementation

### `lib/services/auth.service.ts`

```typescript
import { apiClient } from "../api/client";
import { LoginPayload, AuthTokens } from "../../../shared/types/auth.types"; // Assuming extracted

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    return apiClient<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
```

### `components/ui/login/LoginCard.tsx` Snippet

```tsx
const handleLogin = async () => {
  try {
    await login(email, password); // from useLogin hook
    router.push("/dashboard");
  } catch (err) {
    if (err instanceof AppApiError) {
      toast.error(err.message);
    }
  }
};
```

## 5. Potential Edge Cases

- **Rate Limiting / Brute Force:** If a user clicks 'Login' rapidly, the button should implement a strictly `disabled={isLoading}` state to prevent double submissions.
- **Refresh Token Expiry:** Currently, the `apiClient` doesn't automatically rotate tokens. If the `accessToken` expires (401 response), the frontend should catch this and attempt to hit `/api/auth/refresh`, or immediately bounce the user to `/login`.
- **Pre-filled Passwords:** `BasicInput` needs proper `<input type="password" />` to hide characters.

## 6. Testing Strategy

1. **Unit Testing:** Form validations (e.g., valid email regex) in the component layer using Jest.
2. **Integration Testing:** Mock the `apiClient` using MSW (Mock Service Worker) to return successful and failed login payloads to ensure the UI updates error text or redirects accurately.
3. **E2E Testing:** Playwright tests hitting the live Jails backend with seeded credentials (from `admin@walkwel.com`) to verify end-to-end token generation and dashboard redirection.
