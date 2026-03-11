import { z } from "zod";

export const PRESET_OPTIONS = [
  "Nubank Ultravioleta",
  "Mercado Pago",
  "Amazon Prime",
  "Outro",
] as const;

export type PresetOption = (typeof PRESET_OPTIONS)[number];

export const addCardSchema = z
  .object({
    preset: z.enum(PRESET_OPTIONS, { message: "Selecione um cartão" }),
    customName: z.string().max(100).optional(),
    closingDay: z.string().min(1, "Selecione o dia de fechamento"),
    dueDay: z.string().min(1, "Selecione o dia de vencimento"),
    creditLimitBRL: z.number().min(0).optional(),
  })
  .refine(
    (d) => d.preset !== "Outro" || (d.customName?.trim().length ?? 0) > 0,
    { message: "Nome do cartão é obrigatório", path: ["customName"] },
  );

export type AddCardFormValues = z.infer<typeof addCardSchema>;

export const addPurchaseSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Máximo 255 caracteres"),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  purchaseDate: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type AddPurchaseFormValues = z.infer<typeof addPurchaseSchema>;

export const addInstallmentSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Máximo 255 caracteres"),
  totalAmountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  installmentCount: z
    .number({ message: "Insira um número de parcelas" })
    .int()
    .min(2, "Mínimo 2 parcelas")
    .max(48, "Máximo 48 parcelas"),
  purchaseDate: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type AddInstallmentFormValues = z.infer<typeof addInstallmentSchema>;

export const addRecurringSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  startMonth: z.string().min(1, "Mês de início é obrigatório"),
  endMonth: z.string().optional(),
  dayOfMonth: z.string().optional(),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type AddRecurringFormValues = z.infer<typeof addRecurringSchema>;

export const editPurchaseSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Máximo 255 caracteres"),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type EditPurchaseFormValues = z.infer<typeof editPurchaseSchema>;

export const editRecurringSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type EditRecurringFormValues = z.infer<typeof editRecurringSchema>;
