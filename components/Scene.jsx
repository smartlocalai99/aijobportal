import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import {
  Bot,
  BriefcaseBusiness,
  FileText,
  MessagesSquare,
  PanelsTopLeft,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import Character, { BOT_URL } from "./Character";

const AUDIO_POOL_SIZE = 8;
const audioPool = [];
let poolIndex = 0;

if (typeof window !== "undefined") {
  // Preload coin sound pool
  for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
    const audio = new Audio("/coin.wav");
    audio.preload = "auto";
    audio.load();
    audioPool.push(audio);
  }
}

export function playCoinSound() {
  if (audioPool.length === 0) return;
  try {
    const audio = audioPool[poolIndex];
    audio.currentTime = 0;
    audio.volume = 0.45;
    audio.play().catch((err) => {
      console.warn("Failed to play audio from pool:", err);
      // Fallback
      const fallback = new Audio("/coin.wav");
      fallback.volume = 0.45;
      fallback.play().catch(() => { });
    });
    poolIndex = (poolIndex + 1) % AUDIO_POOL_SIZE;
  } catch (e) { }
}

export function spawnCoinReward(rewardCount) {
  if (typeof document === "undefined") return;
  const overlay = document.querySelector(".journey-overlay");
  if (!overlay) return;

  // Play the coin sound immediately when the coin first pops up
  playCoinSound();

  const coin = document.createElement("div");
  coin.className = "checkpoint-coin";
  coin.style.display = "grid";

  const ring = document.createElement("i");
  ring.className = "coin-ring";
  coin.appendChild(ring);

  const rewardCoin = document.createElement("span");
  rewardCoin.className = "reward-coin";
  rewardCoin.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  `;
  coin.appendChild(rewardCoin);

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("i");
    particle.className = "coin-particle";
    particle.style.setProperty("--particle-index", i);
    coin.appendChild(particle);
  }

  const strong = document.createElement("strong");
  strong.textContent = "+1";
  coin.appendChild(strong);

  overlay.appendChild(coin);

  const counter = document.getElementById("navbar-coin-rewards");
  const destination = counter ? counter.getBoundingClientRect() : { left: window.innerWidth - 100, top: 30, width: 80, height: 40 };
  const startX = window.innerWidth * 0.5;
  const startY = window.innerHeight * 0.47;
  const endX = destination.left + destination.width * 0.28;
  const endY = destination.top + destination.height * 0.5;

  gsap.set(coin, {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 3.6,
    rotateY: -540,
    rotateZ: -12,
  });

  const tl = gsap.timeline();
  tl.to(coin, {
    opacity: 1,
    scale: 2.45,
    rotateY: 0,
    rotateZ: 4,
    duration: 0.68,
    ease: "power3.out",
  })
    .to(coin, {
      scale: 1.28,
      rotateY: 540,
      rotateZ: 0,
      duration: 0.72,
      ease: "sine.inOut",
    })
    .to(coin, {
      x: endX - startX,
      y: endY - startY,
      scale: 0.24,
      rotateY: 1080,
      duration: 0.96,
      ease: "power3.inOut",
    })
    .to(coin, { opacity: 0, duration: 0.16 }, "-=0.16")
    .call(() => {
      if (counter) {
        gsap.fromTo(
          counter,
          { scale: 1 },
          {
            scale: 1.12,
            duration: 0.24,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );

        const count = counter.querySelector(".coin-count-text") || counter.querySelector("strong");
        if (count) {
          count.textContent = `${rewardCount} / 5`;
        }
      }
      coin.remove();
    });
}

const ROAD_URL = "/road.glb";
const BG_URL = "/bg.glb";
const ROAD_SEGMENTS = 9;
const ROAD_WIDTH = 2.7;
const TRAVEL_DISTANCE = 210;
const BACKGROUND_SPEED = 0.2;

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
    side: "left",
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
    side: "left",
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

function wrap(value, min, max) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function cloneAuthoredScene(scene, { castShadow = false } = {}) {
  const clone = scene.clone(true);

  clone.traverse((child) => {
    if (!child.isMesh) return;
    child.castShadow = castShadow;
    child.receiveShadow = true;
    if (child.material) {
      child.material.fog = true;
      child.material.needsUpdate = true;
    }
  });

  return clone;
}

function prepareRoad(scene) {
  const road = cloneAuthoredScene(scene, { castShadow: true });
  road.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(road);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = ROAD_WIDTH / Math.max(size.x, 0.001);

  road.scale.setScalar(scale);
  road.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  road.updateMatrixWorld(true);

  const scaledBounds = new THREE.Box3().setFromObject(road);
  const scaledSize = scaledBounds.getSize(new THREE.Vector3());

  return {
    road,
    segmentLength: Math.max(scaledSize.z * 0.997, 1),
    roadTopY: scaledBounds.max.y,
  };
}

function prepareBackground(scene, roadTopY) {
  const background = cloneAuthoredScene(scene);
  background.position.set(0, roadTopY - 7.8, -36);
  background.rotation.y = Math.PI;
  background.scale.setScalar(0.2);
  return background;
}

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

useGLTF.preload(ROAD_URL);
useGLTF.preload(BG_URL);
useGLTF.preload(BOT_URL);
