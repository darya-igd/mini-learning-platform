import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { setToken } = useAuth();
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const r = await api.register(name, phone, password);
      setToken(r.access_token);
      nav("/dashboard");
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="inp" />
        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="inp" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="inp" />
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
