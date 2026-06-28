"use client";

import { cn } from "@/lib/utils";

function DiamondOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M100 8 L188 72 L100 232 L12 72 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 72 H188 M52 72 L100 8 L148 72 M72 72 L100 232 L128 72"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M100 72 L100 232"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
      />
    </svg>
  );
}

function RingOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse
        cx="100"
        cy="130"
        rx="68"
        ry="22"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M68 118 C68 60 132 60 132 118"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M88 52 L100 28 L112 52 L100 64 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M94 52 L100 36 L106 52"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.5"
      />
    </svg>
  );
}

function NecklaceOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M20 20 Q120 110 220 20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="88" r="10" stroke="currentColor" strokeWidth="1" />
      <path
        d="M114 82 L120 74 L126 82 L120 90 Z"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.6"
      />
    </svg>
  );
}

export function BackgroundWatermark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden select-none",
        className
      )}
      aria-hidden
    >
      {/* Center — large diamond */}
      <DiamondOutline
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%]",
          "w-[min(520px,70vw)] h-auto",
          "text-gold/[0.04] dark:text-gold/[0.06]"
        )}
      />

      {/* Top right — ring */}
      <RingOutline
        className={cn(
          "absolute -right-8 top-24",
          "w-48 h-48 lg:w-64 lg:h-64",
          "text-gold/[0.035] dark:text-gold/[0.05]",
          "rotate-12"
        )}
      />

      {/* Bottom left — necklace arc */}
      <NecklaceOutline
        className={cn(
          "absolute -left-4 bottom-16",
          "w-56 lg:w-72 h-auto",
          "text-gold/[0.03] dark:text-gold/[0.045]",
          "-rotate-6"
        )}
      />

      {/* Bottom right — small diamond accent */}
      <DiamondOutline
        className={cn(
          "absolute right-[8%] bottom-[12%]",
          "w-28 h-auto lg:w-36",
          "text-gold/[0.025] dark:text-gold/[0.04]",
          "rotate-[18deg]"
        )}
      />

      {/* Soft radial glow behind center piece */}
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[600px] h-[600px] rounded-full",
          "bg-gold/[0.015] dark:bg-gold/[0.025]",
          "blur-3xl"
        )}
      />
    </div>
  );
}
