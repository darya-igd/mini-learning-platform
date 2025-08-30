import { useEffect, useState } from "react";
import { api } from "../api";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.adminUsers(), api.adminPrompts()])
      .then(([u, p]) => { setUsers(u.items); setPrompts(p.items); })
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", fontFamily: "system-ui" }}>
      <h2>Admin</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <h3>Users</h3>
      <table border={1} cellPadding={6}>
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.phone}</td><td>{u.role}</td></tr>)}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>Prompts</h3>
      <ul>
        {prompts.map(p => (
          <li key={p.id}>
            <strong>{new Date(p.created_at).toLocaleString()}</strong> — {p.prompt.slice(0,80)}
          </li>
        ))}
      </ul>
    </div>
  );
}
