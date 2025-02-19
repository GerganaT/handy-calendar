import { twelveHoursFormattedTime } from "@/pages/calendar/utils/calendarUtils";
import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";

interface EventHolderProps {
  event: EventUiState;
  showCategoryColorCircle?: boolean;
  onClick: (eventId: number) => void;
}

const EventHolder = ({ event, onClick }: EventHolderProps) => {
  const eventTypeColor = {
    [EventType.Birthday]: "bg-green-300",
    [EventType.Meeting]: "bg-blue-300",
    [EventType.Task]: "bg-orange-300",
  }[event.type];

  return (
    <div
      onClick={() => onClick(event.id)}
      className="flex items-center w-2/3 p-1 hover:bg-gray-100 hover:rounded-lg hover:cursor-pointer select-none"
    >
      <div className={`h-4 w-4 rounded-full ${eventTypeColor} mr-2 `}></div>
      <span className="text-sm text-ellipsis font-medium mr-2 ">
        {twelveHoursFormattedTime(event.startEvent)}
      </span>
      <span className="text-sm font-semibold truncate overflow-hidden whitespace-nowrap flex-1">
        {event.title}
      </span>
    </div>
  );
};

export default EventHolder;
