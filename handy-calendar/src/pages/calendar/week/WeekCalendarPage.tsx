import ErrorAlert from "@/components/ui/ErrorAlert";
import DailyEvents from "@/components/ui/event/DailyEvents";
import EventDetailsDialog from "@/components/ui/event/EventDetailsDialog";
import EventsSkeleton from "@/components/ui/event/EventsSkeleton";
import TimeIndicator from "@/components/ui/TimeIndicator";
import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useGetEvents } from "@/services/calendar/event/eventService";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState from "@/types/calendar/event/EventUiState";
import { isSameDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  formatHourInTwelveHourFormat,
  FULL_DAY_NIGHT_HOURS,
  getCalendarEntryEvents,
  getDateFromCalendarEntry,
  getWeekDates,
  WEEK_DAYS_COUNT,
} from "../utils/calendarUtils";
import { useTriggerLoadingSkeleton } from "../utils/helperHooks";

const WeekCalendarPage = () => {
  const { data: events, error } = useGetEvents();
  const { currentDate, initializeCurrentDate } = useCalendarNavigationStore();
  const { shouldShowLoadingSkeleton, showLoadingSkeleton } =
    useTriggerLoadingSkeleton();

  useEffect(() => initializeCurrentDate(), []);

  const totalDaysWithEvents = useMemo(() => {
    showLoadingSkeleton();
    let weekDates = getWeekDates(currentDate);
    if (events && events.size > 0) {
      weekDates = weekDates.map(
        (entry) =>
          ({
            ...entry,
            events: getCalendarEntryEvents(events, entry),
          } as CalendarEntryUiState)
      );
    }

    return weekDates;
  }, [currentDate, events]);

  return (
    <>
      {error && <ErrorAlert error={error} />}
      <div className="flex flex-col w-full rounded-xl sm:p-4 sm:m-4 sm:bg-blue-100">
        <div
          key={currentDate.getDate()}
          className="flex flex-row w-full h-full animate-slide-in"
        >
          <div className="flex flex-col">
            <div className="h-10 sm:h-16"></div>
            <HoursIndicator />
          </div>
          <div className="w-full h-full">
            <WeekDatesHeader weekDates={totalDaysWithEvents} />
            <WeekdaysAgenda
              eventsLength={events?.size}
              weekCalendarEntries={totalDaysWithEvents}
              shouldShowLoadingSkeleton={shouldShowLoadingSkeleton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WeekCalendarPage;

const HoursIndicator = () => (
  <div className="grid grid-rows-24 w-11 sm:w-16">
    {Array.from({ length: FULL_DAY_NIGHT_HOURS }).map((_, hour) => (
      <div
        key={hour}
        className="flex items-start justify-end pr-1 sm:pr-2 font-medium text-xs sm:text-sm text-gray-600 h-10"
      >
        {formatHourInTwelveHourFormat(hour)}
      </div>
    ))}
  </div>
);

interface WeekDatesHeaderProps {
  weekDates: CalendarEntryUiState[];
}

const WeekDatesHeader = ({ weekDates }: WeekDatesHeaderProps) => {
  return (
    <div className="grid grid-cols-7 text-center sm:bg-blue-100">
      {weekDates.length > 0 &&
        weekDates.map((event, index) => (
          <div
            key={index}
            className={`${
              isSameDay(getDateFromCalendarEntry(event), new Date()) &&
              "bg-blue-400 text-white rounded-t-lg"
            } flex flex-col text-sm sm:text-base md:text-lg lg:text-xl pb-2`}
          >
            <span className="font-medium select-none">{event.day}</span>
            <span className="font-bold select-none">{event.date}</span>
          </div>
        ))}
    </div>
  );
};

interface WeekdaysAgendaProps {
  weekCalendarEntries: CalendarEntryUiState[];
  shouldShowLoadingSkeleton: boolean;
  eventsLength?: number;
}

const WeekdaysAgenda = ({
  weekCalendarEntries,
  shouldShowLoadingSkeleton,
  eventsLength,
}: WeekdaysAgendaProps) => {
  const [clickedEvent, setClickedEvent] = useState<EventUiState | null>(null);

  const timeIndicatorKey = `${eventsLength}-${
    clickedEvent ? `event-${clickedEvent.id}` : "no-event"
  }`;

  return (
    <>
      {clickedEvent && (
        <EventDetailsDialog
          selectedEvent={clickedEvent}
          onDialogDismiss={() => setClickedEvent(null)}
          onEventDeleted={() => setClickedEvent(null)}
        />
      )}
      <div className="relative w-full bg-white rounded-xl">
        <CalendarGrid />
        <div
          className="absolute inset-0 grid grid-cols-7"
          onClick={() => setClickedEvent(null)}
        >
          <TimeIndicator key={timeIndicatorKey} />
          {shouldShowLoadingSkeleton ? (
            <LoadingSkeletons />
          ) : (
            <WeeklyEvents
              weekCalendarEntries={weekCalendarEntries}
              clickedEvent={clickedEvent}
              onEventClick={(event) => setClickedEvent(event)}
            />
          )}
        </div>
      </div>
    </>
  );
};

const CalendarGrid = () => (
  <div className="grid grid-cols-7 grid-rows-24 w-full h-full">
    {[...Array(WEEK_DAYS_COUNT * FULL_DAY_NIGHT_HOURS)].map((_, index) => (
      <div key={index} className="border border-gray-300 min-h-10" />
    ))}
  </div>
);
const LoadingSkeletons = () =>
  [...Array(7)].map((_, dayIndex) => <EventsSkeleton key={dayIndex} />);

interface WeeklyEventsProps {
  weekCalendarEntries: CalendarEntryUiState[];
  clickedEvent: EventUiState | null;
  onEventClick: (clickedEvent: EventUiState) => void;
}

const WeeklyEvents = ({
  weekCalendarEntries: events,
  clickedEvent,
  onEventClick,
}: WeeklyEventsProps) =>
  events.map((entry, dayIndex) => (
    <DailyEvents
      key={dayIndex}
      calendarEntry={entry}
      passedEvent={clickedEvent}
      onEventClick={onEventClick}
    />
  ));
