import {
  FULL_DAY_NIGHT_HOURS,
  getDateFromCalendarEntry,
  MINUTES_IN_AN_HOUR,
  twelveHoursFormattedTime,
} from "@/pages/calendar/utils/calendarUtils";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import { differenceInMinutes, isSameDay, startOfDay } from "date-fns";

interface DailyEventsProps {
  calendarEntry: CalendarEntryUiState;
  passedEvent: EventUiState | null;
  onEventClick: (clickedEvent: EventUiState) => void;
}

const DailyEvents = ({
  calendarEntry,
  passedEvent,
  onEventClick,
}: DailyEventsProps) => {
  const currentDate = startOfDay(getDateFromCalendarEntry(calendarEntry));

  const stackedEvents = [...calendarEntry.events].sort(
    (previousEvent, nextEvent) => {
      if (previousEvent.id === passedEvent?.id) return 1;
      if (nextEvent.id === passedEvent?.id) return -1;
      return (
        previousEvent.startEvent.getTime() - nextEvent.startEvent.getTime()
      );
    }
  );

  return (
    <div className="relative h-full">
      {stackedEvents.map((event, eventIndex) => {
        const eventStackIndex = getEventStackIndex(event, calendarEntry.events);

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
              zIndex: event.id === passedEvent?.id ? 50 : eventStackIndex + 1,
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
};

export default DailyEvents;

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
      <div className="flex items-center text-xs">
        <span className="font-semibold overflow-hidden whitespace-nowrap flex-grow select-none">
          {`${event.title}, ${twelveHoursFormattedTime(event.startEvent)}`}
        </span>
      </div>
      {event.description && (
        <div className="text-xs overflow-hidden whitespace-nowrap mt-0.5 select-none">
          {event.description}
        </div>
      )}
    </div>
  );
};
