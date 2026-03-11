"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCardImage, getCardImageScale } from "../utils/card-image";
import type { CreditCard } from "../types/credit-cards.types";

interface CardVisualProps {
  card: CreditCard;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CardVisual({ card, isSelected, onClick }: CardVisualProps) {
  const image = getCardImage(card.name);
  const imageScale = getCardImageScale(card.name);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-pressed={isSelected}
      className={cn(
        "relative h-44 w-72 flex-none cursor-pointer select-none overflow-hidden rounded-2xl transition-[transform,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected
          ? "ring-2 ring-primary ring-offset-2"
          : "hover:ring-1 hover:ring-white/30",
      )}
    >
      <Image
        src={image}
        alt={card.name}
        fill
        className="object-cover"
        style={imageScale !== 1 ? { transform: `scale(${imageScale})` } : undefined}
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
