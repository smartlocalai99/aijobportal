import dynamic from "next/dynamic";
import Head from "next/head";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import SkillPickerScreen from "@/components/SkillPickerScreen";
import QuizPanel from "@/components/QuizPanel";
import Navbar from "@/components/Navbar";
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

export default function Gamified() {
  const router = useRouter();
  const [phase, setPhase] = useState("skill-picker"); // "skill-picker" | "game" | "complete"
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

  const currentMilestone = milestones[currentMilestoneIndex];
  const currentQuestion = questions[currentMilestoneIndex];

  return (
    <>
      <Head>
        <title>AIJobHero — Gamified</title>
        <meta name="description" content="Quiz-driven career adventure. Answer skill questions to unlock features." />
      </Head>

      <Navbar />

      <AnimatePresence mode="wait">
        {phase === "skill-picker" && (
          <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }} style={{ position: "relative", zIndex: 10 }}>
            <SkillPickerScreen onSelect={handleSkillSelect} />
          </motion.div>
        )}

        {phase === "game" && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ position: "relative" }}>
            <Scene targetProgressRef={targetProgressRef} />
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

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(12px)" }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ fontSize: 80, marginBottom: 28 }}
            >
              🏆
            </motion.div>
            <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-1.5px", textAlign: "center" }}>
              Journey Complete!
            </h2>
            <p style={{ color: "#9ca3af", marginTop: 14, fontSize: 16, textAlign: "center", maxWidth: 340 }}>
              You've mastered all {milestones.length} features on your career road.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => { setPhase("skill-picker"); setCurrentMilestoneIndex(0); targetProgressRef.current = 0; }}
                style={{ background: "#7c3aed", border: "none", borderRadius: 14, padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
              >
                Play Again
              </button>
              <button
                onClick={() => router.push("/")}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 28px", color: "#d1d5db", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                Change Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
