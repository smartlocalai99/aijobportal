import "@/styles/globals.css";
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[AIJobHero] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "fixed", inset: 0,
          background: "#0f0a1e",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 20, padding: 24, fontFamily: "Inter, system-ui, sans-serif",
        }}>
          <div style={{ fontSize: 56 }}>⚠️</div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, textAlign: "center" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: 0, textAlign: "center", maxWidth: 340 }}>
            An unexpected error occurred. Reload to try again.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#7c3aed", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Reload page
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "12px 24px", color: "#d1d5db", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
