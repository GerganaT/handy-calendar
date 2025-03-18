import useTimePositionOffset from "@/hooks/use-position-offset";
import {
  getDateFromCalendarEntry,
  getTimePositionOffset,
  twelveHoursFormattedTime,
} from "@/pages/calendar/utils/calendarUtils";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import {
  differenceInMinutes,
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
} from "date-fns";

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
  const timePositionOffset = useTimePositionOffset();

  const currentDate = startOfDay(getDateFromCalendarEntry(calendarEntry));

  return (
    timePositionOffset && (
      <div className="relative h-full">
        {calendarEntry.events.map((event, eventIndex) => {
          const { topPosition, containerHeight } = calculateEventPosition(
            currentDate,
            startOfDay(event.startEvent),
            startOfDay(event.endEvent),
            event
          );

          const calculateGradientPercentage = () => {
            const now = new Date();
            const currentTime = now.getTime();
            const startEvent = event.startEvent;
            const startEventTime = startEvent.getTime();
            const endEvent = event.endEvent;
            const endEventTime = endEvent.getTime();
            const elapsedTimeSinceEventStart = currentTime - startEventTime;
            const isCurrentDateToday = isToday(currentDate);

            // 100 and 0 are percentages
            switch (true) {
              case isCurrentDateToday &&
                isBefore(startEvent, startOfDay(now)) &&
                isToday(endEvent):
                return Math.min(
                  100,
                  Math.max(
                    0,
                    ((currentTime - startOfDay(now).getTime()) /
                      (endEventTime - startOfDay(now).getTime())) *
                      100
                  )
                );
              case isCurrentDateToday &&
                isToday(startEvent) &&
                isAfter(endEvent, endOfDay(now)) &&
                currentTime > startEventTime:
                return Math.min(
                  100,
                  Math.max(
                    0,
                    (elapsedTimeSinceEventStart /
                      (endOfDay(now).getTime() - startEventTime)) *
                      100
                  )
                );
              case isCurrentDateToday &&
                isBefore(startEvent, startOfDay(now)) &&
                isAfter(endEvent, endOfDay(now)):
                return Math.min(
                  100,
                  Math.max(
                    0,
                    ((currentTime - startOfDay(now).getTime()) /
                      (endOfDay(now).getTime() - startOfDay(now).getTime())) *
                      100
                  )
                );
              case isCurrentDateToday &&
                currentTime > startEventTime &&
                currentTime < endEventTime:
                return Math.min(
                  100,
                  Math.max(
                    0,
                    (elapsedTimeSinceEventStart /
                      (endEventTime - startEventTime)) *
                      100
                  )
                );
              case isCurrentDateToday && endEventTime < currentTime:
                return 100;
              case isCurrentDateToday && startEventTime > currentTime:
                return 0;
              case isBefore(currentDate, now):
                return 100;
              default:
                return 0;
            }
          };

          const gradientBackground = () => {
            return `linear-gradient(#9ca3af ${calculateGradientPercentage()}%, ${getEventColor(
              event.type
            )} ${calculateGradientPercentage()}%)`;
          };

          return (
            <div
              key={`${event.id}-${eventIndex}`}
              className="absolute border shadow-md border-white rounded-md overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                left: 0,
                width: `${getEventContainerDynamicWidth(eventIndex)}%`,
                top: `${topPosition}%`,
                height: `${containerHeight}%`,
                background: gradientBackground(),
                zIndex:
                  event.id === passedEvent?.id
                    ? CLICKED_EVENT_ON_TOP_INDEX
                    : eventIndex + 1,
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
    )
  );
};

export default DailyEvents;

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
  const widthReduction = 10;
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
      className="h-full w-full px-1 cursor-pointer hover:bg-black/10"
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
