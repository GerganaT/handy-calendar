import {
  addDays,
  addMonths,
  addWeeks,
  isSameMonth,
  startOfMonth,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { create } from "zustand";
import { DAILY_ROUTE, WEEKLY_ROUTE } from "../constants";

interface CalendarNavigationState {
  currentDate: Date;
  initializeCurrentDate: () => void;
  prevPeriod: (currentPeriodRoute: string) => void;
  nextPeriod: (currentPeriodRoute: string) => void;
  resetToToday: () => void;
}

export const useCalendarNavigationStore = create<CalendarNavigationState>(
  (set) => ({
    currentDate: new Date(),
    initializeCurrentDate: () =>
      set((state) => ({
        currentDate: isSameMonth(state.currentDate, new Date())
          ? state.currentDate
          : startOfMonth(state.currentDate),
      })),
    prevPeriod: (currentPeriodRoute) =>
      set((state) => ({
        currentDate: setCurrentDateToPrevPeriod(
          state.currentDate,
          currentPeriodRoute
        ),
      })),
    nextPeriod: (currentPeriodRoute) =>
      set((state) => ({
        currentDate: setCurrentDateToNextPeriod(
          state.currentDate,
          currentPeriodRoute
        ),
      })),
    resetToToday: () => set({ currentDate: new Date() }),
  })
);

function setCurrentDateToPrevPeriod(
  currentDate: Date,
  currentPeriodRoute: string
) {
  switch (currentPeriodRoute) {
    case DAILY_ROUTE:
      return subDays(currentDate, 1);
    case WEEKLY_ROUTE:
      return subWeeks(currentDate, 1);
    default:
      return subMonths(currentDate, 1);
  }
}

function setCurrentDateToNextPeriod(
  currentDate: Date,
  currentPeriodRoute: string
) {
  switch (currentPeriodRoute) {
    case DAILY_ROUTE:
      return addDays(currentDate, 1);
    case WEEKLY_ROUTE:
      return addWeeks(currentDate, 1);
    default:
      return addMonths(currentDate, 1);
  }
}
