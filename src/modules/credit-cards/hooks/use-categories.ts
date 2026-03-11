import { useCategoriesControllerFindAll } from "@/generated/api/categories/categories";

type Category = { id: string; name: string };
interface CategoryListResponse {
  data: Category[];
}

export function useExpenseCategories() {
  return useCategoriesControllerFindAll<Category[]>(
    { type: "EXPENSE" },
    { query: { select: (raw) => (raw as unknown as CategoryListResponse).data } },
  );
}
