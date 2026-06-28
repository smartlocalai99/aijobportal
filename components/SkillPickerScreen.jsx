import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { SKILLS } from "@/lib/quizData";

export default function SkillPickerScreen({ onSelect }) {
  const [query, setQuery] = useState("");

  const filtered = SKILLS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 72px" }}>
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", marginBottom: 44 }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.22)", borderRadius: 99, padding: "6px 16px", marginBottom: 22 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa", letterSpacing: "1px" }}>CHOOSE YOUR SKILL</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-1.5px", lineHeight: 1.1 }}>
          What will you master<br />on this journey?
        </h1>
        <p style={{ color: "#6b7280", marginTop: 14, fontSize: 16, margin: "14px 0 0" }}>
          Pick a skill — we'll quiz you at every milestone.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ position: "relative", width: "100%", maxWidth: 480, marginBottom: 44 }}
      >
        <Search
          size={18}
          color="#6b7280"
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        />
        <input
          type="text"
          placeholder="Search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "14px 16px 14px 46px",
            color: "#ffffff",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.5)"; }}
          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
        />
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, width: "100%", maxWidth: 1000 }}>
        <AnimatePresence>
          {filtered.map((skill, index) => (
            <motion.button
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.4, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(skill.id)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "2px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${skill.color}66`;
                e.currentTarget.style.boxShadow = `0 0 32px ${skill.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ height: 150, overflow: "hidden", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={skill.image}
                  alt={skill.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: 28 }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: "14px 16px 18px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", marginBottom: 5 }}>{skill.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: skill.color, letterSpacing: "0.5px", textTransform: "uppercase" }}>{skill.tag}</div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: "#4b5563", marginTop: 48, fontSize: 15 }}
        >
          No skills match "{query}"
        </motion.p>
      )}
    </div>
  );
}
