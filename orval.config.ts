import { defineConfig } from "orval";

export default defineConfig({
  personalFinanceApi: {
    input: {
      target: "http://localhost:3001/api/docs-json",
    },
    output: {
      target: "./src/generated/api",
      client: "react-query",
      httpClient: "axios",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/lib/api-client.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
