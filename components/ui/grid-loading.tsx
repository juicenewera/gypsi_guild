"use client"

import { cn } from "@/lib/utils"

interface UniqueLoadingProps {
  variant?: "squares" | "g"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

// Letter G mapped onto a 3×3 grid.
//   row 0 → cells 0 1 2   ■ ■ ■
//   row 1 → cells 3 4 5   ■ · ■   (4 = hole / dark, 5 = hook)
//   row 2 → cells 6 7 8   ■ ■ ■
// Handwriting stroke: start top-right, curve counter-clockwise, end with the hook.
const G_STROKE = [2, 1, 0, 3, 6, 7, 8, 5] as const
const G_SET = new Set<number>(G_STROKE as readonly number[])

export default function UniqueLoading({
  variant = "g",
  size = "md",
  text = "Loading...",
  className,
}: UniqueLoadingProps) {
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  // Legacy uniform pulse, kept for backwards compat.
  if (variant === "squares") {
    return (
      <div className={cn("relative", containerSizes[size], className)} role="status" aria-label={text}>
        <div className="grid grid-cols-3 gap-1 w-full h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-black dark:bg-gray-200 animate-pulse rounded-[2px]"
              style={{ animationDelay: `${i * 0.1}s`, animationDuration: "1.5s" }}
            />
          ))}
        </div>
        <span className="sr-only">{text}</span>
      </div>
    )
  }

  // G variant — cells glow in stroke order, center stays dark (the letter's hole).
  const CYCLE = 1.8 // segundos por laço completo
  const STEP = CYCLE / G_STROKE.length

  return (
    <div className={cn("relative", containerSizes[size], className)} role="status" aria-label={text}>
      <div className="grid grid-cols-3 gap-1 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => {
          const order = G_STROKE.indexOf(i as (typeof G_STROKE)[number])
          const isG = G_SET.has(i)
          return (
            <div
              key={i}
              className={cn(
                "rounded-[2px]",
                isG
                  ? "gu-g-cell bg-black text-black dark:bg-gray-100 dark:text-gray-100"
                  : "bg-black/10 dark:bg-gray-700/40",
              )}
              style={
                isG
                  ? {
                      animationDelay: `${order * STEP}s`,
                      animationDuration: `${CYCLE}s`,
                    }
                  : undefined
              }
            />
          )
        })}
      </div>

      <style>{`
        @keyframes guGGlow {
          0%, 100% { opacity: 0.14; transform: scale(0.88); filter: drop-shadow(0 0 0 currentColor); }
          45%, 55% { opacity: 1;    transform: scale(1);    filter: drop-shadow(0 0 6px currentColor); }
        }
        .gu-g-cell {
          animation-name: guGGlow;
          animation-timing-function: cubic-bezier(.4, 0, .6, 1);
          animation-iteration-count: infinite;
          will-change: opacity, transform, filter;
        }
        @media (prefers-reduced-motion: reduce) {
          .gu-g-cell { animation: none; opacity: 0.9; }
        }
      `}</style>

      <span className="sr-only">{text}</span>
    </div>
  )
}
