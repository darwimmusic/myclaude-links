"use client";

import { useState, useEffect } from "react";
import { getConfig, saveConfig, DEFAULT_CONFIG, type LinktreeConfig, type LinkItem } from "@/lib/firebase";

export default function AdminPage() {
  const [config, setConfig] = useState<LinktreeConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("myclaude-links-authed") === "true") {
      setAuthed(true);
    }
    getConfig().then((c) => { setConfig(c); setLoading(false); });
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "myclaude2026") {
      setAuthed(true);
      localStorage.setItem("myclaude-links-authed", "true");
    }
  }

  async function save() {
    setSaving(true);
    await saveConfig(config);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  }

  function addLink() {
    setConfig({ ...config, links: [...config.links, { id: Date.now().toString(), title: "", url: "", icon: "🔗" }] });
  }

  function removeLink(id: string) {
    setConfig({ ...config, links: config.links.filter((l) => l.id !== id) });
  }

  function updateLink(id: string, field: keyof LinkItem, value: string) {
    setConfig({ ...config, links: config.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)) });
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={S.input} autoFocus />
            <button type="submit" style={S.btnPrimary}>Enter</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0C0C0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "2px solid #2E2C29", borderTopColor: "#C87941", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
            <button onClick={save} disabled={saving} style={S.btnPrimary}>
              {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.h2}>Profile</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={S.label}>LOGO URL</label>
              <input value={config.logo} onChange={(e) => setConfig({ ...config, logo: e.target.value })} placeholder="https://... or /logo.png" style={S.input} />
              <p style={S.hint}>Image URL or /logo.png for local file</p>
            </div>
            <div>
              <label style={S.label}>NAME</label>
              <input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} style={S.input} />
            </div>
            <div>
              <label style={S.label}>SUBTITLE</label>
              <input value={config.subtitle} onChange={(e) => setConfig({ ...config, subtitle: e.target.value })} style={S.input} />
            </div>
          </div>
        </div>

        <div style={S.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={S.h2}>Links ({config.links.length})</h2>
            <button onClick={addLink} style={S.btnPrimary}>+ Add Link</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {config.links.map((link, idx) => (
              <div key={link.id} style={S.linkCard}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{link.icon.startsWith("http") ? "🖼" : link.icon || "🔗"}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#FAF9F5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title || "(untitled)"}</span>
                  <button onClick={() => moveLink(link.id, -1)} style={S.btnSmall} disabled={idx === 0}>↑</button>
                  <button onClick={() => moveLink(link.id, 1)} style={S.btnSmall} disabled={idx === config.links.length - 1}>↓</button>
                  <button onClick={() => removeLink(link.id)} style={{ ...S.btnSmall, color: "#E07070", borderColor: "rgba(224,112,112,0.3)" }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8 }}>
                  <div><label style={S.label}>ICON</label><input value={link.icon} onChange={(e) => updateLink(link.id, "icon", e.target.value)} placeholder="🔗" style={{ ...S.input, fontSize: 13 }} /></div>
                  <div><label style={S.label}>TITLE</label><input value={link.title} onChange={(e) => updateLink(link.id, "title", e.target.value)} placeholder="Link name" style={{ ...S.input, fontSize: 13 }} /></div>
                </div>
                <div style={{ marginTop: 8 }}><label style={S.label}>URL</label><input value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} placeholder="https://..." style={{ ...S.input, fontSize: 13 }} /></div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} style={{ ...S.btnPrimary, width: "100%", padding: "14px 0", fontSize: 15 }}>
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0C0C0B", display: "flex", justifyContent: "center", padding: "0 16px" },
  container: { width: "100%", maxWidth: 560, padding: "32px 0 64px", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 24 },
  h1: { fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: "#FAF9F5", letterSpacing: "-0.02em" },
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: "#B5B0A8" },
  section: { background: "#161514", border: "1px solid #2E2C29", borderRadius: 12, padding: 20 },
  label: { display: "block", fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, color: "#706B63", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 },
  input: { width: "100%", background: "#0C0C0B", border: "1px solid #2E2C29", borderRadius: 8, padding: "10px 14px", color: "#FAF9F5", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, outline: "none" },
  hint: { fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#706B63", marginTop: 4 },
  btnPrimary: { background: "#C87941", color: "#FAF9F5", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnOutline: { background: "transparent", color: "#B5B0A8", border: "1px solid #2E2C29", borderRadius: 8, padding: "10px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnSmall: { background: "transparent", color: "#706B63", border: "1px solid #2E2C29", borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif" },
  linkCard: { background: "#0C0C0B", border: "1px solid #2E2C29", borderRadius: 10, padding: 14 },
};
