import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function QuizPanel({ question, milestoneIndex, onCorrect, milestoneTitle, milestoneColor, milestoneSide }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 680 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 680);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setSelected(null);
    setFeedback(null);
  }, [milestoneIndex]);

  function handleSelect(optionIndex) {
    if (feedback === "correct") return;
    setSelected(optionIndex);
    if (optionIndex === question.correct) {
      setFeedback("correct");
      setTimeout(() => onCorrect(), 900);
    } else {
      setFeedback("wrong");
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 1300);
    }
  }

  if (!question) return null;

  // Quiz panel sits on the OPPOSITE side from the milestone card
  const panelSide = milestoneSide === "right" ? "left" : "right";
  const enterX = panelSide === "right" ? 60 : -60;

  const mobileStyle = {
    bottom: 0,
    left: 0,
    right: 0,
    top: "auto",
    width: "100%",
    borderRadius: "20px 20px 0 0",
    maxHeight: "58vh",
    overflowY: "auto",
  };

  const desktopStyle = {
    top: "50%",
    [panelSide]: 28,
    width: "min(320px, calc(100vw - 56px))",
    borderRadius: 24,
  };

  return (
    <motion.div
      key={milestoneIndex}
      initial={isMobile ? { opacity: 0, y: 60 } : { opacity: 0, x: enterX, scale: 0.95, y: "-50%" }}
      animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0, scale: 1, y: "-50%" }}
      exit={isMobile ? { opacity: 0, y: 30 } : { opacity: 0, x: -enterX, y: "-50%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        zIndex: 50,
        background: "rgba(8,8,18,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1.5px solid ${milestoneColor}44`,
        padding: 24,
        boxShadow: `0 0 48px ${milestoneColor}22, 0 24px 64px rgba(0,0,0,0.65)`,
        pointerEvents: "auto",
        ...(isMobile ? mobileStyle : desktopStyle),
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: milestoneColor, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
          Question {milestoneIndex + 1} of 5
        </div>
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12, fontWeight: 600 }}>
          {milestoneTitle}
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.55, margin: 0 }}>
          {question.question}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = i === question.correct;

          let bg = "rgba(255,255,255,0.05)";
          let border = "rgba(255,255,255,0.1)";
          let color = "#cbd5e1";

          if (feedback === "correct" && isCorrectOption) {
            bg = "rgba(16,185,129,0.15)";
            border = "#10b981";
            color = "#6ee7b7";
          } else if (feedback === "wrong" && isSelected) {
            bg = "rgba(239,68,68,0.15)";
            border = "#ef4444";
            color = "#fca5a5";
          } else if (isSelected && !feedback) {
            bg = "rgba(167,139,250,0.12)";
            border = "#a78bfa";
            color = "#c4b5fd";
          }

          return (
            <motion.button
              key={i}
              whileHover={feedback !== "correct" ? { scale: 1.02, x: 3 } : {}}
              whileTap={feedback !== "correct" ? { scale: 0.98 } : {}}
              animate={feedback === "wrong" && isSelected ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleSelect(i)}
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 12,
                padding: "11px 14px",
                color,
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
                cursor: feedback === "correct" ? "default" : "pointer",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ opacity: 0.45, fontWeight: 800, minWidth: 18, fontSize: 12 }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}
          >
            {feedback === "correct" ? (
              <>
                <CheckCircle2 size={16} color="#10b981" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>Correct! Moving forward...</span>
              </>
            ) : (
              <>
                <XCircle size={16} color="#ef4444" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>Try again!</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
