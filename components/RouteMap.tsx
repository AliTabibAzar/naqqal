"use client";

import { useMemo } from "react";
import type { Story } from "@/lib/types";

export default function RouteMap({
  story,
  history,
  current,
}: {
  story: Story;
  history: string[];
  current: string;
}) {
  const { nodes, links, layout } = useMemo(() => {
    const visited = new Set([...history, current]);
    const all = Object.keys(story.nodes);
    const nodes: { id: string; label: string; visited: boolean; current: boolean; ending: boolean; death: boolean }[] =
      [];
    const links: { from: string; to: string; taken: boolean }[] = [];

    for (const id of all) {
      const n = story.nodes[id];
      nodes.push({
        id,
        label: n.chapter || n.titleCard || (n.ending?.title ?? id),
        visited: visited.has(id),
        current: id === current,
        ending: Boolean(n.ending),
        death: Boolean(n.death),
      });
      for (const c of n.choices) {
        if (story.nodes[c.next]) {
          links.push({
            from: id,
            to: c.next,
            taken: visited.has(id) && visited.has(c.next),
          });
        }
      }
    }

    // simple layered layout by BFS depth from start
    const depth: Record<string, number> = { [story.startNode]: 0 };
    const queue = [story.startNode];
    while (queue.length) {
      const id = queue.shift()!;
      for (const c of story.nodes[id]?.choices ?? []) {
        if (story.nodes[c.next] && depth[c.next] === undefined) {
          depth[c.next] = depth[id] + 1;
          queue.push(c.next);
        }
      }
    }
    // group by depth
    const byDepth: Record<number, string[]> = {};
    for (const n of nodes) {
      const d = depth[n.id] ?? 0;
      (byDepth[d] ||= []).push(n.id);
    }
    const layout: Record<string, { x: number; y: number }> = {};
    const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b);
    const maxLen = Math.max(...depths.map((d) => byDepth[d].length), 1);
    depths.forEach((d, di) => {
      const row = byDepth[d];
      row.forEach((id, i) => {
        layout[id] = {
          x: ((i + 1) / (row.length + 1)) * 100,
          y: 8 + (di / Math.max(depths.length - 1, 1)) * 84,
        };
      });
    });
    void maxLen;

    return { nodes, links, layout };
  }, [story, history, current]);

  const W = 800;
  const H = Math.max(300, nodes.length * 45);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px]" role="img" aria-label="نقشه‌ی مسیر داستان">
        {links.map((l, i) => {
          const a = layout[l.from];
          const b = layout[l.to];
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={(a.x / 100) * W}
              y1={(a.y / 100) * H}
              x2={(b.x / 100) * W}
              y2={(b.y / 100) * H}
              stroke={l.taken ? "#d4a853" : "rgba(212,168,83,0.15)"}
              strokeWidth={l.taken ? 2 : 1}
            />
          );
        })}
        {nodes.map((n) => {
          const p = layout[n.id];
          if (!p) return null;
          const x = (p.x / 100) * W;
          const y = (p.y / 100) * H;
          const fill = n.current
            ? "#d4a853"
            : n.death
              ? "#c44e52"
              : n.ending
                ? n.visited
                  ? "#7b5ea7"
                  : "rgba(123,94,167,0.3)"
                : n.visited
                  ? "#1a2338"
                  : "rgba(20,27,45,0.4)";
          const stroke = n.visited ? "#d4a853" : "rgba(212,168,83,0.25)";
          return (
            <g key={n.id}>
              <circle cx={x} cy={y} r={n.current ? 11 : 8} fill={fill} stroke={stroke} strokeWidth={1.5} />
              <text
                x={x}
                y={y + 22}
                textAnchor="middle"
                fontSize="9"
                fill={n.visited ? "#e8e0d4" : "rgba(232,224,212,0.4)"}
              >
                {n.visited ? n.label.slice(0, 14) : "؟"}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3 text-center text-xs text-bone-dim/60">
        دایره‌های طلایی = مسیر طی‌شده · بنفش = پایان · قرمز = مرگ · خاکستری = شاخه‌ی کشف‌نشده
      </p>
    </div>
  );
}
