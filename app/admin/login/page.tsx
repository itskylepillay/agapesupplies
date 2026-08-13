"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="admin-login-page">
      <div className="login-background">
        <div className="login-shape shape-one"></div>
        <div className="login-shape shape-two"></div>
        <div className="login-shape shape-three"></div>
      </div>

      <section className="login-card">
        <div className="login-logo">
          <div className="logo-mark">A</div>

          <div>
            <h1>Agape</h1>
            <span>SUPPLIES</span>
          </div>
        </div>

        <div className="login-heading">
          <p className="small-title">ADMINISTRATION</p>

          <h2>Welcome Kandy</h2>

          <p>
            Sign in to manage your Agape Supplies website.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Signing in..." : "Sign in to Admin"}
          </button>
        </form>

        <button
          type="button"
          className="back-home"
          onClick={() => router.push("/")}
        >
          ← Back to Agape Supplies
        </button>
      </section>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          box-sizing: border-box;
          background: #f5f7fb;
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .login-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0.7;
          animation: float 7s ease-in-out infinite;
        }

        .shape-one {
          width: 420px;
          height: 420px;
          background: rgba(38, 83, 150, 0.12);
          top: -180px;
          left: -150px;
        }

        .shape-two {
          width: 350px;
          height: 350px;
          background: rgba(70, 166, 190, 0.14);
          right: -130px;
          bottom: -120px;
          animation-delay: 1.5s;
        }

        .shape-three {
          width: 180px;
          height: 180px;
          background: rgba(38, 83, 150, 0.08);
          right: 15%;
          top: 15%;
          animation-delay: 3s;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 450px;
          background: rgba(255, 255, 255, 0.96);
          border-radius: 24px;
          padding: 45px;
          box-sizing: border-box;
          box-shadow:
            0 25px 70px rgba(20, 40, 80, 0.12),
            0 5px 20px rgba(20, 40, 80, 0.06);
          animation: enterCard 0.7s ease forwards;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 38px;
        }

        .logo-mark {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #285596;
          color: white;
          font-size: 31px;
          font-weight: 800;
          font-style: italic;
          border-radius: 10px;
        }

        .login-logo h1 {
          margin: 0;
          color: #111;
          font-size: 28px;
          line-height: 25px;
        }

        .login-logo span {
          display: block;
          margin-top: 4px;
          font-size: 8px;
          letter-spacing: 4px;
          font-weight: 700;
          color: #285596;
        }

        .small-title {
          margin: 0 0 10px;
          color: #285596;
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .login-heading h2 {
          margin: 0;
          color: #111827;
          font-size: 32px;
          line-height: 1.2;
        }

        .login-heading > p:last-child {
          margin: 12px 0 30px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          color: #1f2937;
          font-size: 13px;
          font-weight: 700;
        }

        .input-group input {
          width: 100%;
          box-sizing: border-box;
          padding: 14px 15px;
          border: 1px solid #dce1e8;
          border-radius: 10px;
          background: #fafbfc;
          color: #111827;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .input-group input:focus {
          background: white;
          border-color: #285596;
          box-shadow: 0 0 0 4px rgba(40, 85, 150, 0.1);
        }

        .login-error {
          padding: 12px 14px;
          border-radius: 9px;
          background: #fff1f1;
          border: 1px solid #ffd1d1;
          color: #c62828;
          font-size: 13px;
        }

        .login-button {
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 15px;
          margin-top: 3px;
          background: #285596;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          background: #1f467d;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(40, 85, 150, 0.25);
        }

        .login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .back-home {
          display: block;
          margin: 25px auto 0;
          padding: 5px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .back-home:hover {
          color: #285596;
        }

        @keyframes enterCard {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }

          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @media (max-width: 600px) {
          .login-card {
            padding: 32px 24px;
            border-radius: 20px;
          }

          .login-heading h2 {
            font-size: 27px;
          }

          .login-logo {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </main>
  );
}