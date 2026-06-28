// components/Navbar.jsx

import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const navLinks = [
  {
    label: "For Companies",
    href: "/companies",
  },
  {
    label: "Templates",
    href: "/templates",
  },
  {
    label: "Jobs",
    href: "/jobs",
  },
  {
    label: "AI Portfolio Builder",
    href: "/ai-builder",
  },
];

export default function Navbar() {
  const router = useRouter();
  const showBack = router.pathname === "/classic" || router.pathname === "/gamified";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-transparent">
      <div className="mx-auto flex h-[76px] w-full items-center justify-between px-5 md:h-[82px] md:px-8 xl:px-10">
        {/* Logo + optional back button */}
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
              className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[13px] font-bold text-[#4b5563] shadow-sm backdrop-blur-sm transition hover:bg-white md:flex"
            >
              <ArrowLeft size={14} />
              Change mode
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-black/5 bg-white/75 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.05)] lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#4B5563] transition hover:bg-[#111827] hover:text-white xl:px-5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="hidden rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#374151] transition hover:bg-white md:block"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="group flex h-11 items-center gap-2 rounded-full bg-[#111827] px-4 text-[14px] font-bold text-white shadow-[0_14px_35px_rgba(17,24,39,0.2)] transition hover:-translate-y-0.5 hover:bg-[#2563EB] sm:px-5 md:h-12 md:px-6 md:text-[15px]"
          >
            <span className="hidden sm:inline">Get started free</span>
            <span className="sm:hidden">Start free</span>
            <ArrowRight
              size={17}
              strokeWidth={2.5}
              className="transition duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Coin reward indicator in Navbar */}
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
      <path
        d="M5 24 26 33l21-9"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 33 26 42l21-9"
        fill="none"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 14v10l21 9V23L5 14Z" fill="#2f68ff" />
      <path d="M47 14v10l-21 9V23l21-9Z" fill="#164fd4" />
    </svg>
  );
}
