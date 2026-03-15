import { z } from "zod";

export const addExpenseSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória").max(255),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Insira um valor positivo"),
  transactionDate: z.string().min(1, "Selecione uma data"),
  categoryId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  notes: z.string().optional(),
});

export type AddExpenseFormValues = z.infer<typeof addExpenseSchema>;

export const addPaymentMethodSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(100),
  type: z.enum(["DEBIT_CARD", "PIX", "CASH", "OTHER"] as const, {
    message: "Selecione um tipo",
  }),
});

export type AddPaymentMethodFormValues = z.infer<typeof addPaymentMethodSchema>;

export const editTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória").max(255),
  amountBRL: z
    .number({ message: "Insira um valor válido" })
    .positive("Insira um valor positivo"),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
});

export type EditTransactionFormValues = z.infer<typeof editTransactionSchema>;
