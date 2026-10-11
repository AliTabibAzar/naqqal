"use client";

import { useEffect, useState } from "react";
import {
  getBusVolume,
  setBusVolume,
  resetVolumes,
  DEFAULT_VOLUMES,
  type BusName,
} from "@/lib/audio";
import { playClick } from "@/lib/audio";

interface SliderDef {
  bus: BusName;
  label: string;
  icon: string;
}

const SLIDERS: SliderDef[] = [
  { bus: "master", label: "کلی", icon: "🔊" },
  { bus: "music", label: "موسیقی", icon: "🎵" },
  { bus: "sfx", label: "جلوه‌ها", icon: "✨" },
  { bus: "ambient", label: "محیط", icon: "🌫️" },
];

export default function SoundPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [vols, setVols] = useState<Record<BusName, number>>({
    ...DEFAULT_VOLUMES,
  });

  useEffect(() => {
    if (open) {
      setVols({
        master: getBusVolume("master"),
        music: getBusVolume("music"),
        sfx: getBusVolume("sfx"),
        ambient: getBusVolume("ambient"),
      });
    }
  }, [open]);

  if (!open) return null;

  const setVol = (bus: BusName, v: number) => {
    setBusVolume(bus, v);
    setVols((prev) => ({ ...prev, [bus]: v }));
  };

  const handleReset = () => {
    playClick();
    resetVolumes();
    setVols({ ...DEFAULT_VOLUMES });
  };

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-void/60"
        onClick={onClose}
        aria-hidden
      />
      {/* panel */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-panel p-6 shadow-2xl anim-fade-up">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl text-gold">تنظیمات صدا</h3>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="rounded-full border border-line px-3 py-1 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>

        <div className="space-y-5">
          {SLIDERS.map((s) => (
            <div key={s.bus}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-bone">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </span>
                <span className="tabular-nums text-bone-dim">
                  {Math.round(vols[s.bus] * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(vols[s.bus] * 100)}
                onChange={(e) =>
                  setVol(s.bus, Number(e.target.value) / 100)
                }
                className="w-full accent-gold cursor-pointer"
                aria-label={`ولوم ${s.label}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="mt-6 w-full rounded-xl border border-line px-4 py-2.5 text-sm text-bone-dim hover:border-line-strong hover:text-gold transition-colors cursor-pointer"
        >
          بازگردانی پیش‌فرض
        </button>

        <p className="mt-3 text-center text-[11px] text-bone-dim/50">
          تنظیمات به‌صورت خودکار ذخیره می‌شه
        </p>
      </div>
    </>
  );
}
