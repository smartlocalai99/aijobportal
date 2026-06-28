import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import SkillPickerScreen from "@/components/SkillPickerScreen";
import QuizPanel from "@/components/QuizPanel";
import Navbar from "@/components/Navbar";
import { Star, ChevronDown, RotateCcw } from "lucide-react";
import { getQuestionsForSkill } from "@/lib/quizData";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "fixed", inset: 0, background: "#d9d7cf", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, zIndex: 0 }}>
      <div style={{ width: 48, height: 48, border: "3px solid rgba(0,0,0,0.15)", borderTopColor: "#666", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#555", fontSize: 14, fontWeight: 700 }}>Loading adventure...</span>
    </div>
  ),
});

// Classic sections — lazy-loaded only when the portal is unlocked
const AIPortfolioHero    = dynamic(() => import("@/components/AIPortfolioHero"),    { ssr: false });
const CompanyLogoMarquee = dynamic(() => import("@/components/CompanyLogoMarquee"), { ssr: false });
const CareerFlow         = dynamic(() => import("@/components/CareerFlow"),          { ssr: false });
const FavoriteJobsSection= dynamic(() => import("@/components/FavoriteJobsSection"),{ ssr: false });
const ClientTestimonials = dynamic(() => import("@/components/ClientTestimonials"), { ssr: false });
const StoriesNetwork     = dynamic(() => import("@/components/StoriesNetwork"),     { ssr: false });
const TestimonialsSection= dynamic(() => import("@/components/TestimonialsSection"),{ ssr: false });
const JobFooterSection   = dynamic(() => import("@/components/JobFooterSection"),   { ssr: false });

export default function Gamified() {
  const router = useRouter();
  const [phase, setPhase] = useState("skill-picker"); // "skill-picker" | "game" | "complete" | "unlocked"
  const [questions, setQuestions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const targetProgressRef = useRef(0);

  async function handleSkillSelect(skillId) {
    const qs = getQuestionsForSkill(skillId);
    const sceneModule = await import("@/components/Scene");
    setQuestions(qs);
    setMilestones(sceneModule.MILESTONES);
    setCurrentMilestoneIndex(0);
    targetProgressRef.current = 0;
    setPhase("game");
  }

  function handleCorrectAnswer() {
    const nextIndex = currentMilestoneIndex + 1;
    import("@/components/Scene").then(({ spawnCoinReward }) => {
      spawnCoinReward(nextIndex);
    });
    if (nextIndex >= milestones.length) {
      targetProgressRef.current = 1.0;
      setTimeout(() => setPhase("complete"), 1400);
      return;
    }
    targetProgressRef.current = milestones[currentMilestoneIndex].progress;
    setCurrentMilestoneIndex(nextIndex);
  }

  function unlockPortal() {
    setPhase("unlocked");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function resetGame() {
    setPhase("skill-picker");
    setCurrentMilestoneIndex(0);
    targetProgressRef.current = 0;
  }

  const currentMilestone = milestones[currentMilestoneIndex];
  const currentQuestion  = questions[currentMilestoneIndex];

  return (
    <>
      <Head>
        <title>AIJobHero — Gamified</title>
        <meta name="description" content="Quiz-driven career adventure. Answer skill questions to unlock features." />
      </Head>

      <AnimatePresence mode="wait">

        {/* ── SKILL PICKER ── */}
        {phase === "skill-picker" && (
          <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }} style={{ position: "relative", zIndex: 10 }}>
            <SkillPickerScreen onSelect={handleSkillSelect} />
          </motion.div>
        )}

        {/* ── 3D GAME ── */}
        {phase === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: "relative" }}>
            <Scene targetProgressRef={targetProgressRef} />
            <div
              id="navbar-coin-rewards"
              style={{
                position: "fixed", top: 16, left: 16, zIndex: 60,
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 12px",
                border: "1px solid rgba(222,153,35,0.3)",
                borderRadius: 999,
                background: "rgba(255,252,239,0.95)",
                color: "#6e4a0e",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <span style={{ display: "grid", width: 24, height: 24, placeItems: "center", borderRadius: "50%", background: "linear-gradient(135deg, #fff0a0, #c77605)", color: "#fff4b3", border: "1px solid #ffe596", boxShadow: "0 0 8px rgba(255,182,38,0.4)" }}>
                <Star size={10} fill="currentColor" />
              </span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                <span style={{ fontSize: 7, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>Coins</span>
                <strong className="coin-count-text" style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", fontWeight: 800 }}>0 / 5</strong>
              </div>
            </div>
            {currentQuestion && currentMilestone && (
              <QuizPanel
                key={currentMilestoneIndex}
                question={currentQuestion}
                milestoneIndex={currentMilestoneIndex}
                milestoneTitle={currentMilestone.title}
                milestoneColor={currentMilestone.color}
                milestoneSide={currentMilestone.side}
                onCorrect={handleCorrectAnswer}
              />
            )}
          </motion.div>
        )}

        {/* ── COMPLETE ── */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(16px)" }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{ fontSize: 90, marginBottom: 24 }}
            >
              🏆
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-1.5px", textAlign: "center" }}
            >
              Journey Complete!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ color: "#9ca3af", marginTop: 12, fontSize: 16, textAlign: "center", maxWidth: 340 }}
            >
              You've mastered all {milestones.length} milestones. The full portal is yours.
            </motion.p>

            {/* Coins earned badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, padding: "8px 18px", borderRadius: 999, background: "rgba(255,192,38,0.12)", border: "1px solid rgba(255,182,38,0.3)" }}
            >
              <Star size={14} fill="#fbbf24" color="#fbbf24" />
              <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 800, letterSpacing: "0.05em" }}>5 / 5 COINS COLLECTED</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36, alignItems: "center", width: "100%", maxWidth: 360, padding: "0 24px" }}
            >
              {/* Primary CTA */}
              <button
                onClick={unlockPortal}
                style={{ width: "100%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", border: "none", borderRadius: 16, padding: "16px 28px", color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", letterSpacing: "-0.3px", boxShadow: "0 0 40px rgba(124,58,237,0.45)" }}
              >
                Explore Classic Portal →
              </button>

              {/* Secondary */}
              <div style={{ display: "flex", gap: 10, width: "100%" }}>
                <button
                  onClick={resetGame}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px", color: "#d1d5db", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push("/")}
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px", color: "#d1d5db", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                  Change Mode
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── UNLOCKED — full classic portal ── */}
        {phase === "unlocked" && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            {/* Sticky Play Again pill */}
            <div style={{ position: "fixed", top: 16, right: 20, zIndex: 200, display: "flex", gap: 8 }}>
              <button
                onClick={resetGame}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, background: "rgba(124,58,237,0.92)", border: "none", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
              >
                <RotateCcw size={12} />
                Play Again
              </button>
              <button
                onClick={() => router.push("/")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)" }}
              >
                Change Mode
              </button>
            </div>

            {/* ── UNLOCK HERO BANNER ── */}
            <div style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 24px 60px",
              background: "linear-gradient(160deg, #0f0520 0%, #1a0a38 40%, #0d1b2a 100%)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Ambient glow orbs */}
              <div style={{ position: "absolute", top: "20%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

              {/* UNLOCKED badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 18 }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(167,139,250,0.4)", marginBottom: 32 }}
              >
                <span style={{ fontSize: 14 }}>🔓</span>
                <span style={{ color: "#c4b5fd", fontSize: 11, fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase" }}>Classic Portal Unlocked</span>
              </motion.div>

              {/* Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 180, damping: 14 }}
                style={{ fontSize: "clamp(72px, 12vw, 120px)", marginBottom: 24, filter: "drop-shadow(0 0 40px rgba(251,191,36,0.5))" }}
              >
                🏆
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ fontSize: "clamp(36px, 7vw, 80px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-2px", textAlign: "center", lineHeight: 1.05 }}
              >
                You beat the game.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ color: "#94a3b8", marginTop: 16, fontSize: "clamp(15px, 2vw, 20px)", textAlign: "center", maxWidth: 520, lineHeight: 1.55 }}
              >
                All 5 milestones mastered. Scroll down to explore the full AIJobHero experience — the one you just unlocked.
              </motion.p>

              {/* Coins */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, type: "spring", stiffness: 200 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28, padding: "10px 22px", borderRadius: 999, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.28)" }}
              >
                <Star size={15} fill="#fbbf24" color="#fbbf24" />
                <span style={{ color: "#fbbf24", fontSize: 14, fontWeight: 800, letterSpacing: "0.04em" }}>5 / 5 Coins Collected</span>
              </motion.div>

              {/* Scroll hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                style={{ position: "absolute", bottom: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#64748b" }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.div>
            </div>

            {/* ── CLASSIC PORTAL CONTENT ── */}
            <div style={{ background: "#fbfbf8" }}>
              <Navbar />
              <AIPortfolioHero />
              <CompanyLogoMarquee />
              <CareerFlow />
              <FavoriteJobsSection />
              <ClientTestimonials />
              <StoriesNetwork />
              <TestimonialsSection />
              <JobFooterSection />
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
