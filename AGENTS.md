<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Component conventions

Always use named arrow function exports for components — no `export default function`:

```tsx
// correct
export const MyComponent = () => { ... };

// wrong
export default function MyComponent() { ... }
```

This applies to all files: pages, layouts, components, and UI primitives. Enforced by `react/function-component-definition` in ESLint.
