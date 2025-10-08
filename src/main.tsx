import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { HashRouter } from "react-router-dom"; 
import "./index.css";
import App from "./App.tsx";
import i18n from "./i18n";
import { store } from "./store";
import { ActivityProvider } from "./contexts/ActivityContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";

// Global reference to prevent multiple root creation
let appRoot: ReturnType<typeof createRoot> | null = null;

function initializeApp() {
  const container = document.getElementById("root");
  if (!container) {
    console.error("Root container not found");
    return;
  }

  // Only create root if it doesn't exist
  if (!appRoot) {
    appRoot = createRoot(container);
  }

  // Render the app
  appRoot.render(
    <StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <ToastProvider>
              <ActivityProvider>
                <HashRouter>  {}
                  <App />
                </HashRouter>
              </ActivityProvider>
            </ToastProvider>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </StrictMode>,
  );
}

// Initialize the app
initializeApp();
