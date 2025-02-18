import ErrorAlert from "@/components/ui/ErrorAlert";
import EventDetailsDialog from "@/components/ui/event/EventDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useGetEvents } from "@/services/calendar/event/eventService";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import {
  differenceInMinutes,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { Cake, Calendar, CheckSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  formatHourInTwelveHourFormat,
  FULL_DAY_NIGHT_HOURS,
  getDateFromCalendarEntry,
  getWeekDates,
  MINUTES_IN_AN_HOUR,
  twelveHoursFormattedTime,
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
    let daysWithEvents = getWeekDates(currentDate);
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
      <div className="flex flex-col w-full rounded-xl p-4 m-4 bg-blue-100">
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
  <div className="grid grid-rows-24 w-16">
    {Array.from({ length: FULL_DAY_NIGHT_HOURS }).map((_, hour) => (
      <div
        key={hour}
        className="flex items-start justify-end pr-2 font-medium text-sm text-gray-600  h-10"
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
    <div className="grid grid-cols-7 text-center bg-blue-100">
      {weekDates.length > 0 &&
        weekDates.map((event, index) => (
          <div
            key={index}
            className={`${
              isSameDay(getDateFromCalendarEntry(event), new Date()) &&
              "bg-blue-400 text-white rounded-t-lg"
            } flex flex-col text-sm sm:text-base md:text-lg lg:text-xl pb-2`}
          >
            <span className="font-medium">{event.day}</span>
            <span className="font-bold">{event.date}</span>
          </div>
        ))}
    </div>
  );
};

interface WeekdaysAgendaProps {
  weekCalendarEntries: CalendarEntryUiState[];
  shouldShowLoadingSkeleton: boolean;
}

const WeekdaysAgenda = ({
  weekCalendarEntries,
  shouldShowLoadingSkeleton,
}: WeekdaysAgendaProps) => {
  const [clickedEvent, setClickedEvent] = useState<EventUiState | null>(null);

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
          {shouldShowLoadingSkeleton ? (
            <LoadingSkeleton />
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
const LoadingSkeleton = () =>
  [...Array(7)].map((_, dayIndex) => (
    <div key={dayIndex} className="relative h-full px-1 ">
      {[...Array(3)].map((_, eventIndex) => {
        const randomSkeletonTopPosition = Math.floor(Math.random() * 80);
        const randomSkeletonHeight = Math.floor(Math.random() * 10) + 10;
        const randomSkeletonStackIndex = eventIndex;
        const randomSkeletonWidth = Math.max(
          95 - randomSkeletonStackIndex * 20,
          40
        );

        return (
          <Skeleton
            key={eventIndex}
            className="absolute rounded-md bg-blue-200"
            style={{
              background: `bg-white`,
              top: `${randomSkeletonTopPosition}%`,
              height: `${randomSkeletonHeight}%`,
              width: `${randomSkeletonWidth}%`,
              transform: `translateZ(${randomSkeletonStackIndex * 2}px)`,
              zIndex: randomSkeletonStackIndex + 1,
            }}
          />
        );
      })}
    </div>
  ));

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
  events.map((entry, dayIndex) => {
    const currentDate = startOfDay(getDateFromCalendarEntry(entry));

    const stackedEvents = [...entry.events].sort((previousEvent, nextEvent) => {
      if (previousEvent.id === clickedEvent?.id) return 1;
      if (nextEvent.id === clickedEvent?.id) return -1;
      return (
        previousEvent.startEvent.getTime() - nextEvent.startEvent.getTime()
      );
    });

    return (
      <div key={dayIndex} className="relative h-full">
        {stackedEvents.map((event, eventIndex) => {
          const eventStackIndex = getEventStackIndex(event, entry.events);

          const { topPosition, containerHeight } = calculateEventPosition(
            currentDate,
            startOfDay(event.startEvent),
            startOfDay(event.endEvent),
            event
          );

          return (
            <div
              key={`${event.id}-${eventIndex}`}
              className="absolute border shadow-md border-white rounded-md overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                left: 0,
                width: `${getEventContainerDynamicWidth(eventStackIndex)}%`,
                top: `${topPosition}%`,
                height: `${containerHeight}%`,
                backgroundColor: getEventColor(event.type),
                transform: `translateZ(${eventStackIndex * 2}px)`,
                zIndex:
                  event.id === clickedEvent?.id ? 50 : eventStackIndex + 1,
              }}
            >
              <EventHolder
                event={event}
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation();
                  onEventClick(event);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  });

const getEventStackIndex = (
  event: EventUiState,
  allEvents: EventUiState[]
): number => {
  const areEventsOverlapped = (
    event1: EventUiState,
    event2: EventUiState
  ): boolean => {
    return (
      event1.startEvent.getTime() < event2.endEvent.getTime() &&
      event2.startEvent.getTime() < event1.endEvent.getTime()
    );
  };

  const overlappingEvents = allEvents
    .filter((event) => areEventsOverlapped(event, event))
    .sort(
      (previousEvent, nextEvent) =>
        previousEvent.startEvent.getTime() - nextEvent.startEvent.getTime()
    );

  return overlappingEvents.indexOf(event);
};

const calculateEventPosition = (
  currentDate: Date,
  eventStartDay: Date,
  eventEndDay: Date,
  event: EventUiState
): { topPosition: number; containerHeight: number } => {
  const getTimePosition = (date: Date) =>
    (date.getHours() + date.getMinutes() / MINUTES_IN_AN_HOUR) *
    (100 / FULL_DAY_NIGHT_HOURS);

  switch (true) {
    case !isSameDay(currentDate, eventStartDay) &&
      !isSameDay(currentDate, eventEndDay):
      return { topPosition: 0, containerHeight: 100 };

    case !isSameDay(currentDate, eventStartDay) &&
      isSameDay(currentDate, eventEndDay):
      return {
        topPosition: 0,
        containerHeight: getTimePosition(event.endEvent),
      };

    case isSameDay(currentDate, eventStartDay) &&
      !isSameDay(currentDate, eventEndDay):
      return {
        topPosition: getTimePosition(event.startEvent),
        containerHeight: 100 - getTimePosition(event.startEvent),
      };

    default:
      return {
        topPosition: getTimePosition(event.startEvent),
        containerHeight: Math.max(
          (differenceInMinutes(event.endEvent, event.startEvent) / (24 * 60)) *
            100,
          2
        ),
      };
  }
};

const getEventContainerDynamicWidth = (eventStackIndex: number) => {
  const eventContainerMinimumWidthPercentage = 40;
  const eventContainerBaseWidthPercentage = 95;
  const eventContainerWidthReductionPercentage = 20;
  return Math.max(
    eventContainerBaseWidthPercentage -
      eventStackIndex * eventContainerWidthReductionPercentage,
    eventContainerMinimumWidthPercentage
  );
};

const getEventColor = (type: EventType) => {
  switch (type) {
    case EventType.Birthday:
      return "#86efac";
    case EventType.Meeting:
      return "#93c5fd";
    case EventType.Task:
      return "#fdba74";
    default:
      return "#60A5FA";
  }
};

interface EventHolderProps {
  event: EventUiState;
  onClick: (e: React.MouseEvent) => void;
}

const EventHolder = ({ event, onClick }: EventHolderProps) => {
  return (
    <div
      className="h-full w-full px-1 cursor-pointer hover:bg-gray-400/35"
      onClick={onClick}
    >
      <div className="flex items-center gap-1 text-xs select-none">
        <span className="flex-shrink-0">{getEventIcon(event.type)}</span>
        <span className="font-semibold truncate flex-grow">{event.title}</span>
        <span className="flex-shrink-0">
          {twelveHoursFormattedTime(event.startEvent)}
        </span>
      </div>
      {event.description && (
        <div className="text-xs truncate mt-0.5">{event.description}</div>
      )}
    </div>
  );
};

const getEventIcon = (type: EventType) => {
  switch (type) {
    case EventType.Birthday:
      return <Cake size={14} />;
    case EventType.Meeting:
      return <Calendar size={14} />;
    case EventType.Task:
      return <CheckSquare size={14} />;
    default:
      return <Calendar size={14} />;
  }
};
