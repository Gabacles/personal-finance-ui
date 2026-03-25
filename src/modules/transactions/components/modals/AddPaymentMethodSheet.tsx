"use client";

import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  addPaymentMethodSchema,
  type AddPaymentMethodFormValues,
} from "../../schemas/transactions.schemas";
import { useCreatePaymentMethod } from "../../hooks/use-transactions";
import { PM_TYPE_OPTIONS } from "../../types/transactions.types";

interface AddPaymentMethodSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodSheet({ open, onOpenChange }: AddPaymentMethodSheetProps) {
  const isMobile = useIsMobile();
  const createPaymentMethod = useCreatePaymentMethod();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPaymentMethodFormValues>({
    resolver: standardSchemaResolver(addPaymentMethodSchema),
    defaultValues: { name: "", type: undefined },
  });

  const onClose = useCallback(() => {
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const onSubmit = useCallback(
    (values: AddPaymentMethodFormValues) => {
      createPaymentMethod.mutate(
        {
          data: {
            name: values.name,
            type: values.type,
          },
        },
        {
          onSuccess: () => {
            toast.success("Método de pagamento cadastrado.");
            onClose();
          },
          onError: () => toast.error("Não foi possível cadastrar o método de pagamento."),
        },
      );
    },
    [createPaymentMethod, onClose],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "overflow-y-auto p-4",
          isMobile && "max-h-[92dvh] rounded-t-2xl",
        )}
      >
        <SheetHeader className="mb-6">
          <SheetTitle>Novo método de pagamento</SheetTitle>
        </SheetHeader>

        {/* Credit card redirect notice */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40">
          <CreditCard className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-200">
              Cartão de crédito?
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Cartões de crédito possuem fluxo dedicado com controle de fatura e parcelamentos.
            </p>
            <Link
              href="/credit-cards"
              className="inline-flex items-center gap-1 font-semibold text-blue-800 underline-offset-2 hover:underline dark:text-blue-200"
              onClick={onClose}
            >
              Ir para Cartões de Crédito
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Type */}
          <div className="space-y-1.5">
            <Label htmlFor="pm-type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger id="pm-type" className="w-full">
                    <SelectValue placeholder="Selecione o tipo…" />
                  </SelectTrigger>
                  <SelectContent>
                    {PM_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="pm-name">Nome</Label>
            <Input
              id="pm-name"
              placeholder="Ex.: Nubank Débito, Caixa PIX…"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
            </SheetClose>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || createPaymentMethod.isPending}
            >
              {createPaymentMethod.isPending && (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              )}
              Cadastrar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
