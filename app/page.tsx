"use client";

// Try to import the original App component if present (App.tsx or index.tsx)
let AppComponent: any = null;
try {
  // prefer App.tsx
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppComponent = require("../App").default;
} catch (e) {
  try {
    AppComponent = require("../index").default;
  } catch (err) {
    AppComponent = null;
  }
}

export default function Page() {
  if (AppComponent) {
    const C = AppComponent;
    return <C />;
  }
  return (
    <main style={{ padding: 20 }}>
      <h1>Converted Next.js App</h1>
      <p>
        No root App component found to render. Check <code>App.tsx</code> or{" "}
        <code>index.tsx</code> in project root.
      </p>
    </main>
  );
}
