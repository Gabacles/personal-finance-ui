"use client";

import { useEffect, useState } from "react";
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

  const hasMultiple = cards.length > 1;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full px-10">
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: hasMultiple }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {cards.map((card) => (
              <CarouselItem key={card.id} className="pl-4 basis-auto">
                <CardVisual
                  card={card}
                  isSelected={card.id === selectedCardId}
                  onClick={() => onCardSelect(card.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMultiple && (
            <>
              <CarouselPrevious className="-left-10" />
              <CarouselNext className="-right-10" />
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
