import {
  addMonths,
  addWeeks,
  isSameMonth,
  startOfMonth,
  subMonths,
  subWeeks,
} from "date-fns";
import { create } from "zustand";
import { WEEKLY_ROUTE } from "../constants";

interface CalendarNavigationState {
  currentDate: Date;
  initializeWeeklyDate: () => void;
  prevPeriod: (currentPeriodRoute: string) => void;
  nextPeriod: (currentPeriodRoute: string) => void;
}

export const useCalendarNavigationStore = create<CalendarNavigationState>(
  (set) => ({
    currentDate: new Date(),
    initializeWeeklyDate: () =>
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
  })
);

function setCurrentDateToPrevPeriod(
  currentDate: Date,
  currentPeriodRoute: string
) {
  switch (currentPeriodRoute) {
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
    case WEEKLY_ROUTE:
      return addWeeks(currentDate, 1);
    default:
      return addMonths(currentDate, 1);
  }
}
