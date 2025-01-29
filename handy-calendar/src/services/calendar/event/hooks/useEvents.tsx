import {
  useDeleteEvent,
  useGetEvent,
  useGetEvents,
  useSaveEvent,
} from "../eventService";

interface UseEventsProps {
  eventId: number;
}

const useEvents = ({ eventId }: UseEventsProps) => {
  const { data: event, error: eventError } = useGetEvent(eventId);
  const {
    data: events,
    error: eventsError,
    isLoading: areEventsLoading,
  } = useGetEvents();
  const {
    mutate: saveEvent,
    error: saveEventError,
    isSuccess: isEventSaved,
  } = useSaveEvent();
  const {
    mutate: deleteEvent,
    error: deleteEventError,
    isSuccess: isEventDeleted,
  } = useDeleteEvent();

  return {
    events,
    eventsError,
    areEventsLoading,
    event,
    eventError,
    saveEvent,
    saveEventError,
    isEventSaved,
    deleteEvent,
    deleteEventError,
    isEventDeleted,
  };
};

export default useEvents;
