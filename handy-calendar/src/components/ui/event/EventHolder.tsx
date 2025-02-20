import { twelveHoursFormattedTime } from "@/pages/calendar/utils/calendarUtils";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";

interface EventHolderProps {
  event: EventUiState;
  showCategoryColorCircle?: boolean;
  onClick: (eventId: number) => void;
}

const EventHolder = ({ event, onClick }: EventHolderProps) => {
  const eventTypeColor = {
    [EventType.Birthday]: "bg-green",
    [EventType.Meeting]: "bg-blue",
    [EventType.Task]: "bg-orange",
  }[event.type];

  return (
    <div
      onClick={() => onClick(event.id)}
      className={`flex items-center w-2/3 ps-1 m-0.5 ${eventTypeColor}-300 rounded-lg hover:bg-gray-200 hover:cursor-pointer select-none`}
    >
      <span className="text-xs sm:text-sm font-medium overflow-hidden whitespace-nowrap ">
        {` ${event.title}, ${twelveHoursFormattedTime(event.startEvent)}`}
      </span>
    </div>
  );
};

export default EventHolder;
