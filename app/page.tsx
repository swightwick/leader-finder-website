"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SCREENS = [
  { src: "/screens/1.jpg", alt: "Finder screen showing attribute filters (Earrings, Glasses, Hat, Necklace, Tattoo) and hair color selector, with 12 of 72 bald leaders displayed including Yvonne and Hugo" },
  { src: "/screens/2.jpg", alt: "Finder screen with Earrings, Glasses, and Hat filters active, narrowing results to 2 of 72 leaders — Angel and Gonzales, both bald" },
  { src: "/screens/3.jpg", alt: "Leader detail view for Gonzales showing his full illustration, bald hair label, and accessory icons for Earrings, Glasses, Hat, Necklace, and Tattoo" },
  { src: "/screens/4.jpg", alt: "Items screen listing all Hitman Freelancer locations — Ambrose Island, Bangkok, Berlin, Chongqing, Colorado, Dartmoor, Dubai, Haven Island, Hokkaido, and Isle of S'gail — with weapon counts" },
  { src: "/screens/5.jpg", alt: "Items detail view for Ambrose Island listing 8 weapons including Shotgun 12G Short H, Handgun 75R, SMG X2, SMG X2 Covert (carried by Noel Crest), Folding Knife, Assault Rifle G1-4/C, Oil Canister, and Assault Rifle A33" },
  { src: "/screens/6.jpg", alt: "Items detail view for Dartmoor listing 4 weapons: Handgun 75R (carried by various guards), Hunting Shotgun (Mansion ground floor weapon cabinet, behind glass), SMG HX-10 (carried by various guards), and Tactical Shotgun 12G (carried by various guards)" },
  { src: "/screens/7.jpg", alt: "About screen explaining the Freelancer Leader Finder app — what it is, how to use filters, hair color buttons, leader cards, dismiss and restore actions, and a copyright disclaimer stating it is not affiliated with IO Interactive or Square Enix" },
];
const TOTAL = SCREENS.length;
const GAP = 16;
const HALF = Math.floor(TOTAL / 2);
const INIT_POS = [0, 1, 2, 3, -3, -2, -1];
const MOBILE_BREAKPOINT = 640;

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus(res.ok ? "success" : "error");
    } catch {
      setSubStatus("error");
    }
  };
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const logPos = useRef([...INIT_POS]);
  const isAnimating = useRef(false);
  const step = useRef(0);
  const isMobile = useRef(false);

  const adjacentOpacity = () => (isMobile.current ? 0 : 1);

  const initSizes = useCallback(() => {
    if (!trackRef.current) return;

    const trackW = trackRef.current.offsetWidth;
    const mobile = trackW < MOBILE_BREAKPOINT;
    isMobile.current = mobile;

    let slideW: number;
    let slideH: number;

    if (mobile) {
      slideH = Math.round(window.innerHeight * 0.8);
      slideW = Math.round(slideH * (1290 / 2796));
      step.current = trackW; // full-width step so adjacent slides go fully off-screen
    } else {
      slideW = Math.floor(trackW / 3) - GAP;
      slideH = Math.round(slideW * (2796 / 1290));
      step.current = slideW + GAP;
    }

    slideRefs.current.forEach(el => {
      if (!el) return;
      const img = el.querySelector("img") as HTMLImageElement | null;
      if (img) { img.style.width = slideW + "px"; img.style.height = slideH + "px"; }
      el.style.marginLeft = `-${slideW / 2}px`;
    });

    if (trackRef.current) trackRef.current.style.height = slideH + "px";

    const s = step.current;
    for (let i = 0; i < TOTAL; i++) {
      const p = logPos.current[i];
      gsap.set(slideRefs.current[i], {
        x: p * s,
        opacity: p === 0 ? 1 : Math.abs(p) === 1 ? adjacentOpacity() : 0,
        scaleY: p === 0 ? 1 : 0.88,
        zIndex: p === 0 ? 2 : 1,
      });
    }
  }, []);

  useEffect(() => {
    initSizes();
    const ro = new ResizeObserver(initSizes);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [initSizes]);

  const navigate = useCallback((dir: 1 | -1) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const newPos = [...logPos.current];
    const s = step.current;

    const wrapFrom = dir === 1 ? -HALF : HALF;
    const wrapTo   = dir === 1 ?  HALF : -HALF;
    const wrapIdx  = newPos.findIndex(p => p === wrapFrom);

    for (let i = 0; i < TOTAL; i++) newPos[i] -= dir;
    if (wrapIdx >= 0) newPos[wrapIdx] = wrapTo;
    logPos.current = newPos;

    if (wrapIdx >= 0) {
      gsap.set(slideRefs.current[wrapIdx], { x: wrapTo * s, opacity: 0 });
    }

    let done = 0;
    for (let i = 0; i < TOTAL; i++) {
      const p = newPos[i];
      gsap.to(slideRefs.current[i], {
        x: p * s,
        opacity: p === 0 ? 1 : Math.abs(p) === 1 ? adjacentOpacity() : 0,
        scaleY: p === 0 ? 1 : 0.88,
        zIndex: p === 0 ? 2 : 1,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => { if (++done === TOTAL) isAnimating.current = false; },
      });
    }

    setActiveIdx(newPos.findIndex(p => p === 0));
  }, []);

  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-[#720110] to-black">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-white mb-2 tracking-[0.2em]">
          LEADER FINDER
        </h1>
        <h2 className="text-xl font-bold text-grey-300 tracking-[0.3em] opacity-40">
          COMPANION FOR HITMAN WORLD OF ASSASSINATION
        </h2>
      </div>

      {/* Divider */}
      <div className="w-24 h-px mb-8 bg-primary" />

      {/* Description */}
      <p className="text-lg leading-relaxed max-w-3xl mb-6 text-white">
        A fan-made tool to help Hitman WOA players identify Freelancer Showdown targets. Filter
        by accessories, hair color, and other distinguishing features to find your
        mark — fast.
      </p>

      <p className="text-base leading-relaxed max-w-2xl mb-12 text-secondary">
        Browse a visual reference of syndicate leaders, toggle attribute filters,
        and narrow down suspects in seconds. Available soon on iOS.
      </p>

      {/* Screenshot Carousel */}
      <div className="w-full max-w-3xl mb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            type="button"
            aria-label="Previous screenshot"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <title>Previous</title>
              <path d="m9.375 11.25 -3.75 -3.75 3.75 -3.75" strokeWidth="1" />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="relative flex-1 overflow-hidden h-[433px]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {SCREENS.map((screen, i) => (
              <div
                key={i}
                ref={el => { slideRefs.current[i] = el; }}
                className="absolute"
                style={{ left: "50%", top: 0 }}
              >
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={1290}
                  height={2796}
                  className="rounded-2xl shadow-4xl border border-white/10"
                  style={{ width: 200, height: 433 }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            aria-label="Next screenshot"
            type="button"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ transform: "rotate(180deg)" }}>
              <title>Next</title>
              <path d="m9.375 11.25 -3.75 -3.75 3.75 -3.75" strokeWidth="1" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIdx ? "bg-white w-4" : "bg-white/30 w-1.5",
              ].join(" ")}
            />
          ))}
        </div>
      </div>


      {/* Email Signup */}
      <div className="mt-8 w-full max-w-sm">
        {subStatus === "success" ? (
          <p className="text-sm text-white/70 text-center">You&apos;re on the list. We&apos;ll let you know when it&apos;s ready.</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-white/40 text-center">Get notified at launch</p>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/20 rounded px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={subStatus === "loading"}
                className="px-5 py-2.5 text-sm font-bold tracking-wider uppercase bg-primary text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {subStatus === "loading" ? "..." : "Notify Me"}
              </button>
            </div>
            {subStatus === "error" && (
              <p className="text-xs text-red-400 text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-muted">
        Not affiliated with IO Interactive. Hitman™ is a trademark of IO Interactive A/S.
      </p>
      <div className="mt-4 flex gap-6 text-xs">
        <a href="/terms" className="hover:text-white transition-colors text-muted">Terms of Use</a>
        <a href="/privacy" className="hover:text-white transition-colors text-muted">Privacy Policy</a>
      </div>
    </main>
  );
}
