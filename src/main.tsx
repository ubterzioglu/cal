import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Microsoft Clarity is NOT loaded here. It is injected only after the user
// grants analytics consent via the cookie banner — see src/legal/loaders.ts
// and src/components/legal/CookieBanner.tsx.

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
