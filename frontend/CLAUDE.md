# Frontend conventions

- Architecture: Feature-Sliced Design (`app/ → pages/ → widgets/ → features/ → entities/ → shared/`). A slice may only import from itself or from layers below it; expose its API through `index.ts`.
- Functions: always arrow functions (`const fn = () => {}`), never `function` declarations or expressions. Enforced by the `func-style` ESLint rule.
- Types: define a separate named interface for a function's parameters when the parameter list is non-trivial. Components always get a dedicated `Props` interface for their props (e.g. `interface LoginFormProps { ... }`), even when the only consumer is that component.
- `apiRequest` (`shared/api/http-client.ts`) owns token attachment and refresh-on-401 retry internally, via `configureApiAuth` (registered once in `entities/user`). Callers never attach `Authorization` headers or handle 401s themselves — pass `{ auth: false }` only for endpoints that must run unauthenticated (login/register/refresh).
