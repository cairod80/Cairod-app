// Xairod PWA Install Button Component
// Add <PWAInstallButton /> anywhere in your app (e.g. profile tab or home screen)
// It auto-hides when already installed or on iOS (shows instructions instead)

import { useState, useEffect } from "react";

export default function PWAInstallButton({ style = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) { setIsInstalled(true); return; }

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.MSStream;
    setIsIOS(ios);

    // Listen for Android install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // Already installed — show nothing
  if (isInstalled) return null;

  // Android — show native install button when prompt is ready
  if (!isIOS && deferredPrompt) {
    return (
      <button
        onClick={handleAndroidInstall}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 12,
          border: "1.5px solid rgba(77,217,148,0.3)",
          background: "rgba(77,217,148,0.08)",
          color: "var(--g, #4DD994)",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          ...style,
        }}
      >
        📲 Install Xairod App
      </button>
    );
  }

  // iOS — show instructions button
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSInstructions(true)}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            border: "1.5px solid rgba(77,217,148,0.3)",
            background: "rgba(77,217,148,0.08)",
            color: "var(--g, #4DD994)",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            ...style,
          }}
        >
          📲 Add to Home Screen
        </button>

        {showIOSInstructions && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 9999,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "0 0 0 0",
            }}
            onClick={() => setShowIOSInstructions(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#1A2A1E",
                borderRadius: "20px 20px 0 0",
                padding: "24px 20px 40px",
                width: "100%",
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 2,
                  margin: "0 auto 20px",
                }}
              />
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#FEFCF7",
                  marginBottom: 6,
                }}
              >
                Install Xairod on iPhone
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 24,
                }}
              >
                Open this page in Safari, then:
              </div>
              {[
                { icon: "1️⃣", text: 'Tap the Share button at the bottom of Safari (the box with an arrow pointing up)' },
                { icon: "2️⃣", text: 'Scroll down and tap "Add to Home Screen"' },
                { icon: "3️⃣", text: 'If you see "Open as Web App" — enable it' },
                { icon: "4️⃣", text: 'Tap "Add" in the top right — done!' },
              ].map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    padding: "12px 0",
                    borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                    {step.text}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(77,217,148,0.08)",
                  border: "1px solid rgba(77,217,148,0.15)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "rgba(77,217,148,0.8)",
                }}
              >
                ℹ️ This must be done in Safari. Chrome and other browsers on iPhone do not support Add to Home Screen.
              </div>
              <button
                onClick={() => setShowIOSInstructions(false)}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Non-iOS, no prompt yet (desktop or unsupported browser) — render nothing
  return null;
}
