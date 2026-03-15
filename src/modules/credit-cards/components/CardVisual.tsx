"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCardImage, getCardImageScale } from "../utils/card-image";
import type { CreditCard } from "../types/credit-cards.types";

interface CardVisualProps {
  card: CreditCard;
  isSelected?: boolean;
  onClick?: () => void;
  prioritizeImage?: boolean;
}

export function CardVisual({
  card,
  isSelected,
  onClick,
  prioritizeImage = false,
}: CardVisualProps) {
  const image = getCardImage(card.name);
  const imageScale = getCardImageScale(card.name);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={cn(
        "group relative h-44 w-72 flex-none cursor-pointer select-none overflow-hidden rounded-2xl text-left transition-[transform,box-shadow,filter] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isSelected
          ? "-translate-y-0.5 ring-2 ring-primary/80 ring-offset-2 shadow-[0_24px_34px_-22px_rgba(15,23,42,0.8)]"
          : "hover:-translate-y-0.5 hover:brightness-105 hover:ring-1 hover:ring-white/40",
      )}
    >
      <Image
        src={image}
        alt={card.name}
        fill
        className="object-cover"
        style={imageScale !== 1 ? { transform: `scale(${imageScale})` } : undefined}
        sizes="288px"
        priority={prioritizeImage}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/70" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm font-semibold tracking-wide drop-shadow-sm">{card.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/75">
          <span>Fecha dia {card.creditCard?.closingDay ?? "-"}</span>
          <span>·</span>
          <span>Vence dia {card.creditCard?.dueDay ?? "-"}</span>
        </div>
      </div>
    </button>
  );
}
