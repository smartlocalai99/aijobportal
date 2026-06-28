# Mode Selection + Gamified Quiz Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll-driven game with a mode-selection entry point, separate `/classic` and `/gamified` routes, a skill picker screen, and quiz-driven character movement replacing scroll.

**Architecture:** Three Next.js pages: `/` (mode selection, zero 3D imports), `/classic` (standalone marketing site), `/gamified` (skill picker → 3D game with quiz panel). `targetProgressRef` flows from gamified page → Scene, mutated on each correct answer. Scene reads from ref in `useFrame` — no re-renders triggered.

**Tech Stack:** Next.js pages router, React, Framer Motion, Three.js, React Three Fiber, @react-three/drei, GSAP (gamified only, already installed), Tailwind CSS v4, Lucide React.

## Global Constraints

- Pages router only — no `app/` directory
- All heavy components use `dynamic(() => import(...), { ssr: false })`
- No new npm packages — use only what is already in `package.json`
- Hardcoded quiz data — no API calls
- 5 milestones only (remove Learning Section, AI Salary Predictor, AI Career Coach)
- Shadow map reduced from 2048 → 1024 for performance
- `dpr` reduced from `[1, 1.75]` → `[1, 1.5]` for performance

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `pages/index.jsx` | Modify | Mode selection only — no 3D imports |
| `pages/classic.jsx` | Create | All marketing sections, standalone |
| `pages/gamified.jsx` | Create | Skill picker → game state machine |
| `components/ModeSelectionScreen.jsx` | Create | Two animated cards on black bg, router nav |
| `components/SkillPickerScreen.jsx` | Create | Skill grid + search, calls `onSelect(skillId)` |
| `components/QuizPanel.jsx` | Create | Question + 4 options + correct/wrong feedback |
| `lib/quizData.js` | Create | `SKILLS` array + `getQuestionsForSkill(id)` |
| `components/Scene.jsx` | Modify | Remove ScrollTrigger, accept `targetProgressRef` prop, 5 milestones, merged card layout |
| `components/Navbar.jsx` | Modify | Update coin count to `0 / 5`, add "Change mode" back link on non-home routes |
| `styles/globals.css` | Modify | Add `.milestone-image-stack` and `.milestone-stack-img` CSS |

---

### Task 1: Quiz Data Module

**Files:**
- Create: `lib/quizData.js`

**Interfaces:**
- Produces: `SKILLS: Array<{id, name, tag, image, color}>`, `getQuestionsForSkill(skillId: string) → Array<{question, options: string[4], correct: number}>`

- [ ] **Step 1: Create `lib/quizData.js`**

```js
export const SKILLS = [
  {
    id: "react",
    name: "React",
    tag: "Frontend Library",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    color: "#61dafb",
  },
  {
    id: "javascript",
    name: "JavaScript",
    tag: "Programming Language",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/512px-Unofficial_JavaScript_logo_2.svg.png",
    color: "#f7df1e",
  },
  {
    id: "htmlcss",
    name: "HTML & CSS",
    tag: "Web Fundamentals",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png",
    color: "#e34c26",
  },
  {
    id: "python",
    name: "Python",
    tag: "Programming Language",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/512px-Python-logo-notext.svg.png",
    color: "#3776ab",
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    tag: "Product Design",
    image: "https://cdn.dribbble.com/userupload/16012745/file/original-e6e34e5c0a6a0e2e8a7afae6b49d76c0.png",
    color: "#a855f7",
  },
  {
    id: "photography",
    name: "Photography",
    tag: "Visual Arts",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    color: "#f59e0b",
  },
  {
    id: "datascience",
    name: "Data Science",
    tag: "Analytics & ML",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    color: "#10b981",
  },
  {
    id: "nodejs",
    name: "Node.js",
    tag: "Backend Runtime",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/512px-Node.js_logo.svg.png",
    color: "#68a063",
  },
];

const QUESTIONS = {
  react: [
    { question: "What hook manages local component state in React?", options: ["useEffect", "useState", "useRef", "useContext"], correct: 1 },
    { question: "Which hook runs side effects after render?", options: ["useState", "useMemo", "useCallback", "useEffect"], correct: 3 },
    { question: "What does JSX stand for?", options: ["Java Syntax Extension", "JavaScript XML", "JSON XML", "JavaScript Extra"], correct: 1 },
    { question: "Which prop passes children into a React component?", options: ["data", "props", "children", "content"], correct: 2 },
    { question: "What does the `key` prop help React do?", options: ["Style elements", "Pass data down", "Efficiently re-render lists", "Handle events"], correct: 2 },
  ],
  javascript: [
    { question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const", "def"], correct: 1 },
    { question: "What does `===` check in JavaScript?", options: ["Value only", "Type only", "Reference", "Value and type"], correct: 3 },
    { question: "What is a Promise in JavaScript?", options: ["A loop", "A CSS property", "An async operation result", "A data type"], correct: 2 },
    { question: "Which method adds an item to the end of an array?", options: ["pop()", "shift()", "push()", "splice()"], correct: 2 },
    { question: "What does `typeof null` return?", options: ['"null"', '"undefined"', '"boolean"', '"object"'], correct: 3 },
  ],
  htmlcss: [
    { question: "Which tag defines the root of an HTML page?", options: ["<body>", "<head>", "<main>", "<html>"], correct: 3 },
    { question: "Which CSS property controls spacing inside an element?", options: ["margin", "border", "padding", "gap"], correct: 2 },
    { question: "What does `display: flex` do?", options: ["Hides the element", "Adds animation", "Centers text", "Creates a flex container"], correct: 3 },
    { question: "Which HTML attribute links an external stylesheet?", options: ["src", "rel", "link", "href"], correct: 3 },
    { question: "Which CSS unit is relative to viewport width?", options: ["em", "px", "rem", "vw"], correct: 3 },
  ],
  python: [
    { question: "Which keyword defines a function in Python?", options: ["func", "function", "fn", "def"], correct: 3 },
    { question: "What is a Python list comprehension?", options: ["A loop decorator", "A class method", "A data import", "A concise way to create lists"], correct: 3 },
    { question: "Which method removes whitespace from string ends?", options: [".trim()", ".clean()", ".remove()", ".strip()"], correct: 3 },
    { question: "What does `len()` return?", options: ["Last element", "First element", "Data type", "Number of items"], correct: 3 },
    { question: "How do you define a child class in Python?", options: ["class Child extends Parent", "class Child: Parent", "inherit(Parent)", "class Child(Parent)"], correct: 3 },
  ],
  uiux: [
    { question: "What does UX stand for?", options: ["Uniform Exchange", "UI Experience", "User Extension", "User Experience"], correct: 3 },
    { question: "What is a wireframe?", options: ["A high-fidelity mockup", "A CSS grid", "A color palette", "A low-fidelity layout sketch"], correct: 3 },
    { question: "What is contrast used for in design?", options: ["Decoration", "Animation timing", "Grid spacing", "Visual hierarchy and readability"], correct: 3 },
    { question: "What is a design system?", options: ["A software framework", "A version control tool", "A project timeline", "A reusable component library"], correct: 3 },
    { question: "What does A/B testing compare?", options: ["Two codebases", "Two user accounts", "Two databases", "Two design variants"], correct: 3 },
  ],
  photography: [
    { question: "What does ISO control in photography?", options: ["Lens focus", "Shutter speed", "Color balance", "Camera sensor sensitivity"], correct: 3 },
    { question: "What is the rule of thirds?", options: ["A lighting technique", "A color theory", "An exposure rule", "A composition guideline"], correct: 3 },
    { question: "Which aperture lets in more light?", options: ["f/22", "f/11", "f/8", "f/1.8"], correct: 3 },
    { question: "What is the golden hour?", options: ["Best time for studio shots", "Midday sunlight", "Artificial lighting time", "Light just after sunrise or before sunset"], correct: 3 },
    { question: "What does saving in RAW format preserve?", options: ["Smaller file size", "Compressed JPEG", "Edited color grading", "Unprocessed image data"], correct: 3 },
  ],
  datascience: [
    { question: "What does CSV stand for?", options: ["Coded System Values", "Computer Science Variable", "Calculated Sum Values", "Comma-Separated Values"], correct: 3 },
    { question: "Which Python library is used for dataframes?", options: ["NumPy", "Matplotlib", "Seaborn", "Pandas"], correct: 3 },
    { question: "What is overfitting in machine learning?", options: ["Model too simple", "Missing data", "Wrong loss function", "Model too specific to training data"], correct: 3 },
    { question: "What does the mean represent in statistics?", options: ["Most frequent value", "Middle value", "Range of values", "Average of values"], correct: 3 },
    { question: "What is a confusion matrix used for?", options: ["Debugging code", "Sorting data", "Feature scaling", "Evaluating classification models"], correct: 3 },
  ],
  nodejs: [
    { question: "What is Node.js?", options: ["A CSS framework", "A database", "A React library", "Server-side JavaScript runtime"], correct: 3 },
    { question: "Which built-in module handles HTTP in Node.js?", options: ["net", "server", "request", "http"], correct: 3 },
    { question: "What does `npm install` do?", options: ["Starts a server", "Runs tests", "Builds the project", "Installs project dependencies"], correct: 3 },
    { question: "What is `package.json`?", options: ["A JSON database", "A build config", "An API response", "Project metadata and dependencies file"], correct: 3 },
    { question: "Which keyword imports a CommonJS module in Node.js?", options: ["import", "include", "fetch", "require"], correct: 3 },
  ],
};

export function getQuestionsForSkill(skillId) {
  return QUESTIONS[skillId] ?? QUESTIONS.react;
}
```

- [ ] **Step 2: Verify module is valid**

```bash
node -e "const d = require('./lib/quizData.js'); console.log(d.SKILLS.length, d.getQuestionsForSkill('react').length)"
```

Expected output: `8 5`

- [ ] **Step 3: Commit**

```bash
git add lib/quizData.js
git commit -m "feat: add hardcoded quiz questions for 8 skills"
```

---

### Task 2: Mode Selection Screen

**Files:**
- Create: `components/ModeSelectionScreen.jsx`
- Modify: `pages/index.jsx`

**Interfaces:**
- Consumes: `next/router` `useRouter`
- Produces: navigation to `/classic` or `/gamified` on card click

- [ ] **Step 1: Create `components/ModeSelectionScreen.jsx`**

```jsx
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
```

- [ ] **Step 2: Update `pages/index.jsx`**

```jsx
import Head from "next/head";
import ModeSelectionScreen from "@/components/ModeSelectionScreen";

export default function Home() {
  return (
    <>
      <Head>
        <title>AIJobHero — Choose Your Experience</title>
        <meta name="description" content="Choose between the gamified career adventure or the classic website experience." />
      </Head>
      <ModeSelectionScreen />
    </>
  );
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: black screen, animated "Choose your experience" heading, two cards ("Gamified" dark/purple, "Classic" white/clean). Clicking Gamified navigates to `/gamified` (404 for now is fine), clicking Classic navigates to `/classic` (404 is fine).

- [ ] **Step 4: Commit**

```bash
git add components/ModeSelectionScreen.jsx pages/index.jsx
git commit -m "feat: mode selection screen at / with gamified and classic cards"
```

---

### Task 3: Classic Route

**Files:**
- Create: `pages/classic.jsx`

**Interfaces:**
- Consumes: all existing marketing components (unchanged)
- Produces: `/classic` route — full marketing site, zero 3D imports

- [ ] **Step 1: Create `pages/classic.jsx`**

```jsx
import dynamic from "next/dynamic";
import Head from "next/head";
import Navbar from "@/components/Navbar";

const AIPortfolioHero = dynamic(() => import("@/components/AIPortfolioHero"), { ssr: false });
const CompanyLogoMarquee = dynamic(() => import("@/components/CompanyLogoMarquee"), { ssr: false });
const CareerFlow = dynamic(() => import("@/components/CareerFlow"), { ssr: false });
const FavoriteJobsSection = dynamic(() => import("@/components/FavoriteJobsSection"), { ssr: false });
const ClientTestimonials = dynamic(() => import("@/components/ClientTestimonials"), { ssr: false });
const StoriesNetwork = dynamic(() => import("@/components/StoriesNetwork"), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: false });
const JobFooterSection = dynamic(() => import("@/components/JobFooterSection"), { ssr: false });

export default function Classic() {
  return (
    <>
      <Head>
        <title>AIJobHero — Classic</title>
        <meta name="description" content="AI-powered career tools to help you get hired." />
      </Head>
      <Navbar />
      <div className="relative z-20 w-full">
        <AIPortfolioHero />
        <CompanyLogoMarquee />
        <CareerFlow />
        <FavoriteJobsSection />
        <ClientTestimonials />
        <StoriesNetwork />
        <TestimonialsSection />
        <JobFooterSection />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify `/classic` loads all sections without 3D**

Open `http://localhost:3000/classic`. Expected: Navbar + all marketing sections, standard scroll, no canvas/3D, no scroll lock.

- [ ] **Step 3: Commit**

```bash
git add pages/classic.jsx
git commit -m "feat: classic route with full marketing site, zero 3D"
```

---

### Task 4: Skill Picker Screen

**Files:**
- Create: `components/SkillPickerScreen.jsx`

**Interfaces:**
- Consumes: `SKILLS` from `lib/quizData.js`, `onSelect: (skillId: string) => void` prop
- Produces: calls `onSelect(skill.id)` when a card is clicked

- [ ] **Step 1: Create `components/SkillPickerScreen.jsx`**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/SkillPickerScreen.jsx
git commit -m "feat: skill picker screen with 8 skill cards and live search"
```

---

### Task 5: Quiz Panel Component

**Files:**
- Create: `components/QuizPanel.jsx`

**Interfaces:**
- Consumes: `question: {question: string, options: string[], correct: number}`, `milestoneIndex: number` (0–4), `milestoneTitle: string`, `milestoneColor: string`, `onCorrect: () => void`
- Produces: calls `onCorrect()` ~900ms after a correct selection; resets state when `milestoneIndex` changes

- [ ] **Step 1: Create `components/QuizPanel.jsx`**

```jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function QuizPanel({ question, milestoneIndex, onCorrect, milestoneTitle, milestoneColor }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong" | null

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

  return (
    <motion.div
      key={milestoneIndex}
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        width: "min(340px, calc(100vw - 56px))",
        background: "rgba(8,8,18,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1.5px solid ${milestoneColor}44`,
        borderRadius: 24,
        padding: 24,
        zIndex: 50,
        boxShadow: `0 0 48px ${milestoneColor}22, 0 24px 64px rgba(0,0,0,0.65)`,
        pointerEvents: "auto",
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
```

- [ ] **Step 2: Commit**

```bash
git add components/QuizPanel.jsx
git commit -m "feat: quiz panel with correct/wrong feedback, shake animation, and auto-advance"
```

---

### Task 6: Scene.jsx — Remove Scroll, Quiz-Driven Progress, 5 Milestones, Updated Layout

**Files:**
- Modify: `components/Scene.jsx`

**Interfaces:**
- Consumes: `targetProgressRef: React.MutableRefObject<number>` prop — external ref holding 0.0–1.0 target; `useFrame` reads it directly (no re-renders)
- Produces: exports `MILESTONES` array (add `export` keyword), exports `spawnCoinReward` function (already exported)

**Changes overview:**
1. Export `MILESTONES` constant
2. Replace 8 milestones with 5 (remove Learning Section, AI Salary Predictor, AI Career Coach)
3. Remove `ScrollTrigger` import and `gsap.registerPlugin(ScrollTrigger)` call
4. Remove `scroll` ref and `ScrollTrigger.create(...)` `useEffect` from `GameplayRig`
5. Remove `checkpoint` ref and checkpoint hold/resume logic from `useFrame`
6. Add `currentProgress` ref; lerp it toward `targetProgressRef.current` in `useFrame`
7. Remove `imageRefs` from `GameplayRig` and `JourneyOverlay`; merge images into milestone card
8. `JourneyOverlay`: remove `imageRefs` param, update card JSX to include `.milestone-image-stack`
9. `GameplayRig`: accept `targetProgressRef` prop, pass to `JourneyOverlay` signature update
10. `SceneContent`: accept and forward `targetProgressRef`
11. `Scene` default export: accept `targetProgressRef` prop
12. Shadow map size: 2048 → 1024; dpr: `[1, 1.75]` → `[1, 1.5]`
13. Remove unused lucide imports: `BookOpen`, `CircleDollarSign`, `Star`

- [ ] **Step 1: Update lucide-react import at top of `Scene.jsx` (line 7)**

Remove `BookOpen`, `CircleDollarSign`, `Star` from the import. Final import:

```js
import {
  Bot,
  BriefcaseBusiness,
  FileText,
  MessagesSquare,
  PanelsTopLeft,
  Sparkles,
  Trophy,
} from "lucide-react";
```

- [ ] **Step 2: Remove ScrollTrigger import and plugin registration**

Remove line:
```js
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
```

Remove the block:
```js
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

- [ ] **Step 3: Replace `MILESTONES` constant (currently lines ~167–262) with 5-milestone version and add `export`**

```js
export const MILESTONES = [
  {
    title: "AI Resume Builder",
    subtitle: "Create a job-ready resume tailored to every opportunity.",
    progress: 0.12,
    side: "left",
    color: "#4aa3ff",
    Icon: FileText,
    images: [
      "https://cdn.enhancv.com/elegant_cover_letter_template_1_20d75594dc.png",
      "https://static.naukimg.com/s/0/0/i/resume360/templates/v5/P2c.png",
    ],
  },
  {
    title: "AI Portfolio Builder",
    subtitle: "Turn your skills and projects into a portfolio that stands out.",
    progress: 0.32,
    side: "right",
    color: "#9b78ff",
    Icon: PanelsTopLeft,
    images: [
      "https://localo.com/assets/img/blog/posts/top-free-ai-website-builders/main-image.webp",
      "https://www.radiustheme.com/wp-content/uploads/2021/09/Beauty-spa.png",
    ],
  },
  {
    title: "AI Mock Interviews",
    subtitle: "Practice realistic interviews and improve with instant feedback.",
    progress: 0.52,
    side: "left",
    color: "#43cfe3",
    Icon: MessagesSquare,
    images: [
      "https://huru.ai/wp-content/uploads/2025/08/Interview-Video-Recording-Live.webp",
      "https://cdn.prod.website-files.com/62775a91cc3db44c787149de/671956e929609d134e2cd0ad_Practicing-ai-interview.webp",
    ],
  },
  {
    title: "Global Jobs",
    subtitle: "Discover opportunities from companies hiring around the world.",
    progress: 0.72,
    side: "right",
    color: "#65cf8b",
    Icon: BriefcaseBusiness,
    images: [
      "https://cdn.dribbble.com/userupload/39436866/file/original-3ed7dfe7eb0197792ca30bbdffd1da13.png?resize=752x&vertical=center",
      "https://cdn.prod.website-files.com/64da807a9aa000087e97b92d/660ecc238019e630976a7a95_65cee4d2d3c1fef72eeb4866_6500d6baae27035a8b107667_templatethumbnail.jpeg",
    ],
  },
  {
    title: "Skill Assessment Tests",
    subtitle: "Measure your strengths and prove your job-ready capabilities.",
    progress: 0.92,
    side: "left",
    color: "#f2a45d",
    Icon: Trophy,
    images: [
      "https://img.uxcel.com/assets/marketing/open-graph-v3/OG%20-%20Uxcel%20-%20Assessments.png",
      "https://cdn.dribbble.com/userupload/8161425/file/original-726e1623afa121648714aa86d51a179c.png?resize=752x&vertical=center",
    ],
  },
];
```

- [ ] **Step 4: Replace `JourneyOverlay` function — remove `imageRefs`, merge images into card**

```jsx
function JourneyOverlay({ cardRefs, progressRef, overlayPortal }) {
  return (
    <Html fullscreen portal={overlayPortal} zIndexRange={[30, 20]} className="journey-html">
      <div className="journey-overlay" aria-live="polite">
        <div className="journey-progress">
          <span>Career journey</span>
          <strong ref={progressRef}>0%</strong>
          <div className="journey-progress-track"><i /></div>
        </div>

        {MILESTONES.map(({ title, subtitle, side, color, Icon, images }, index) => (
          <article
            key={title}
            ref={(el) => { cardRefs.current[index] = el; }}
            className={`milestone-card milestone-card--${side}`}
            style={{ "--milestone": color }}
          >
            <div className="milestone-image-stack">
              {images.slice(0, 2).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${title} preview ${i + 1}`}
                  className="milestone-stack-img"
                  style={{ "--img-index": i }}
                  loading="lazy"
                />
              ))}
              <span className="preview-tag">AI POWERED</span>
            </div>
            <div className="milestone-content">
              <div className="milestone-icon">
                <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div className="milestone-copy">
                <span className="milestone-label">
                  <Sparkles size={12} aria-hidden="true" />
                  Feature {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{title}</h2>
                <p>{subtitle}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Html>
  );
}
```

- [ ] **Step 5: Replace `GameplayRig` function — remove scroll/checkpoint, add `targetProgressRef`**

```jsx
function GameplayRig({ road, background, botScene, roadTopY, segmentLength, overlayPortal, targetProgressRef }) {
  const characterRef = useRef();
  const segmentsRef = useRef([]);
  const cardRefs = useRef([]);
  const progressRef = useRef();
  const wingParts = useRef([]);
  const wingPhase = useRef(0);
  const wingRate = useRef(2.4);
  const { camera } = useThree();

  const currentProgress = useRef(0);
  const lookAt = useRef(new THREE.Vector3(0, roadTopY + 0.55, -9));
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const tryUnlock = () => {
      try {
        const a = new Audio("/coin.wav");
        a.volume = 0.001;
        a.play().catch(() => {});
      } catch (e) {}
    };
    window.addEventListener("pointerdown", tryUnlock, { once: true });
    return () => window.removeEventListener("pointerdown", tryUnlock);
  }, []);

  const roadSegments = useMemo(
    () => Array.from({ length: ROAD_SEGMENTS }, () => road.clone(true)),
    [road],
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const target = targetProgressRef?.current ?? 0;

    currentProgress.current = THREE.MathUtils.damp(currentProgress.current, target, 3.5, delta);
    const progress = currentProgress.current;
    const moving = Math.abs(target - progress) > 0.002;
    const activity = moving ? 1 : 0;

    const travel = progress * TRAVEL_DISTANCE;
    const totalLength = ROAD_SEGMENTS * segmentLength;
    const loopFront = camera.position.z + segmentLength * 1.25;
    const loopBack = loopFront - totalLength;

    segmentsRef.current.forEach((segment, index) => {
      if (!segment) return;
      segment.position.z = wrap(-index * segmentLength + travel, loopBack, loopFront);
    });

    background.position.z = -36 + travel * BACKGROUND_SPEED;
    background.position.x = Math.sin(progress * Math.PI * 1.5) * 0.22;

    if (characterRef.current) {
      if (wingParts.current.length === 0) {
        characterRef.current.traverse((child) => {
          if (!child.isMesh || !child.name.toLowerCase().includes("wing")) return;
          child.userData.authoredRotation = child.rotation.clone();
          wingParts.current.push(child);
        });
      }
      const hover = Math.sin(elapsed * 1.45 + progress * Math.PI * 2) * 0.025;
      const bob = Math.sin(elapsed * 2.3) * 0.018 * activity;
      const bank = Math.sin(elapsed * 1.15) * 0.025 * activity;

      characterRef.current.position.y = roadTopY + 0.11 + hover + bob;
      characterRef.current.rotation.x = THREE.MathUtils.damp(characterRef.current.rotation.x, activity * 0.1, 5, delta);
      characterRef.current.rotation.y = Math.PI;
      characterRef.current.rotation.z = THREE.MathUtils.damp(characterRef.current.rotation.z, bank, 5, delta);

      wingRate.current = THREE.MathUtils.damp(wingRate.current, 2.4 + activity * 2.2, 4, delta);
      wingPhase.current += delta * wingRate.current;
      const flap = Math.sin(wingPhase.current) * (0.14 + activity * 0.08);

      wingParts.current.forEach((wing) => {
        const authored = wing.userData.authoredRotation;
        const lowerWing = wing.name.toLowerCase().includes("down");
        const leftWing = wing.name.includes("_I");
        const direction = leftWing ? -1 : 1;
        wing.rotation.x = authored.x + flap * (lowerWing ? -0.35 : 0.35);
        wing.rotation.y = authored.y + flap * direction * 0.45;
        wing.rotation.z = authored.z + flap * direction;
      });
    }

    const cameraFloat = Math.sin(elapsed * 0.75) * 0.012;
    cameraTarget.set(Math.sin(elapsed * 0.55) * 0.012 * activity, roadTopY + 1.08 + cameraFloat, 3.25 - activity * 0.12);
    camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 3.1));
    lookTarget.set(0, roadTopY + 0.55, -9.5 - activity * 0.6);
    lookAt.current.lerp(lookTarget, 1 - Math.exp(-delta * 3.8));
    camera.lookAt(lookAt.current);

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const milestone = MILESTONES[index];
      const distance = (progress - milestone.progress) / 0.085;
      const visibility = Math.max(0, 1 - Math.abs(distance));
      const eased = THREE.MathUtils.smoothstep(visibility, 0, 1);
      const passed = distance > 0 ? Math.min(distance, 1) : 0;
      const entered = THREE.MathUtils.smoothstep(eased, 0, 0.75);
      const exit = THREE.MathUtils.smoothstep(passed, 0.45, 1);
      const opacity = THREE.MathUtils.smoothstep(eased, 0.72, 0.94) * (1 - exit);
      const direction = milestone.side === "left" ? -1 : 1;
      const translateX = direction * ((1 - entered) * 118 + exit * 34);
      const translateY = (1 - eased) * 18 + Math.sin(elapsed * 1.1 + index) * 3 * eased;
      const scale = 0.94 + eased * 0.06;

      card.style.opacity = String(opacity);
      card.style.transform = `translate3d(${translateX}%, ${translateY}px, 0) scale(${scale})`;
      card.style.pointerEvents = opacity > 0.85 ? "auto" : "none";
      card.classList.toggle("milestone-card--active", visibility > 0.91);
    });

    if (progressRef.current) {
      const percentage = Math.round(progress * 100);
      progressRef.current.textContent = `${percentage}%`;
      progressRef.current.parentElement?.style.setProperty("--journey-progress", `${percentage}%`);
    }
  });

  return (
    <>
      <primitive object={background} />
      <group>
        {roadSegments.map((segment, index) => (
          <primitive
            key={index}
            ref={(el) => { segmentsRef.current[index] = el; }}
            object={segment}
            position={[0, 0, -index * segmentLength]}
          />
        ))}
      </group>
      <Character ref={characterRef} scene={botScene} />
      <ContactShadows position={[0, roadTopY + 0.012, 0.02]} opacity={0.28} scale={1.7} blur={2.8} far={1.2} color="#33434c" frames={1} />
      <JourneyOverlay cardRefs={cardRefs} progressRef={progressRef} overlayPortal={overlayPortal} />
    </>
  );
}
```

- [ ] **Step 6: Update `SceneContent` to forward `targetProgressRef`**

```jsx
function SceneContent({ overlayPortal, targetProgressRef }) {
  const { scene: roadScene } = useGLTF(ROAD_URL);
  const { scene: bgScene } = useGLTF(BG_URL);
  const { scene: botScene } = useGLTF(BOT_URL);

  const { road, segmentLength, roadTopY } = useMemo(() => prepareRoad(roadScene), [roadScene]);
  const background = useMemo(() => prepareBackground(bgScene, roadTopY), [bgScene, roadTopY]);

  return (
    <>
      <color attach="background" args={["#d9d7cf"]} />
      <fog attach="fog" args={["#d9d7cf", 38, 150]} />
      <ambientLight color="#ffffff" intensity={0.75} />
      <hemisphereLight args={["#f5fbff", "#8c8170", 1.15]} />
      <directionalLight
        castShadow
        color="white"
        intensity={2.3}
        position={[-4, 9, 6]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={28}
        shadow-bias={-0.00012}
      />
      <Suspense fallback={null}>
        <GameplayRig
          road={road}
          background={background}
          botScene={botScene}
          roadTopY={roadTopY}
          segmentLength={segmentLength}
          overlayPortal={overlayPortal}
          targetProgressRef={targetProgressRef}
        />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.12} luminanceThreshold={0.86} luminanceSmoothing={0.25} radius={0.3} />
        <Vignette eskil={false} offset={0.4} darkness={0.15} />
      </EffectComposer>
    </>
  );
}
```

- [ ] **Step 7: Update `Scene` default export to accept `targetProgressRef`**

```jsx
export default function Scene({ targetProgressRef }) {
  const [overlayNode, setOverlayNode] = useState(null);
  const overlayPortal = useMemo(() => (overlayNode ? { current: overlayNode } : undefined), [overlayNode]);

  return (
    <div className="canvas-shell">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.08, 3.25], fov: 45, near: 0.05, far: 190 }}
        gl={{ antialias: true, powerPreference: "high-performance", outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <SceneContent overlayPortal={overlayPortal} targetProgressRef={targetProgressRef} />
      </Canvas>
      <div ref={setOverlayNode} className="overlay-portal" />
    </div>
  );
}
```

- [ ] **Step 8: Add CSS for image-stack layout in `styles/globals.css`**

Append to `styles/globals.css`:

```css
.milestone-image-stack {
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  background: #1a1a2e;
}

.milestone-stack-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.milestone-stack-img:nth-child(2) {
  transform: scale(0.88) translate(6%, 4%);
  opacity: 0;
  transition: opacity 0.4s 0.15s;
}

.milestone-card--active .milestone-stack-img:nth-child(2) {
  opacity: 0.55;
}

.preview-tag {
  position: absolute;
  top: 8px;
  right: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 99px;
  backdrop-filter: blur(6px);
  z-index: 2;
}
```

- [ ] **Step 9: Commit**

```bash
git add components/Scene.jsx styles/globals.css
git commit -m "feat: quiz-driven movement, 5 milestones, image-stacked cards, perf improvements"
```

---

### Task 7: Gamified Route — State Machine + Quiz Integration

**Files:**
- Create: `pages/gamified.jsx`

**Interfaces:**
- Consumes: `SkillPickerScreen` (prop: `onSelect`), `Scene` (dynamic, prop: `targetProgressRef`), `QuizPanel` (props: `question`, `milestoneIndex`, `milestoneTitle`, `milestoneColor`, `onCorrect`), `getQuestionsForSkill` from `lib/quizData.js`, `MILESTONES` and `spawnCoinReward` from `components/Scene.jsx`
- Produces: `/gamified` route with state machine: `"skill-picker"` → `"game"` → `"complete"`

- [ ] **Step 1: Create `pages/gamified.jsx`**

```jsx
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SkillPickerScreen from "@/components/SkillPickerScreen";
import QuizPanel from "@/components/QuizPanel";
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
              You've mastered all 5 features on your career road.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
              <button
                onClick={() => { setPhase("skill-picker"); setCurrentMilestoneIndex(0); targetProgressRef.current = 0; }}
                style={{ background: "#7c3aed", border: "none", borderRadius: 14, padding: "14px 28px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}
              >
                Play Again
              </button>
              <button
                onClick={() => { if (typeof window !== "undefined") window.location.href = "/"; }}
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
```

- [ ] **Step 2: Full flow test**

Open `http://localhost:3000/gamified`. Verify:
1. Skill picker shows 8 cards, search filters them
2. Click "React" → loading spinner → 3D game appears
3. QuizPanel visible top-right with Question 1 of 5
4. Click wrong answer → red shake + "Try again!" → auto-resets after 1.3s
5. Click correct answer → green highlight + "Correct! Moving forward..." → character lerps toward milestone 0.12 progress → QuizPanel updates to Question 2
6. Complete all 5 → trophy completion screen
7. "Play Again" resets to skill picker; "Change Mode" goes to `/`

- [ ] **Step 3: Commit**

```bash
git add pages/gamified.jsx
git commit -m "feat: gamified route — skill picker to quiz game to completion screen"
```

---

### Task 8: Navbar Updates + Final Polish

**Files:**
- Modify: `components/Navbar.jsx`
- Modify: `styles/globals.css` (minor)

**Interfaces:**
- Consumes: `next/router` `useRouter` to detect current route

- [ ] **Step 1: Update `Navbar.jsx` — add "Change mode" back link and fix coin count**

Add `useRouter` import and back-link logic. Also update coin count from `0 / 8` → `0 / 5` since there are now 5 milestones.

```jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Sparkles, Star } from "lucide-react";

const navLinks = [
  { label: "For Companies", href: "/companies" },
  { label: "Templates", href: "/templates" },
  { label: "Jobs", href: "/jobs" },
  { label: "AI Portfolio Builder", href: "/ai-builder" },
];

export default function Navbar() {
  const router = useRouter();
  const showBack = router.pathname === "/classic" || router.pathname === "/gamified";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-[76px] w-full items-center justify-between px-5 md:h-[82px] md:px-8 xl:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <MySkillsLogo />
            <div className="hidden leading-none sm:block">
              <h1 className="text-[19px] font-black text-[#111827] md:text-[21px]">My Skills Page</h1>
            </div>
          </Link>
          {showBack && (
            <button
              onClick={() => router.push("/")}
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[13px] font-700 text-[#4b5563] shadow-sm backdrop-blur-sm transition hover:bg-white md:flex"
            >
              <ArrowLeft size={14} />
              Change mode
            </button>
          )}
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/75 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] lg:flex">
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className="rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#4B5563] transition hover:bg-[#111827] hover:text-white xl:px-5">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/signin" className="hidden rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#374151] transition hover:bg-white md:block">
            Sign in
          </Link>
          <Link href="/signup" className="group flex h-11 items-center gap-2 rounded-full bg-[#111827] px-4 text-[14px] font-bold text-white shadow-[0_14px_35px_rgba(17,24,39,0.2)] transition hover:-translate-y-0.5 hover:bg-[#2563EB] sm:px-5 md:h-12 md:px-6 md:text-[15px]">
            <span className="hidden sm:inline">Get started free</span>
            <span className="sm:hidden">Start free</span>
            <ArrowRight size={17} strokeWidth={2.5} className="transition duration-300 group-hover:translate-x-1" />
          </Link>
          <div id="navbar-coin-rewards" className="journey-rewards-nav flex items-center gap-2 px-3 py-1.5 border border-[#de9923]/30 rounded-full bg-[#fffcef]/95 text-[#6e4a0e] backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-transform duration-200">
            <span className="reward-coin-nav grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-[#fff0a0] to-[#c77605] text-[#fff4b3] border border-[#ffe596] shadow-[0_0_8px_rgba(255,182,38,0.4)]">
              <Star size={10} fill="currentColor" />
            </span>
            <div className="flex flex-col text-[10px] font-bold leading-tight">
              <span className="text-[7px] uppercase tracking-wider text-black/40">Coins</span>
              <strong className="coin-count-text text-xs tabular-nums">0 / 5</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MySkillsLogo() {
  return (
    <svg viewBox="0 0 52 44" className="h-[36px] w-[46px] shrink-0">
      <path d="M5 14 26 5l21 9-21 9L5 14Z" fill="#4f7cff" />
      <path d="M5 24 26 33l21-9" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 33 26 42l21-9" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v10l21 9V23L5 14Z" fill="#2f68ff" />
      <path d="M47 14v10l-21 9V23l21-9Z" fill="#164fd4" />
    </svg>
  );
}
```

- [ ] **Step 2: Final smoke test — all three routes**

```bash
# Make sure dev server is running
npm run dev
```

Check:
- `http://localhost:3000` → black mode selection screen, two cards, no console errors
- `http://localhost:3000/classic` → full marketing site, normal scroll, "Change mode" button in Navbar
- `http://localhost:3000/gamified` → skill picker → game → quiz drives character → completion screen

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.jsx
git commit -m "feat: navbar back button and coin count updated to 5 milestones"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Mode selection always shown on page load (separate route, no persistence)
- [x] Classic route — standalone, independent file, zero 3D
- [x] Gamified route — skill picker first, then game
- [x] 8 skills with images and hardcoded quiz questions
- [x] 5 milestones (removed Learning Section, AI Salary Predictor, AI Career Coach)
- [x] Scroll-container-3d removed entirely
- [x] Character moves only on correct quiz answer (targetProgressRef mutated on correct)
- [x] Wrong answer → shake + "Try again!" (QuizPanel handles this)
- [x] Milestone card layout — images at top, text below (milestone-image-stack)
- [x] Quiz panel on opposite side from milestone card
- [x] Performance: shadow map 1024, dpr 1.5, classic loads zero 3D, Scene dynamically imported only on gamified
- [x] MILESTONES exported from Scene.jsx so gamified.jsx can import it

**Type consistency:**
- `targetProgressRef` is a `React.MutableRefObject<number>` — created in gamified.jsx with `useRef(0)`, passed to Scene, read in GameplayRig's `useFrame`
- `getQuestionsForSkill(skillId: string)` returns `Array<{question, options, correct}>` — used correctly in gamified.jsx
- `MILESTONES` exported from Scene.jsx, imported dynamically in gamified.jsx via `await import("@/components/Scene")` — used to set `milestones` state
- `spawnCoinReward(count: number)` — called with `nextIndex` (1-based count of completed milestones)
- `onCorrect: () => void` in QuizPanel — matches `handleCorrectAnswer` signature in gamified.jsx
