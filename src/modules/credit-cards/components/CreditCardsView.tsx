"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreditCards, useCardStatement } from "../hooks/use-credit-cards";
import { CreditCardsHeader } from "./CreditCardsHeader";
import { CardCarousel } from "./CardCarousel";
import { EmptyCardState } from "./EmptyCardState";
import { CardMetrics } from "./CardMetrics";
import { TransactionTable } from "./TransactionTable";
import { CardSheet } from "./modals/CardSheet";
import { AddTransactionSheet } from "./modals/AddTransactionSheet";
import { DeleteCardDialog } from "./modals/DeleteCardDialog";
import type { CreditCard } from "../types/credit-cards.types";

function currentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function CreditCardsView() {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isCardSheetOpen, setIsCardSheetOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>(undefined);
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: cards, isLoading: cardsLoading, isError: cardsError, refetch } = useCreditCards();

  // Auto-select first card when list loads
  useEffect(() => {
    if (cards && cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);

  // When selected card is deleted, move to next available card
  function handleCardDeleted() {
    setSelectedCardId(null);
    // The list will refetch and the useEffect above will pick the first card
  }

  const selectedCard = cards?.find((c) => c.id === selectedCardId) ?? null;

  const {
    data: statement,
    isLoading: statementLoading,
    isError: statementError,
    refetch: refetchStatement,
  } = useCardStatement(selectedCardId, selectedMonth);

  function handleEditCard() {
    setEditingCard(selectedCard ?? undefined);
    setIsCardSheetOpen(true);
  }

  function handleAddCard() {
    setEditingCard(undefined);
    setIsCardSheetOpen(true);
  }

  if (cardsLoading) {
    return (
      <div className="space-y-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-44 w-72 flex-none rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (cardsError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar seus cartões.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const hasCards = cards && cards.length > 0;

  return (
    <div className="space-y-8">
      <CreditCardsHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onAddCard={handleAddCard}
        selectedCard={selectedCard}
        onEditCard={handleEditCard}
        onDeleteCard={() => setIsDeleteDialogOpen(true)}
      />

      {/* Carousel or empty state */}
      {hasCards ? (
        <CardCarousel
          cards={cards}
          selectedCardId={selectedCardId}
          onCardSelect={setSelectedCardId}
        />
      ) : (
        <EmptyCardState onAddCard={handleAddCard} />
      )}

      {/* Per-card content — only shown when a card is selected */}
      {selectedCard && (
        <>
          {/* Metrics */}
          <CardMetrics
            card={selectedCard}
            statement={statement}
            isLoading={statementLoading}
            selectedMonth={selectedMonth}
          />

          {/* Statement error */}
          {statementError && (
            <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                Não foi possível carregar o extrato.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchStatement()}
              >
                <RefreshCw className="mr-1.5 size-4" />
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Transaction table */}
          <TransactionTable
            entries={statement?.entries}
            isLoading={statementLoading}
            onAddTransaction={() => setIsTransactionSheetOpen(true)}
          />
        </>
      )}

      {/* Modals */}
      <CardSheet
        open={isCardSheetOpen}
        onOpenChange={setIsCardSheetOpen}
        editCard={editingCard}
      />

      {selectedCardId && (
        <AddTransactionSheet
          open={isTransactionSheetOpen}
          onOpenChange={setIsTransactionSheetOpen}
          cardId={selectedCardId}
          selectedMonth={selectedMonth}
        />
      )}

      <DeleteCardDialog
        card={selectedCard}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleted={handleCardDeleted}
      />
    </div>
  );
}
