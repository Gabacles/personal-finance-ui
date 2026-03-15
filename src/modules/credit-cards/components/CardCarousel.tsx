"use client";

import { useEffect, useMemo, useState } from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CardVisual } from "./CardVisual";
import type { CreditCard } from "../types/credit-cards.types";

type EmblaApi = UseEmblaCarouselType[1];

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
  const [api, setApi] = useState<EmblaApi>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCardIndex = useMemo(
    () => cards.findIndex((card) => card.id === selectedCardId),
    [cards, selectedCardId],
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || selectedCardIndex < 0) {
      return;
    }
    if (api.selectedScrollSnap() !== selectedCardIndex) {
      api.scrollTo(selectedCardIndex);
    }
  }, [api, selectedCardIndex]);

  const hasMultiple = cards.length > 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full px-10">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: hasMultiple }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {cards.map((card, index) => (
              <CarouselItem key={card.id} className="pl-4 basis-auto">
                <CardVisual
                  card={card}
                  isSelected={card.id === selectedCardId}
                  onClick={() => onCardSelect(card.id)}
                  prioritizeImage={card.id === selectedCardId || (!selectedCardId && index === 0)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMultiple && (
            <>
              <CarouselPrevious className="-left-8 border-border/70 bg-background/95 shadow-sm" />
              <CarouselNext className="-right-8 border-border/70 bg-background/95 shadow-sm" />
            </>
          )}
        </Carousel>
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Selecionar cartão">
          {cards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Cartão ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
