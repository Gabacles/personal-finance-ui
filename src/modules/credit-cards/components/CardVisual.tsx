"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCardImage } from "../utils/card-image";
import type { CreditCard } from "../types/credit-cards.types";

interface CardVisualProps {
  card: CreditCard;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardVisual({ card, isSelected, onClick }: CardVisualProps) {
  const image = getCardImage(card.name);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-pressed={isSelected}
      className={cn(
        "relative h-44 w-72 flex-none cursor-pointer select-none overflow-hidden rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected
          ? "scale-105 ring-2 ring-primary ring-offset-2"
          : "opacity-75 hover:opacity-95 hover:scale-[1.02]",
      )}
    >
      <Image
        src={image}
        alt={card.name}
        fill
        className="object-cover"
        sizes="288px"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/5 to-black/60" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm font-semibold drop-shadow-sm">{card.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/75">
          <span>Fecha dia {card.creditCard?.closingDay ?? "—"}</span>
          <span>·</span>
          <span>Vence dia {card.creditCard?.dueDay ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
