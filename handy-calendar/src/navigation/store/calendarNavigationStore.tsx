import { addMonths, addWeeks, subMonths, subWeeks } from "date-fns";
import { create } from "zustand";
import { WEEKLY_ROUTE } from "../constants";

interface CalendarNavigationState {
  currentDate: Date;
  prevPeriod: (currentPeriodRoute: string) => void;
  nextPeriod: (currentPeriodRoute: string) => void;
}

export const useCalendarNavigationStore = create<CalendarNavigationState>(
  (set) => ({
    currentDate: new Date(),
    prevPeriod: (currentPeriodRoute) =>
      set((state) => ({
        currentDate: setCurrentDateToPrevPeriod(state, currentPeriodRoute),
      })),
    nextPeriod: (currentPeriodRoute) =>
      set((state) => ({
        currentDate: setCurrentDateToNextPeriod(state, currentPeriodRoute),
      })),
  })
);

function setCurrentDateToPrevPeriod(
  state: CalendarNavigationState,
  currentPeriodRoute: string
) {
  switch (currentPeriodRoute) {
    case WEEKLY_ROUTE:
      return subWeeks(state.currentDate, 1);
    default:
      return subMonths(state.currentDate, 1);
  }
}

function setCurrentDateToNextPeriod(
  state: CalendarNavigationState,
  currentPeriodRoute: string
) {
  switch (currentPeriodRoute) {
    case WEEKLY_ROUTE:
      return addWeeks(state.currentDate, 1);
    default:
      return addMonths(state.currentDate, 1);
  }
}
