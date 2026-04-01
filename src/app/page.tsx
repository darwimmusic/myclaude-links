"use client";

import { useState, useEffect } from "react";
import { onConfigChange, DEFAULT_CONFIG, type LinktreeConfig } from "@/lib/firebase";

export default function LinksPage() {
  const [config, setConfig] = useState<LinktreeConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onConfigChange((c) => {
      setConfig(c);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0C0C0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid #2E2C29", borderTopColor: "#C87941", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0C0C0B 0%, #111110 50%, #0C0C0B 100%)",
      display: "flex", justifyContent: "center", padding: "0 16px",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(200,121,65,0.06) 0%, transparent 50%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 480,
        padding: "48px 0 64px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        {config.logo ? (
          <img src={config.logo} alt={config.name}
            style={{ width: 88, height: 88, borderRadius: "50%", border: "2px solid #2E2C29", objectFit: "cover" }} />
        ) : (
          <div style={{
            width: 88, height: 88, borderRadius: "50%", border: "2px solid #2E2C29",
            background: "#161514", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 32, color: "#C87941", fontWeight: 700,
          }}>{config.name[0] ?? "M"}</div>
        )}

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: "#FAF9F5", letterSpacing: "-0.02em" }}>
            {config.name}
          </h1>
          {config.subtitle && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#706B63", marginTop: 6, lineHeight: 1.4 }}>
              {config.subtitle}
            </p>
          )}
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {config.links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                background: "#161514", border: "1px solid #2E2C29", borderRadius: 12,
                textDecoration: "none", color: "#FAF9F5", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,121,65,0.4)"; e.currentTarget.style.background = "#1A1918"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2E2C29"; e.currentTarget.style.background = "#161514"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {link.icon.startsWith("http") ? (
                <img src={link.icon} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <span style={{ fontSize: 24, width: 36, textAlign: "center", flexShrink: 0 }}>{link.icon}</span>
              )}
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {link.title}
              </span>
              <span style={{ fontSize: 14, color: "#706B63", flexShrink: 0 }}>→</span>
            </a>
          ))}
        </div>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#2E2C29", marginTop: 24, letterSpacing: "0.05em" }}>
          myclaude.sh
        </p>
      </div>
    </div>
  );
}
