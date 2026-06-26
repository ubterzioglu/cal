import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Analytics scripts (Microsoft Clarity, GoatCounter) are NOT loaded here.
// They are injected only after the user grants analytics consent via the
// cookie banner — see src/legal/loaders.ts and src/components/legal/CookieBanner.tsx.

createRoot(document.getElementById("root")!).render(<App />);
