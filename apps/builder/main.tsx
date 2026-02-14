import "./app.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { deckConfig } from "../../deck.config";
import { getRouter } from "./router";

function loadGoogleFonts() {
  if (document.querySelector("link[data-builder-fonts]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = deckConfig.theme.googleFontsUrl;
  link.dataset.builderFonts = "";
  document.head.appendChild(link);
}

const router = getRouter();

function App() {
  useEffect(loadGoogleFonts, []);
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
