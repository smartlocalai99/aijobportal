# Mode Selection + Gamified Quiz Redesign

**Date:** 2026-06-28  
**Status:** Approved

---

## Overview

Replace the current single-page scroll-driven game with a mode selection entry point. Users always see a mode picker on load. They choose Gamified (quiz-driven 3D game) or Classic (standard marketing site). Each mode lives in its own route so they can evolve independently.

---

## Architecture

```
pages/
  index.jsx        ← Mode selection screen (no 3D imports)
  classic.jsx      ← Classic marketing site (standalone, zero 3D)
  gamified.jsx     ← Gamified experience (3D + quiz)

components/
  ModeSelectionScreen.jsx   ← Two animated cards on black bg
  SkillPickerScreen.jsx     ← Skill grid + search before game
  QuizPanel.jsx             ← In-game quiz with 4 options per question
  (existing Scene.jsx, Character.jsx, etc. — modified)
```

**Why separate routes:** Classic will receive independent future redesigns. Separate files guarantee zero coupling — Classic changes never risk breaking the game, and vice versa.

---

## Screen 1: Mode Selection (`pages/index.jsx`)

- Full-screen black background
- Two cards centered side by side, animated in with framer-motion (fade + slide up, 60ms stagger)
- **Gamified card:** dark/neon aesthetic, subtitle "Interactive · Quiz-based", preview thumbnail of the 3D character/road, hover: neon glow border
- **Classic card:** clean white/minimal aesthetic, subtitle "Fast · No extras", preview thumbnail of the marketing hero, hover: subtle lift + shadow
- Clicking a card navigates to `/gamified` or `/classic` via Next.js router
- Zero Three.js/GSAP/R3F imports on this page

---

## Screen 2: Classic Mode (`pages/classic.jsx`)

Exact copy of current marketing sections in order:

1. Navbar
2. AIPortfolioHero
3. CompanyLogoMarquee
4. CareerFlow
5. FavoriteJobsSection
6. ClientTestimonials
7. StoriesNetwork
8. TestimonialsSection
9. JobFooterSection

All components imported with `dynamic()` + `ssr: false` (same pattern as current `index.jsx`). Zero Three.js. Zero GSAP. Standard browser scroll.

---

## Screen 3: Gamified Mode (`pages/gamified.jsx`)

Three phases rendered in sequence via state machine: `skill-picker` → `loading` → `game`.

### Phase A: Skill Picker (`SkillPickerScreen`)

Full-screen dark UI rendered before any 3D assets load.

**Hardcoded skills (8):**

| Skill | Representative image |
|---|---|
| React | React logo / component screenshot |
| JavaScript | JS logo / code screenshot |
| HTML & CSS | Browser screenshot |
| Python | Python logo / code screenshot |
| UI/UX Design | Figma/design tool screenshot |
| Photography | Camera / portfolio image |
| Data Science | Chart/graph image |
| Node.js | Server/API screenshot |

**Layout:** search bar at top, responsive grid of skill cards below. Each card: large image (top 60%), skill name + short tag (bottom 40%), hover: scale up + accent border.

Searching filters cards by skill name in real-time (client-side, no API).

Clicking a skill card:
1. Sets `selectedSkill` state
2. Dynamically imports `Scene` component (triggers 3D asset loading)
3. Shows brief loading state
4. Transitions to game phase

### Phase B: Game

**Milestones (5 total — remove Learning Section, AI Salary Predictor, AI Career Coach):**

| # | Title | Side | Color |
|---|---|---|---|
| 1 | AI Resume Builder | left | #4aa3ff |
| 2 | AI Portfolio Builder | right | #9b78ff |
| 3 | AI Mock Interviews | left | #43cfe3 |
| 4 | Global Jobs | right | #65cf8b |
| 5 | Skill Assessment Tests | left | #f2a45d |

Progress values: 0.0, 0.25, 0.5, 0.75, 1.0

**Remove entirely:**
- `scroll-container-3d` div and the `ScrollTrigger` scroll mechanic
- `onLeave` / `onEnterBack` body class toggling

**Character movement — quiz-driven:**
- `gameProgress` ref holds current progress (0.0 to 1.0)
- On correct answer: lerp `gameProgress` to next milestone's progress value over ~1.5s
- On wrong answer: no movement
- `useFrame` reads `gameProgress` ref (not scroll) to drive road segments and character position

**Milestone card layout change:**
- Current: service card one side, images other side, subtitle inside card
- New: service card one side (image + text below image stacked vertically), QuizPanel on the opposite side

**QuizPanel component:**
- Positioned as a fixed overlay panel (like current milestone cards, same entry animation)
- Shows: question text, 4 multiple-choice buttons
- On correct: green flash + coin reward animation + character advances
- On wrong: red shake animation + "Try again!" message beneath options
- Once character reaches a milestone's progress: show next milestone's question
- After all 5 milestones: show completion screen ("Journey Complete!")

### Hardcoded Quiz Questions (5 per skill, one per milestone)

**React**
1. What hook manages local component state? → `useState` ✓
2. Which hook runs side effects after render? → `useEffect` ✓
3. What does JSX stand for? → JavaScript XML ✓
4. Which prop passes children into a component? → `children` ✓
5. What does `key` prop help React do? → Efficiently re-render lists ✓

**JavaScript**
1. Which keyword declares a block-scoped variable? → `let` ✓
2. What does `===` check? → Value and type ✓
3. What is a Promise? → An async operation result ✓
4. Which method adds an item to end of array? → `push()` ✓
5. What does `typeof null` return? → `"object"` ✓

**HTML & CSS**
1. Which tag defines the page structure root? → `<html>` ✓
2. Which CSS property controls spacing inside an element? → `padding` ✓
3. What does `display: flex` do? → Creates a flex container ✓
4. Which HTML attribute links a stylesheet? → `href` ✓
5. What unit is relative to viewport width? → `vw` ✓

**Python**
1. Which keyword defines a function? → `def` ✓
2. What is a Python list comprehension? → A concise way to create lists ✓
3. Which method removes whitespace from string ends? → `.strip()` ✓
4. What does `len()` return? → Number of items ✓
5. Which keyword is used for inheritance? → `class Child(Parent)` ✓

**UI/UX Design**
1. What does UX stand for? → User Experience ✓
2. What is a wireframe? → A low-fidelity layout sketch ✓
3. What is contrast used for in design? → Visual hierarchy and readability ✓
4. What is a design system? → A reusable component library ✓
5. What does A/B testing compare? → Two design variants ✓

**Photography**
1. What does ISO control? → Camera sensor sensitivity ✓
2. What is the rule of thirds? → Composition guideline ✓
3. Which aperture lets in more light? → f/1.8 ✓
4. What is golden hour? → Light just after sunrise/before sunset ✓
5. What does RAW format preserve? → Unprocessed image data ✓

**Data Science**
1. What does CSV stand for? → Comma-Separated Values ✓
2. Which Python library is used for dataframes? → Pandas ✓
3. What is overfitting? → Model too specific to training data ✓
4. What does mean represent? → Average of values ✓
5. What is a confusion matrix used for? → Evaluating classification models ✓

**Node.js**
1. What is Node.js? → Server-side JavaScript runtime ✓
2. Which module handles HTTP in Node? → `http` ✓
3. What does `npm install` do? → Installs project dependencies ✓
4. What is `package.json`? → Project metadata and dependencies file ✓
5. Which keyword imports a module? → `require()` ✓

---

## Performance

- `pages/index.jsx`: no heavy imports whatsoever
- `pages/classic.jsx`: no Three.js/GSAP/R3F — marketing-only bundle
- `pages/gamified.jsx`: Scene dynamically imported only after skill is selected
- Shadow map size reduced from 2048 → 1024
- `useGLTF.preload` calls moved to gamified page only
- Image lazy loading on skill picker cards

---

## Files to Create / Modify

| File | Action |
|---|---|
| `pages/index.jsx` | Replace with ModeSelectionScreen only |
| `pages/classic.jsx` | New — current marketing layout |
| `pages/gamified.jsx` | New — skill picker + game |
| `components/ModeSelectionScreen.jsx` | New |
| `components/SkillPickerScreen.jsx` | New |
| `components/QuizPanel.jsx` | New |
| `components/Scene.jsx` | Modify — remove scroll trigger, add quiz-driven movement, update milestones, update layout |
