"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardVisual } from "./CardVisual";
import type { CreditCard } from "../types/credit-cards.types";

interface CardCarouselProps {
  cards: CreditCard[];
  selectedCardId: string | null;
  onCardSelect: (id: string) => void;
}

export function CardCarousel({
  cards,
  selectedCardId,
  onCardSelect,
}: CardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pb-2">
          {cards.map((card) => (
            <CardVisual
              key={card.id}
              card={card}
              isSelected={card.id === selectedCardId}
              onClick={() => onCardSelect(card.id)}
            />
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <Button
          variant="outline"
          size="icon-sm"
          className="absolute left-0 top-1/2 -translate-x-3 -translate-y-1/2 rounded-full shadow-md"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          variant="outline"
          size="icon-sm"
          className="absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 rounded-full shadow-md"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Próximo"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
