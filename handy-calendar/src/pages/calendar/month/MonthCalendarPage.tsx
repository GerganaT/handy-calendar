import ErrorAlert from "@/components/ui/ErrorAlert";
import EventDetailsDialog from "@/components/ui/event/EventDetailsDialog";
import EventHolder from "@/components/ui/event/EventHolder";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useGetEvents } from "@/services/calendar/event/eventService";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState from "@/types/calendar/event/EventUiState";
import {
  differenceInDays,
  isSameDay,
  isToday,
  isWithinInterval,
  startOfDay,
} from "date-fns";
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
const EVENT_CONTAINER_DEFAULT_SPACING = 1.5;

const MonthCalendarPage = () => {
  const { currentDate } = useCalendarNavigationStore();
  const [selectedEvent, setSelectedEvent] = useState<EventUiState>();
  const { shouldShowLoadingSkeleton, showLoadingSkeleton } =
    useTriggerLoadingSkeleton();
  const { data: events, error } = useGetEvents();

  const multiDayEventsPositionIndices = useMemo(() => {
    if (!events) return new Map<number, number>();

    const positions = new Map<number, number>();
    const multiDayEvents = events
      .filter((event) => differenceInDays(event.endEvent, event.startEvent) > 0)
      .sort(
        (firstEvent, secondEvent) =>
          firstEvent.startEvent.getTime() - secondEvent.startEvent.getTime()
      );

    let currentPosition = 0;
    multiDayEvents.forEach((event) => {
      positions.set(event.id, currentPosition++);
    });

    return positions;
  }, [events]);

  const totalDaysWithEvents = useMemo(() => {
    showLoadingSkeleton();
    let daysWithEvents = getMonthDates(currentDate);
    if (events && events.length > 0) {
      daysWithEvents = daysWithEvents.map((entry) => {
        const currentDate = getDateFromCalendarEntry(entry);
        const dayEvents = events?.filter((event) => {
          return isWithinInterval(startOfDay(currentDate), {
            start: startOfDay(event.startEvent),
            end: startOfDay(event.endEvent),
          });
        });

        const multiDayEvents = dayEvents
          .filter(
            (event) => differenceInDays(event.endEvent, event.startEvent) > 0
          )
          .sort(
            (firstEvent, secondEvent) =>
              firstEvent.startEvent.getTime() - secondEvent.startEvent.getTime()
          );

        const singleDayEvents = dayEvents
          .filter(
            (event) => differenceInDays(event.endEvent, event.startEvent) === 0
          )
          .sort(
            (firstEvent, secondEvent) =>
              firstEvent.startEvent.getTime() - secondEvent.startEvent.getTime()
          );

        return {
          ...entry,
          events: [...multiDayEvents, ...singleDayEvents],
        } as CalendarEntryUiState;
      });
    }
    return daysWithEvents;
  }, [currentDate, events]);

  return (
    <>
      {error && <ErrorAlert error={error} />}
      <div className="sm:rounded-xl overflow-hidden border sm:p-4 mt-2 sm:mt-8 h-screen w-full sm:bg-blue-100">
        <div
          key={currentDate.getMonth()}
          className="grid grid-cols-7 overflow-y-scroll lg:overflow-clip h-full rounded-xl animate-slide-in"
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
                  eventPositions={multiDayEventsPositionIndices}
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

interface CalendarEntryProps {
  entry: CalendarEntryUiState;
  cellIndex: number;
  provideEvent: (eventEntry: EventUiState) => void;
  eventPositions: Map<number, number>;
}

const CalendarEntryElement = ({
  entry,
  cellIndex,
  provideEvent,
  eventPositions,
}: CalendarEntryProps) => {
  const currentDate = getDateFromCalendarEntry(entry);

  const multiDayEvents = entry.events.filter(
    (event) => differenceInDays(event.endEvent, event.startEvent) > 0
  );
  const singleDayEvents = entry.events.filter(
    (event) => differenceInDays(event.endEvent, event.startEvent) === 0
  );

  return (
    <div className="flex items-center flex-col text-sm sm:text-xl md:text-2xl border bg-white select-none relative">
      {cellIndex < WEEK_DAYS_COUNT && (
        <h1 className="font-semibold">{WEEK_DAYS[cellIndex]}</h1>
      )}
      <h1
        className={`${
          isToday(currentDate) ? "text-blue-600 font-bold" : "font-normal"
        } mb-4`}
      >
        {entry.date === FIRST_DAY_OF_THE_MONTH.toString()
          ? `${entry.month} ${entry.date}`
          : entry.date}
      </h1>

      <div className="absolute top-0 left-0 right-0">
        {multiDayEvents.map((eventEntry) => {
          const isFirstDay = isSameDay(currentDate, eventEntry.startEvent);
          const isLastDay = isSameDay(currentDate, eventEntry.endEvent);
          const eventIndex = eventPositions.get(eventEntry.id) || 0;

          return (
            <EventHolder
              onClick={() => provideEvent(eventEntry)}
              key={eventEntry.id}
              event={eventEntry}
              isMultiDay={true}
              isFirstDay={isFirstDay}
              isLastDay={isLastDay}
              eventIndex={eventIndex}
              isUnderWeekdayHeader={cellIndex < WEEK_DAYS_COUNT}
              multiDayEventsCount={multiDayEvents.length}
            />
          );
        })}
      </div>

      <div
        className=" w-full lg:w-auto items-center flex flex-col"
        style={{
          marginTop: `${
            EVENT_CONTAINER_DEFAULT_SPACING +
            multiDayEvents.length * EVENT_CONTAINER_DEFAULT_SPACING
          }rem`,
        }}
      >
        {singleDayEvents.map((eventEntry, index) => (
          <EventHolder
            onClick={() => provideEvent(eventEntry)}
            key={eventEntry.id}
            event={eventEntry}
            isMultiDay={false}
            isFirstDay={true}
            isLastDay={true}
            eventIndex={index}
            multiDayEventsCount={multiDayEvents.length}
          />
        ))}
      </div>
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

export default MonthCalendarPage;
