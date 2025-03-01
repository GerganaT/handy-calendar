import { twelveHoursFormattedTime } from "@/pages/calendar/utils/calendarUtils";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import { useEffect, useState } from "react";

const EVENT_TOP_POSITION_HEADER_SPACING = 5.0;
const EVENT_TOP_POSITION_NON_HEADER_SPACING = 3.0;
const EVENT_DEFAULT_SPACING = 1.5;

interface EventHolderProps {
  event: EventUiState;
  showCategoryColorCircle?: boolean;
  onClick: (eventId: number) => void;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isMultiDay?: boolean;
  isUnderWeekdayHeader?: boolean;
  eventIndex: number;
  multiDayEventsCount: number;
}

const EventHolder = ({
  event,
  onClick,
  isFirstDay = true,
  isLastDay = true,
  isMultiDay = false,
  isUnderWeekdayHeader,
  eventIndex = 0,
}: EventHolderProps) => {
  const [eventResponsiveSpacing, setEventResponsiveSpacing] = useState(0);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    setEventResponsiveSpacing(window.innerWidth >= 768 ? 1.5 : 0);
  };

  const eventTypeColor = {
    [EventType.Birthday]: "bg-green-300",
    [EventType.Meeting]: "bg-blue-300",
    [EventType.Task]: "bg-orange-300",
  }[event.type];

  const eventTopPositionIndex = isUnderWeekdayHeader
    ? EVENT_TOP_POSITION_HEADER_SPACING
    : EVENT_TOP_POSITION_NON_HEADER_SPACING;

  return (
    <div
      onClick={() => onClick(event.id)}
      className={`
        flex items-center ps-1 ${eventTypeColor} hover:bg-opacity-90 hover:cursor-pointer select-none
        ${
          isMultiDay
            ? "absolute left-0 right-0"
            : "relative w-[calc(100%-0.5rem)] mx-1"
        } 
        ${!isFirstDay ? "-ml-2" : "rounded-l-lg"} 
        ${!isLastDay ? "-mr-2" : "rounded-r-lg"}
      `}
      style={{
        top: isMultiDay
          ? `${
              eventResponsiveSpacing +
              eventTopPositionIndex +
              eventIndex * EVENT_DEFAULT_SPACING
            }rem`
          : undefined,
        marginBottom: "0.25rem",
        zIndex: isMultiDay ? 10 : 1,
      }}
    >
      <span className="text-xs sm:text-sm font-medium overflow-hidden whitespace-nowrap">
        {isFirstDay ? (
          isMultiDay ? (
            event.title
          ) : (
            `${event.title}, ${twelveHoursFormattedTime(event.startEvent)}`
          )
        ) : (
          <span className="opacity-0">{event.title}</span>
        )}
      </span>
    </div>
  );
};

export default EventHolder;
