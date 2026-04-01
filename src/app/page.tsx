"use client";

import { useState, useEffect } from "react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

interface Config {
  logo: string;
  name: string;
  subtitle: string;
  links: LinkItem[];
}

const DEFAULT_CONFIG: Config = {
  logo: "",
  name: "myClaude News",
  subtitle: "The marketplace for the Claude Code ecosystem",
  links: [
    { id: "1", title: "myClaude Marketplace", url: "https://myclaude.sh", icon: "🏪" },
    { id: "2", title: "Explore Products", url: "https://myclaude.sh/explore", icon: "🔍" },
    { id: "3", title: "Unreal Forge Pro", url: "https://myclaude.sh/p/unreal-forge-pro", icon: "🎮" },
    { id: "4", title: "Eva Genesis — Design System", url: "https://myclaude.sh/p/eva-genesis", icon: "🎨" },
    { id: "5", title: "La Bottega — Multi-Agent Framework", url: "https://myclaude.sh/p/la-bottega", icon: "🏛️" },
    { id: "6", title: "Just Status Line — 12 Themes", url: "https://myclaude.sh/p/just-statusline-vol1", icon: "🖥️" },
    { id: "7", title: "Kairo — Synthetic Reasoning", url: "https://myclaude.sh/p/kairo-synthetic-reasoning", icon: "🧠" },
    { id: "8", title: "Instagram @myclaudenews", url: "https://instagram.com/myclaudenews", icon: "📸" },
  ],
};

function getConfig(): Config {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem("myclaude-links-config");
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_CONFIG;
}

export default function LinksPage() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  useEffect(() => {
    setConfig(getConfig());
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0C0C0B 0%, #111110 50%, #0C0C0B 100%)",
      display: "flex",
      justifyContent: "center",
      padding: "0 16px",
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(200,121,65,0.06) 0%, transparent 50%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 480,
        padding: "48px 0 64px",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 24,
      }}>
        {/* Logo */}
        {config.logo && (
          <img
            src={config.logo}
            alt={config.name}
            style={{ width: 88, height: 88, borderRadius: "50%", border: "2px solid #2E2C29", objectFit: "cover" }}
          />
        )}
        {!config.logo && (
          <div style={{
            width: 88, height: 88, borderRadius: "50%", border: "2px solid #2E2C29",
            background: "#161514", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 32, color: "#C87941", fontWeight: 700,
          }}>
            {config.name[0] ?? "M"}
          </div>
        )}

        {/* Name */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800,
            color: "#FAF9F5", letterSpacing: "-0.02em",
          }}>
            {config.name}
          </h1>
          {config.subtitle && (
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              color: "#706B63", marginTop: 6, lineHeight: 1.4,
            }}>
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Links */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {config.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 20px",
                background: "#161514",
                border: "1px solid #2E2C29",
                borderRadius: 12,
                textDecoration: "none",
                color: "#FAF9F5",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(200,121,65,0.4)";
                e.currentTarget.style.background = "#1A1918";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2E2C29";
                e.currentTarget.style.background = "#161514";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              {link.icon.startsWith("http") ? (
                <img src={link.icon} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <span style={{ fontSize: 24, width: 36, textAlign: "center", flexShrink: 0 }}>{link.icon}</span>
              )}
              {/* Text */}
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
                flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {link.title}
              </span>
              {/* Arrow */}
              <span style={{ fontSize: 14, color: "#706B63", flexShrink: 0 }}>→</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: "#2E2C29", marginTop: 24, letterSpacing: "0.05em",
        }}>
          myclaude.sh
        </p>
      </div>
    </div>
  );
}
