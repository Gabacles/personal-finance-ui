"use client";

import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unknownCardImage } from "../utils/card-image";

interface EmptyCardStateProps {
  onAddCard: () => void;
}

export function EmptyCardState({ onAddCard }: EmptyCardStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed bg-muted/30 py-16">
      <div className="relative h-32 w-52 overflow-hidden rounded-xl opacity-30">
        <Image
          src={unknownCardImage}
          alt="Nenhum cartão"
          fill
          className="object-cover"
          sizes="208px"
        />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          Nenhum cartão cadastrado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione seu primeiro cartão de crédito para começar a rastrear seus
          gastos.
        </p>
      </div>
      <Button onClick={onAddCard} size="default">
        <PlusCircle className="mr-2 size-4" />
        Adicionar meu primeiro cartão
      </Button>
    </div>
  );
}
