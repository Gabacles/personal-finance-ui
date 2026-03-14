import { z } from "zod";

export const addIncomeEntrySchema = z.object({
  referenceMonth: z.string().min(1, "Mês de referência é obrigatório"),
  grossAmountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Máximo 255 caracteres"),
  categoryId: z.string().optional(),
  applyTaxDeductions: z.boolean(),
  dependents: z.number().int().min(0, "Mínimo 0").max(20, "Máximo 20").optional(),
  notes: z.string().optional(),
});

export type AddIncomeEntryFormValues = z.infer<typeof addIncomeEntrySchema>;

export const addRecurringIncomeSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Máximo 255 caracteres"),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Valor deve ser maior que zero"),
  startMonth: z.string().min(1, "Mês de início é obrigatório"),
  endMonth: z.string().optional(),
  dayOfMonth: z.number().int().min(1, "Mínimo 1").max(31, "Máximo 31").optional(),
  categoryId: z.string().optional(),
  applyTaxDeductions: z.boolean(),
  dependents: z.number().int().min(0, "Mínimo 0").max(20, "Máximo 20").optional(),
  notes: z.string().optional(),
});

export type AddRecurringIncomeFormValues = z.infer<typeof addRecurringIncomeSchema>;
