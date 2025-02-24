import ErrorAlert from "@/components/ui/ErrorAlert";
import EventDetailsDialog from "@/components/ui/event/EventDetailsDialog";
import EventHolder from "@/components/ui/event/EventHolder";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useGetEvents } from "@/services/calendar/event/eventService";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState from "@/types/calendar/event/EventUiState";
import { isToday, isWithinInterval, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import {
  FIRST_DAY_OF_THE_MONTH,
  getDateFromCalendarEntry,
  getMonthDates,
  WEEK_DAYS,
  WEEK_DAYS_COUNT,
} from "../utils/calendarUtils";
import { useTriggerLoadingSkeleton } from "../utils/helperHooks";

const CALENDAR_GRID_LENGTH = 42;

const MonthCalendarPage = () => {
  const { currentDate } = useCalendarNavigationStore();

  const [selectedEvent, setSelectedEvent] = useState<EventUiState>();

  const { shouldShowLoadingSkeleton, showLoadingSkeleton } =
    useTriggerLoadingSkeleton();

  const { data: events, error } = useGetEvents();

  const totalDaysWithEvents = useMemo(() => {
    showLoadingSkeleton();
    let daysWithEvents = getMonthDates(currentDate);
    if (events && events.length > 0) {
      daysWithEvents = daysWithEvents.map(
        (entry) =>
          ({
            ...entry,
            events: events?.filter((event) => {
              return isWithinInterval(
                startOfDay(getDateFromCalendarEntry(entry)),
                {
                  start: startOfDay(event.startEvent),
                  end: startOfDay(event.endEvent),
                }
              );
            }),
          } as CalendarEntryUiState)
      );
    }

    return daysWithEvents;
  }, [currentDate, events]);

  return (
    <>
      {error && <ErrorAlert error={error} />}
      <div className="sm:rounded-xl overflow-hidden border sm:p-4 mt-2 sm:mt-8 h-screen w-full sm:bg-blue-100">
        <div
          key={currentDate.getMonth()}
          className="grid grid-cols-7 overflow-y-scroll lg:overflow-clip h-full rounded-xl animate-slide-in "
        >
          {shouldShowLoadingSkeleton
            ? Array.from({ length: CALENDAR_GRID_LENGTH }).map((_, index) => (
                <DateElementSkeleton key={index} />
              ))
            : totalDaysWithEvents.length > 0 &&
              totalDaysWithEvents.map((calendarEntry, index) => (
                <CalendarEntryElement
                  entry={calendarEntry}
                  cellIndex={index}
                  key={index}
                  provideEvent={(eventEntry) =>
                    setSelectedEvent({ ...eventEntry })
                  }
                />
              ))}
        </div>
        {selectedEvent && (
          <EventDetailsDialog
            selectedEvent={selectedEvent}
            onDialogDismiss={() => setSelectedEvent(undefined)}
            onEventDeleted={() => setSelectedEvent(undefined)}
          />
        )}
      </div>
    </>
  );
};

export default MonthCalendarPage;

interface CalendarEntryProps {
  entry: CalendarEntryUiState;
  cellIndex: number;
  provideEvent: (eventEntry: EventUiState) => void;
}

const CalendarEntryElement = ({
  entry,
  cellIndex,
  provideEvent,
}: CalendarEntryProps) => {
  return (
    <div className="flex items-center flex-col py-2 text-sm sm:text-xl md:text-2xl border bg-white select-none">
      {cellIndex < WEEK_DAYS_COUNT && (
        <h1 className="font-semibold">{WEEK_DAYS[cellIndex]}</h1>
      )}
      <h1
        className={`${
          isToday(getDateFromCalendarEntry(entry))
            ? "text-blue-600 font-bold"
            : "font-normal"
        }`}
      >
        {entry.date === `${FIRST_DAY_OF_THE_MONTH}`
          ? `${entry.month} ${entry.date}`
          : entry.date}
      </h1>
      {entry.events.length > 0 &&
        entry.events.map((eventEntry) => (
          <EventHolder
            onClick={() => provideEvent(eventEntry)}
            key={eventEntry.id}
            event={eventEntry}
          />
        ))}
    </div>
  );
};

const DateElementSkeleton = () => (
  <div className="flex items-center flex-col py-2 border bg-white">
    <Skeleton className="w-1/4 h-6 mb-1" />
    <Skeleton className="w-1/12 h-6 mb-4" />
    <Skeleton className="w-1/2 h-4 mb-1" />
    <Skeleton className="w-1/2 h-4 mb-1" />
    <Skeleton className="w-1/2 h-4" />
  </div>
);
