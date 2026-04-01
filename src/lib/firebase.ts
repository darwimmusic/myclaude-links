import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxzOLbA6q40jkWnWCL20kx4YSYjfuWPl8",
  authDomain: "claude-code-vault.firebaseapp.com",
  projectId: "claude-code-vault",
  storageBucket: "claude-code-vault.firebasestorage.app",
  messagingSenderId: "674729533562",
  appId: "1:674729533562:web:05b829140bd2bfe48cdbc3",
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

const CONFIG_DOC = doc(db, "linktree", "config");

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
}

export interface LinktreeConfig {
  logo: string;
  name: string;
  subtitle: string;
  links: LinkItem[];
}

export const DEFAULT_CONFIG: LinktreeConfig = {
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

export async function getConfig(): Promise<LinktreeConfig> {
  try {
    const snap = await getDoc(CONFIG_DOC);
    if (snap.exists()) return snap.data() as LinktreeConfig;
  } catch {}
  return DEFAULT_CONFIG;
}

export async function saveConfig(config: LinktreeConfig): Promise<void> {
  await setDoc(CONFIG_DOC, config);
}

export function onConfigChange(callback: (config: LinktreeConfig) => void): () => void {
  return onSnapshot(CONFIG_DOC, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as LinktreeConfig);
    } else {
      callback(DEFAULT_CONFIG);
    }
  });
}
