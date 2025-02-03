import { addMonths, subMonths } from "date-fns";
import { create } from "zustand";

interface MonthNavigationState {
  currentDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
}

export const useMonthNavigationStore = create<MonthNavigationState>((set) => ({
  currentDate: new Date(),
  prevMonth: () =>
    set((state) => ({ currentDate: subMonths(state.currentDate, 1) })),
  nextMonth: () =>
    set((state) => ({ currentDate: addMonths(state.currentDate, 1) })),
}));
