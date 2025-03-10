import usePositionOffset from "@/hooks/use-position-offset";
import {
  getDateFromCalendarEntry,
  getTimePositionOffset,
  twelveHoursFormattedTime,
} from "@/pages/calendar/utils/calendarUtils";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import { differenceInMinutes, isSameDay, isToday, startOfDay } from "date-fns";

interface DailyEventsProps {
  calendarEntry: CalendarEntryUiState;
  passedEvent: EventUiState | null;
  onEventClick: (clickedEvent: EventUiState) => void;
}

const CLICKED_EVENT_ON_TOP_INDEX = 31;

const DailyEvents = ({
  calendarEntry,
  passedEvent,
  onEventClick,
}: DailyEventsProps) => {
  const positionOffset = usePositionOffset();

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
    <div className="relative h-full" key={positionOffset}>
      {isToday(currentDate) && stackedEvents.length > 0 && (
        <div
          className="opacity-50 h-full rounded-md absolute pointer-events-none z-20"
          style={{
            background: `linear-gradient(#1d4ed8 ${positionOffset}%, transparent ${positionOffset}%)`,
            width: `95%`,
          }}
        ></div>
      )}
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
              background: getEventColor(event.type),
              transform: `translateZ(${eventStackIndex * 2}px)`,
              zIndex:
                event.id === passedEvent?.id
                  ? CLICKED_EVENT_ON_TOP_INDEX
                  : eventStackIndex + 1,
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
  const overlappingEvents = [...allEvents].sort(
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
  switch (true) {
    case !isSameDay(currentDate, eventStartDay) &&
      !isSameDay(currentDate, eventEndDay):
      return { topPosition: 0, containerHeight: 100 };

    case !isSameDay(currentDate, eventStartDay) &&
      isSameDay(currentDate, eventEndDay):
      return {
        topPosition: 0,
        containerHeight: getTimePositionOffset(event.endEvent),
      };

    case isSameDay(currentDate, eventStartDay) &&
      !isSameDay(currentDate, eventEndDay):
      return {
        topPosition: getTimePositionOffset(event.startEvent),
        containerHeight: 100 - getTimePositionOffset(event.startEvent),
      };

    default:
      return {
        topPosition: getTimePositionOffset(event.startEvent),
        containerHeight: Math.max(
          (differenceInMinutes(event.endEvent, event.startEvent) / (24 * 60)) *
            100,
          2
        ),
      };
  }
};

const getEventContainerDynamicWidth = (eventStackIndex: number) => {
  // all numbers below are percentages
  const minimumWidth = 40;
  const baseWidth = 95;
  const widthReduction = 20;
  return Math.max(baseWidth - eventStackIndex * widthReduction, minimumWidth);
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
