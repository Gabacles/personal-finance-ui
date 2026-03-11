"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check, PenLine, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CARD_PRESETS,
  unknownCardImage,
} from "../../utils/card-image";
import {
  addCardSchema,
  type AddCardFormValues,
} from "../../schemas/credit-cards.schemas";
import { useCreateCreditCard, useUpdateCreditCard } from "../../hooks/use-credit-cards";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CreditCard } from "../../types/credit-cards.types";

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1));

function derivePreset(name: string): AddCardFormValues["preset"] {
  const match = CARD_PRESETS.find((p) => p.value === name);
  return match ? match.value : "Outro";
}

interface CardSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCard?: CreditCard;
}

export function CardSheet({ open, onOpenChange, editCard }: CardSheetProps) {
  const isEdit = !!editCard;
  const isMobile = useIsMobile();
  const createCard = useCreateCreditCard();
  const updateCard = useUpdateCreditCard();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddCardFormValues>({
    resolver: standardSchemaResolver(addCardSchema),
    defaultValues: {
      preset: "Nubank Ultravioleta",
      closingDay: "",
      dueDay: "",
      creditLimitBRL: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (editCard) {
        reset({
          preset: derivePreset(editCard.name),
          customName:
            derivePreset(editCard.name) === "Outro" ? editCard.name : "",
          closingDay: String(editCard.creditCard?.closingDay ?? ""),
          dueDay: String(editCard.creditCard?.dueDay ?? ""),
          creditLimitBRL:
            editCard.creditCard?.creditLimitCents != null
              ? String(editCard.creditCard.creditLimitCents / 100)
              : "",
        });
      } else {
        reset({
          preset: "Nubank Ultravioleta",
          customName: "",
          closingDay: "",
          dueDay: "",
          creditLimitBRL: "",
        });
      }
    }
  }, [open, editCard, reset]);

  const selectedPreset = watch("preset");
  const isPending = createCard.isPending || updateCard.isPending;

  async function onSubmit(data: AddCardFormValues) {
    const name =
      data.preset === "Outro" ? (data.customName ?? "").trim() : data.preset;
    const closingDay = parseInt(data.closingDay);
    const dueDay = parseInt(data.dueDay);
    const creditLimitCents = data.creditLimitBRL
      ? Math.round(parseFloat(data.creditLimitBRL) * 100)
      : undefined;

    if (isEdit && editCard) {
      await updateCard.mutateAsync({
        id: editCard.id,
        data: {
          name,
          creditCard: { closingDay, dueDay, creditLimitCents },
        },
      });
    } else {
      await createCard.mutateAsync({
        data: {
          name,
          type: "CREDIT_CARD",
          creditCard: { closingDay, dueDay, creditLimitCents },
        },
      });
    }
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto p-4",
          isMobile ? "max-h-[92dvh] rounded-t-xl" : "w-full sm:max-w-md",
        )}
      >
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar cartão" : "Adicionar cartão"}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-6 px-1"
          noValidate
        >
          {/* Card picker */}
          <div className="space-y-2">
            <Label>Cartão</Label>
            <Controller
              name="preset"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {CARD_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      aria-label={preset.label}
                      aria-pressed={field.value === preset.value}
                      onClick={() => field.onChange(preset.value)}
                      className={cn(
                        "relative h-24 cursor-pointer overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        field.value === preset.value
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/30",
                      )}
                    >
                      <Image
                        src={preset.image}
                        alt={preset.label}
                        fill
                        className="object-cover"
                        style={preset.imageScale !== 1 ? { transform: `scale(${preset.imageScale})` } : undefined}
                        sizes="160px"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-2 left-2 text-xs font-semibold text-white drop-shadow">
                        {preset.label}
                      </span>
                      {field.value === preset.value && (
                        <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
                          <Check className="size-3 text-white" />
                        </span>
                      )}
                    </button>
                  ))}

                  {/* "Outro" option */}
                  <button
                    type="button"
                    aria-label="Outro cartão"
                    aria-pressed={field.value === "Outro"}
                    onClick={() => field.onChange("Outro")}
                    className={cn(
                      "relative h-24 cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      field.value === "Outro"
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/30 hover:border-muted-foreground/50",
                    )}
                  >
                    <Image
                      src={unknownCardImage}
                      alt="Outro cartão"
                      fill
                      className="object-cover opacity-20"
                      sizes="160px"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <PenLine className="size-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">
                        Outro
                      </span>
                    </div>
                    {field.value === "Outro" && (
                      <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3 text-white" />
                      </span>
                    )}
                  </button>
                </div>
              )}
            />
            {errors.preset && (
              <p className="text-xs text-destructive">{errors.preset.message}</p>
            )}
          </div>

          {/* Custom name — shown only for "Outro" */}
          {selectedPreset === "Outro" && (
            <div className="space-y-1.5">
              <Label htmlFor="customName">Nome do cartão</Label>
              <Input
                id="customName"
                placeholder="Ex: Bradesco Visa Infinite"
                aria-invalid={!!errors.customName}
                {...register("customName")}
              />
              {errors.customName && (
                <p className="text-xs text-destructive">
                  {errors.customName.message}
                </p>
              )}
            </div>
          )}

          {/* Closing Day / Due Day */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Dia de fechamento</Label>
              <Controller
                name="closingDay"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!errors.closingDay}>
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.closingDay && (
                <p className="text-xs text-destructive">
                  {errors.closingDay.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Dia de vencimento</Label>
              <Controller
                name="dueDay"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!errors.dueDay}>
                      <SelectValue placeholder="Dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAY_OPTIONS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.dueDay && (
                <p className="text-xs text-destructive">
                  {errors.dueDay.message}
                </p>
              )}
            </div>
          </div>

          {/* Credit limit */}
          <div className="space-y-1.5">
            <Label htmlFor="creditLimitBRL">
              Limite de crédito{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                R$
              </span>
              <Input
                id="creditLimitBRL"
                type="number"
                step="0.01"
                min="0"
                className="pl-8"
                placeholder="0,00"
                {...register("creditLimitBRL")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEdit ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
