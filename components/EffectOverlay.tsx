"use client";

import { useEffect, useRef, useState } from "react";
import type { NodeEffects } from "@/lib/types";
import { playJumpScare, playHeartbeat, stopHeartbeat, playWhisper } from "@/lib/audio";

interface Props {
  effects?: NodeEffects;
  intense: boolean;
  nodeKey: string;
}

export default function EffectOverlay({ effects, intense, nodeKey }: Props) {
  const [jumpFlash, setJumpFlash] = useState<"white" | "red" | null>(null);
  const [jumpText, setJumpText] = useState<string | null>(null);
  const [flicker, setFlicker] = useState(false);
  const firedJump = useRef<string | null>(null);

  // jump-scare فقط یک بار در لحظه‌ی ورود به گره
  useEffect(() => {
    if (!effects?.jumpScare || !intense) return;
    if (firedJump.current === nodeKey) return;
    firedJump.current = nodeKey;
    setJumpFlash(effects.jumpScare.flash ?? "red");
    setJumpText(effects.jumpScare.text ?? null);
    playJumpScare();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([90, 40, 120]);
    }
    const t1 = setTimeout(() => setJumpFlash(null), 260);
    const t2 = setTimeout(() => setJumpText(null), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [nodeKey, effects, intense]);

  // heartbeat
  useEffect(() => {
    if (!effects?.heartbeat || !intense) {
      stopHeartbeat();
      return;
    }
    playHeartbeat(effects.intensity ?? 1);
    return () => stopHeartbeat();
  }, [nodeKey, effects, intense]);

  // whispers — یک نجوا موقع ورود + تکرار تصادفی (حس طبیعی، نه مکانیکی)
  useEffect(() => {
    if (!effects?.whispers || !intense) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    playWhisper(3);
    const schedule = () => {
      if (!alive) return;
      timer = setTimeout(() => {
        if (!alive) return;
        playWhisper(2.5);
        schedule();
      }, 7000 + Math.random() * 5000);
    };
    schedule();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [nodeKey, effects, intense]);

  // flicker — پلک زدن نور
  useEffect(() => {
    if (!effects?.flicker || !intense) {
      setFlicker(false);
      return;
    }
    let alive = true;
    const cycle = () => {
      if (!alive) return;
      setFlicker(true);
      setTimeout(() => {
        if (!alive) return;
        setFlicker(false);
        setTimeout(cycle, 900 + Math.random() * 2200);
      }, 120 + Math.random() * 200);
    };
    cycle();
    return () => {
      alive = false;
      setFlicker(false);
    };
  }, [nodeKey, effects, intense]);

  const low = effects?.lowHealth;
  const showLow = typeof low === "number" && low > 0;

  return (
    <>
      {/* jump-scare flash */}
      {jumpFlash && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-[60] ${
            jumpFlash === "red" ? "bg-blood" : "bg-white"
          }`}
          style={{ opacity: 0.85, animation: "fadeIn 40ms ease" }}
        />
      )}
      {jumpText && (
        <div className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center">
          <p
            className="font-display text-5xl md:text-7xl text-blood drop-shadow-[0_0_25px_rgba(196,78,82,0.9)] anim-shake anim-aberration"
            style={{ letterSpacing: "0.1em" }}
          >
            {jumpText}
          </p>
        </div>
      )}

      {/* flicker — تاریکی پلک‌زن */}
      {flicker && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[55] bg-black/85"
          style={{ animation: "fadeIn 60ms ease" }}
        />
      )}

      {/* heartbeat pulse — حاشیه‌ی تپنده */}
      {effects?.heartbeat && intense && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[50]"
          style={{
            boxShadow:
              "inset 0 0 120px 30px rgba(120, 10, 20, 0.55)",
            animation: "heartPulse 1.05s ease-in-out infinite",
          }}
        />
      )}

      {/* low health — پالس قرمز کم‌خونی */}
      {showLow && intense && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[51]"
          style={{
            boxShadow: `inset 0 0 ${80 + (1 - (low ?? 1)) * 100}px rgba(196, 78, 82, ${0.35 + (1 - (low ?? 1)) * 0.45})`,
            animation: "heartPulse 0.7s ease-in-out infinite",
          }}
        />
      )}
    </>
  );
}
