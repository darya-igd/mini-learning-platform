import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { setToken } = useAuth();
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const r = await api.login(phone, password);
      setToken(r.access_token);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="inp" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="inp" />
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
