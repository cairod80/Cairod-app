import { useState, useEffect } from "react";

export default function PWAInstallButton({ style = {} }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const standalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) { setIsInstalled(true); return; }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handlePress = async () => {
    if (isIOS || !deferredPrompt) {
      setShowInstructions(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  const iosSteps = [
    { icon: "1️⃣", text: "Open this page in Safari (not Chrome)" },
    { icon: "2️⃣", text: 'Tap the Share button at the bottom (box with arrow pointing up)' },
    { icon: "3️⃣", text: 'Scroll and tap "Add to Home Screen"' },
    { icon: "4️⃣", text: 'If you see "Open as Web App" — turn it on, then tap Add' },
  ];

  const androidSteps = [
    { icon: "1️⃣", text: "Open this page in Chrome" },
    { icon: "2️⃣", text: "Tap the ⋮ menu in the top right" },
    { icon: "3️⃣", text: 'Tap "Add to Home Screen" or "Install App"' },
  ];

  const steps = isIOS ? iosSteps : androidSteps;

  return (
    <>
      <button
        onClick={handlePress}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 12,
          border: "none",
          background: "var(--g, #4DD994)",
          color: "#03311A",
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
        📲 {isIOS ? "Add to Home Screen" : "Install App"}
      </button>

      {showInstructions && (
        <div
          onClick={() => setShowInstructions(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1A2A1E",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 44px",
              width: "100%",
              maxWidth: 480,
            }}
          >
            <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, color: "#FEFCF7", marginBottom: 6 }}>
              Install Xairod
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
              {isIOS ? "Follow these steps in Safari:" : "Follow these steps in Chrome:"}
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "12px 0",
                  borderBottom: index < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{step.icon}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  {step.text}
                </span>
              </div>
            ))}

            {isIOS && (
              <div style={{
                marginTop: 16,
                background: "rgba(77,217,148,0.08)",
                border: "1px solid rgba(77,217,148,0.15)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 12,
                color: "rgba(77,217,148,0.8)",
              }}>
                ℹ️ Must be done in Safari — Chrome on iPhone does not support this
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              style={{
                marginTop: 16,
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Outfit',sans-serif",
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
