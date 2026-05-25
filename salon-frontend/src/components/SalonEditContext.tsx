import { createContext, useContext, type ReactNode } from "react";
import type { SalonDetail } from "../types";

interface SalonEditContextValue {
  salon: SalonDetail | null;
  isEditing: boolean;
  editedSalon: SalonDetail | null;
  handleInputChange: (
    field: keyof SalonDetail,
    value: string | number | null,
  ) => void;
  handleServicesChange: (service: string, checked: boolean) => void;
}

export const SalonEditContext = createContext<SalonEditContextValue | null>(
  null,
);

interface SalonEditProviderProps {
  value: SalonEditContextValue;
  children: ReactNode;
}

export function SalonEditProvider({ value, children }: SalonEditProviderProps) {
  return <SalonEditContext value={value}>{children}</SalonEditContext>;
}

export function useSalonEditContext(): SalonEditContextValue {
  const ctx = useContext(SalonEditContext);
  if (!ctx)
    return {
      isEditing: false,
      salon: null,
      editedSalon: null,
      handleInputChange: () => {},
      handleServicesChange: () => {},
    };
  return ctx;
}
