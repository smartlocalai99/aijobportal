import dynamic from "next/dynamic";
import Head from "next/head";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import SkillPickerScreen from "@/components/SkillPickerScreen";
import QuizPanel from "@/components/QuizPanel";
import Navbar from "@/components/Navbar";
import { Star, ChevronDown, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { getQuestionsForSkill } from "@/lib/quizData";
import { useGameMusic } from "@/lib/useGameMusic";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "fixed", inset: 0, background: "#d9d7cf", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, zIndex: 0 }}>
      <div style={{ width: 48, height: 48, border: "3px solid rgba(0,0,0,0.15)", borderTopColor: "#666", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <span style={{ color: "#555", fontSize: 14, fontWeight: 700 }}>Loading adventure...</span>
    </div>
  ),
});

const AIPortfolioHero     = dynamic(() => import("@/components/AIPortfolioHero"),    { ssr: false });
const CompanyLogoMarquee  = dynamic(() => import("@/components/CompanyLogoMarquee"), { ssr: false });
const CareerFlow          = dynamic(() => import("@/components/CareerFlow"),          { ssr: false });
const FavoriteJobsSection = dynamic(() => import("@/components/FavoriteJobsSection"),{ ssr: false });
const ClientTestimonials  = dynamic(() => import("@/components/ClientTestimonials"), { ssr: false });
const StoriesNetwork      = dynamic(() => import("@/components/StoriesNetwork"),     { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"),{ ssr: false });
const JobFooterSection    = dynamic(() => import("@/components/JobFooterSection"),   { ssr: false });

export default function Gamified() {
  const router = useRouter();
  const [phase, setPhase] = useState("skill-picker"); // "skill-picker" | "game" | "unlocked"
  const [questions, setQuestions] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showWinToast, setShowWinToast] = useState(false);
  const targetProgressRef = useRef(0);

  useGameMusic(phase === "game", muted);

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
    import("@/components/Scene").then(({ spawnCoinReward }) => spawnCoinReward(nextIndex));

    if (nextIndex >= milestones.length) {
      targetProgressRef.current = 1.0;
      // Brief win toast over the 3D scene, then auto-scroll into portal
      setShowWinToast(true);
      setTimeout(() => {
        setShowWinToast(false);
        setPhase("unlocked");
        window.scrollTo({ top: 0 });
      }, 1800);
      return;
    }
    targetProgressRef.current = milestones[currentMilestoneIndex].progress;
    setCurrentMilestoneIndex(nextIndex);
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

      {/* ── WIN TOAST — shown briefly over the 3D scene ── */}
      <AnimatePresence>
        {showWinToast && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              style={{
                background: "rgba(10,4,30,0.92)",
                border: "1px solid rgba(167,139,250,0.4)",
                borderRadius: 28,
                padding: "32px 48px",
                textAlign: "center",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 80px rgba(124,58,237,0.35)",
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 16, filter: "drop-shadow(0 0 30px rgba(251,191,36,0.6))" }}>🏆</div>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, letterSpacing: "-1px" }}>Journey Complete!</div>
              <div style={{ color: "#a78bfa", fontSize: 13, marginTop: 8, fontWeight: 600 }}>Unlocking the full portal…</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

            <button
              onClick={() => setMuted(m => !m)}
              title={muted ? "Unmute music" : "Mute music"}
              style={{ position: "fixed", top: 16, left: 16, zIndex: 61, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(255,252,239,0.95)", border: "1px solid rgba(222,153,35,0.3)", color: "#6e4a0e", cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <div id="navbar-coin-rewards" style={{ position: "fixed", top: 16, left: 60, zIndex: 60, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid rgba(222,153,35,0.3)", borderRadius: 999, background: "rgba(255,252,239,0.95)", color: "#6e4a0e", backdropFilter: "blur(8px)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
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

        {/* ── UNLOCKED — parallax banner + full classic portal ── */}
        {phase === "unlocked" && (
          <motion.div key="unlocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} style={{ position: "relative" }}>

            {/* Sticky pills */}
            <div style={{ position: "fixed", top: 16, right: 20, zIndex: 200, display: "flex", gap: 8 }}>
              <button onClick={resetGame} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, background: "rgba(124,58,237,0.92)", border: "none", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
                <RotateCcw size={12} /> Play Again
              </button>
              <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(8px)" }}>
                Change Mode
              </button>
            </div>

            <UnlockBanner />

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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .unlock-bg {
          position: absolute;
          inset: -10%;
          background: linear-gradient(160deg, #0f0520 0%, #1a0a38 40%, #0d1b2a 100%);
          transform-origin: center;
          will-change: transform;
        }
        .unlock-bg::before {
          content: '';
          position: absolute;
          top: 20%; left: 15%;
          width: 45%; height: 55%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%);
        }
        .unlock-bg::after {
          content: '';
          position: absolute;
          bottom: 15%; right: 10%;
          width: 36%; height: 44%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%);
        }
        .unlock-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          text-align: center;
          will-change: transform, opacity;
        }
        .unlock-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(167,139,250,0.4);
          margin-bottom: 28px;
          font-size: 11px;
          font-weight: 900;
          color: #c4b5fd;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .unlock-trophy {
          font-size: clamp(72px, 12vw, 120px);
          margin-bottom: 20px;
          filter: drop-shadow(0 0 40px rgba(251,191,36,0.55));
          will-change: transform;
          line-height: 1;
        }
        .unlock-headline {
          font-size: clamp(38px, 7vw, 82px);
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: -2.5px;
          line-height: 1.04;
        }
        .unlock-sub {
          color: #94a3b8;
          margin-top: 16px;
          font-size: clamp(15px, 2vw, 20px);
          max-width: 500px;
          line-height: 1.55;
        }
        .unlock-coins {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 28px;
          padding: 10px 22px;
          border-radius: 999px;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.28);
          color: #fbbf24;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .unlock-scroll-cue {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #64748b;
          will-change: opacity;
          white-space: nowrap;
        }
        .unlock-scroll-cue span {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .unlock-bleed {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, #fbfbf8);
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

// ── Parallax unlock banner — scroll-driven ──────────────────────────────────
function UnlockBanner() {
  const { scrollY } = useScroll();

  // Background zooms in slightly as you scroll
  const bgScale   = useTransform(scrollY, [0, 700], [1, 1.12]);
  // Trophy drifts up fastest (strongest parallax)
  const trophyY   = useTransform(scrollY, [0, 700], [0, -140]);
  // Text drifts up at half the rate
  const contentY  = useTransform(scrollY, [0, 700], [0, -70]);
  // Everything fades away as banner scrolls off
  const opacity   = useTransform(scrollY, [0, 420], [1, 0]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

      {/* Parallax background layer */}
      <motion.div
        style={{ scale: bgScale }}
        aria-hidden
        className="unlock-bg"
      />

      {/* Content layer */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="unlock-content"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 20 }}
          className="unlock-badge"
        >
          <span>🔓</span>
          <span>Classic Portal Unlocked</span>
        </motion.div>

        {/* Trophy — extra parallax */}
        <motion.div
          style={{ y: trophyY }}
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 160, damping: 14 }}
          className="unlock-trophy"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="unlock-headline"
        >
          You beat the game.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="unlock-sub"
        >
          All 5 milestones mastered. Scroll down to explore the full AIJobHero experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          className="unlock-coins"
        >
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>5 / 5 Coins Collected</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue — fades independently */}
      <motion.div
        style={{ opacity: useTransform(scrollY, [0, 180], [1, 0]) }}
        className="unlock-scroll-cue"
      >
        <span>Scroll to explore</span>
        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      {/* Gradient bleed into classic site */}
      <div className="unlock-bleed" />
    </div>
  );
}
