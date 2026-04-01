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

const DEFAULT: Config = {
  logo: "/logo.png",
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

export default function AdminPage() {
  const [config, setConfig] = useState<Config>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if already authed
    if (typeof window !== "undefined" && localStorage.getItem("myclaude-links-authed") === "true") {
      setAuthed(true);
    }
    // Load config
    try {
      const stored = localStorage.getItem("myclaude-links-config");
      if (stored) setConfig(JSON.parse(stored));
    } catch {}
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_KEY || "myclaude2026")) {
      setAuthed(true);
      localStorage.setItem("myclaude-links-authed", "true");
    }
  }

  function save() {
    localStorage.setItem("myclaude-links-config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addLink() {
    setConfig({
      ...config,
      links: [...config.links, { id: Date.now().toString(), title: "", url: "", icon: "🔗" }],
    });
  }

  function removeLink(id: string) {
    setConfig({ ...config, links: config.links.filter((l) => l.id !== id) });
  }

  function updateLink(id: string, field: keyof LinkItem, value: string) {
    setConfig({
      ...config,
      links: config.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    });
  }

  function moveLink(id: string, dir: -1 | 1) {
    const idx = config.links.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= config.links.length) return;
    const links = [...config.links];
    [links[idx], links[newIdx]] = [links[newIdx], links[idx]];
    setConfig({ ...config, links });
  }

  if (!authed) {
    return (
      <div style={S.page}>
        <div style={{ ...S.container, maxWidth: 360, justifyContent: "center", minHeight: "100vh" }}>
          <h1 style={S.h1}>Admin</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={S.input}
              autoFocus
            />
            <button type="submit" style={S.btnPrimary}>Enter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h1 style={S.h1}>Admin Panel</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/" style={{ ...S.btnOutline, textDecoration: "none" }}>View Site</a>
            <button onClick={save} style={S.btnPrimary}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div style={S.section}>
          <h2 style={S.h2}>Profile</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={S.label}>LOGO URL</label>
              <input
                value={config.logo}
                onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                placeholder="https://... or /logo.png"
                style={S.input}
              />
              <p style={S.hint}>Paste an image URL or leave empty for initial letter</p>
            </div>
            <div>
              <label style={S.label}>NAME</label>
              <input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                style={S.input}
              />
            </div>
            <div>
              <label style={S.label}>SUBTITLE</label>
              <input
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                style={S.input}
              />
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div style={S.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={S.h2}>Links ({config.links.length})</h2>
            <button onClick={addLink} style={S.btnPrimary}>+ Add Link</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {config.links.map((link, idx) => (
              <div key={link.id} style={S.linkCard}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>
                    {link.icon.startsWith("http") ? "🖼" : link.icon || "🔗"}
                  </span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#FAF9F5" }}>
                    {link.title || "(untitled)"}
                  </span>
                  <button onClick={() => moveLink(link.id, -1)} style={S.btnSmall} disabled={idx === 0}>↑</button>
                  <button onClick={() => moveLink(link.id, 1)} style={S.btnSmall} disabled={idx === config.links.length - 1}>↓</button>
                  <button onClick={() => removeLink(link.id)} style={{ ...S.btnSmall, color: "#E07070", borderColor: "rgba(224,112,112,0.3)" }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8 }}>
                  <div>
                    <label style={S.label}>ICON</label>
                    <input
                      value={link.icon}
                      onChange={(e) => updateLink(link.id, "icon", e.target.value)}
                      placeholder="🔗 or URL"
                      style={{ ...S.input, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={S.label}>TITLE</label>
                    <input
                      value={link.title}
                      onChange={(e) => updateLink(link.id, "title", e.target.value)}
                      placeholder="Link name"
                      style={{ ...S.input, fontSize: 13 }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <label style={S.label}>URL</label>
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    placeholder="https://..."
                    style={{ ...S.input, fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} style={{ ...S.btnPrimary, width: "100%", padding: "14px 0", fontSize: 15 }}>
          {saved ? "✓ Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

// Inline styles (myClaude design system)
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0C0C0B",
    display: "flex",
    justifyContent: "center",
    padding: "0 16px",
  },
  container: {
    width: "100%",
    maxWidth: 560,
    padding: "32px 0 64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 24,
  },
  h1: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 22,
    fontWeight: 800,
    color: "#FAF9F5",
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#B5B0A8",
    letterSpacing: "-0.01em",
  },
  section: {
    background: "#161514",
    border: "1px solid #2E2C29",
    borderRadius: 12,
    padding: 20,
  },
  label: {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: 10,
    fontWeight: 600,
    color: "#706B63",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: 4,
  },
  input: {
    width: "100%",
    background: "#0C0C0B",
    border: "1px solid #2E2C29",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#FAF9F5",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    outline: "none",
  },
  hint: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    color: "#706B63",
    marginTop: 4,
  },
  btnPrimary: {
    background: "#C87941",
    color: "#FAF9F5",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "-0.01em",
  },
  btnOutline: {
    background: "transparent",
    color: "#B5B0A8",
    border: "1px solid #2E2C29",
    borderRadius: 8,
    padding: "10px 16px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSmall: {
    background: "transparent",
    color: "#706B63",
    border: "1px solid #2E2C29",
    borderRadius: 6,
    padding: "4px 10px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  linkCard: {
    background: "#0C0C0B",
    border: "1px solid #2E2C29",
    borderRadius: 10,
    padding: 14,
  },
};
