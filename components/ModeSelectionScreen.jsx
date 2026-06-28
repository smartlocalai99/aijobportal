import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Gamepad2, Layout } from "lucide-react";

const CARDS = [
  {
    id: "gamified",
    label: "Gamified",
    tag: "Interactive · Quiz-based",
    description: "Play through your career journey. Answer skill questions to unlock each feature as you go.",
    Icon: Gamepad2,
    bg: "linear-gradient(135deg, #0f0a1e 0%, #1a0533 50%, #0d1a2e 100%)",
    border: "#7c3aed",
    glow: "rgba(124, 58, 237, 0.4)",
    accent: "#a78bfa",
    preview: (
      <div style={{ background: "linear-gradient(180deg, #1e1040 0%, #0d1525 100%)", borderRadius: 16, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
        🎮
      </div>
    ),
  },
  {
    id: "classic",
    label: "Classic",
    tag: "Fast · Clean",
    description: "Browse the full website. All features, clean layout, no game mechanics.",
    Icon: Layout,
    bg: "linear-gradient(135deg, #fafaf8 0%, #f3f4f6 100%)",
    border: "#d1d5db",
    glow: "rgba(0,0,0,0.06)",
    accent: "#111827",
    preview: (
      <div style={{ background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)", borderRadius: 16, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
        ✨
      </div>
    ),
  },
];

export default function ModeSelectionScreen() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#000000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 52 }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px" }}>AIJOBHERO</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-2px", lineHeight: 1.1 }}>
          Choose your experience
        </h1>
        <p style={{ color: "#6b7280", marginTop: 14, fontSize: 16, margin: "14px 0 0" }}>
          How do you want to explore AIJobHero?
        </p>
      </motion.div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 860, width: "100%" }}>
        {CARDS.map((card, index) => (
          <ModeCard key={card.id} card={card} index={index} onClick={() => router.push(`/${card.id}`)} />
        ))}
      </div>
    </div>
  );
}

function ModeCard({ card, index, onClick }) {
  const isLight = card.id === "classic";

  return (
    <motion.button
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: card.bg,
        border: `2px solid ${card.border}`,
        borderRadius: 24,
        padding: 28,
        width: "min(380px, 100%)",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: `0 0 60px ${card.glow}, 0 24px 70px rgba(0,0,0,0.45)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isLight && (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 60%)", pointerEvents: "none" }} />
      )}

      <div style={{ marginBottom: 22 }}>{card.preview}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <card.Icon size={22} color={card.accent} strokeWidth={2} />
        <span style={{ fontSize: 22, fontWeight: 900, color: card.accent, letterSpacing: "-0.5px" }}>{card.label}</span>
      </div>

      <div style={{ display: "inline-block", background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.09)", borderRadius: 99, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: isLight ? "#6b7280" : "#a78bfa", marginBottom: 12, letterSpacing: "0.5px" }}>
        {card.tag}
      </div>

      <p style={{ fontSize: 14, color: isLight ? "#4b5563" : "#9ca3af", lineHeight: 1.6, margin: 0 }}>
        {card.description}
      </p>

      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        style={{ height: 2, background: card.accent, position: "absolute", bottom: 0, left: 0, right: 0, transformOrigin: "left", borderRadius: 2 }}
      />
    </motion.button>
  );
}
