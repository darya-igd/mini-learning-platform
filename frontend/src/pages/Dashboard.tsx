import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";

type Cat = { id: number; name: string };
type Sub = { id: number; name: string; category_id: number };

export default function Dashboard() {
  const { token, setToken } = useAuth();
  const [cats, setCats] = useState<Cat[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [catId, setCatId] = useState<number | null>(null);
  const [subId, setSubId] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [lesson, setLesson] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.categories().then(setCats).catch((e) => setErr(e.message));
  }, []);

  useEffect(() => {
    if (catId) {
      api.subcategories(catId).then(setSubs).catch((e) => setErr(e.message));
    } else {
      setSubs([]);
      setSubId(null);
    }
  }, [catId]);

  async function sendPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (!catId || !subId) return;
    setErr(null); setLesson(null);
    try {
      const r = await api.createPrompt({
        category_id: catId,
        sub_category_id: subId,
        prompt,
      });
      setLesson(r.response);
      const hist = await api.myHistory(1, 10);
      setHistory(hist.items);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    if (token) {
      api.myHistory().then((h) => setHistory(h.items)).catch(() => {});
    }
  }, [token]);

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Mini Learning Platform</h2>
        <button onClick={() => setToken(null)}>Logout</button>
      </header>

      <form onSubmit={sendPrompt} style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <label>Category</label>
        <select value={catId ?? ""} onChange={(e) => setCatId(Number(e.target.value) || null)}>
          <option value="">-- choose --</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label>Sub-category</label>
        <select value={subId ?? ""} onChange={(e) => setSubId(Number(e.target.value) || null)} disabled={!catId}>
          <option value="">-- choose --</option>
          {subs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label>Your prompt</label>
        <textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} required />

        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit" disabled={!token}>Generate lesson</button>
      </form>

      {lesson && (
        <section style={{ marginTop: 20 }}>
          <h3>Latest lesson</h3>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 12, borderRadius: 8 }}>{lesson}</pre>
        </section>
      )}

      <section style={{ marginTop: 20 }}>
        <h3>Your history</h3>
        {history.length === 0 && <p>No items yet.</p>}
        {history.map((it) => (
          <details key={it.id} style={{ marginBottom: 8 }}>
            <summary><strong>{new Date(it.created_at).toLocaleString()}</strong> — {it.prompt}</summary>
            <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 8, borderRadius: 8 }}>{it.response}</pre>
          </details>
        ))}
      </section>
    </div>
  );
}
