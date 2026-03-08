import { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider";

export const RootProvider = ({ children }: PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>;
};
