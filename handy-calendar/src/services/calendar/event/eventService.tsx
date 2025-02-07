import EventApiState from "@/types/calendar/event/EventApiState";
import EventUiState from "@/types/calendar/event/EventUiState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEvent, getEvent, getEvents, saveEvent } from "./apiService";
import { EVENTS_DATA_KEY } from "./constants";

export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, EventUiState>({
    mutationFn: (event: EventUiState) => saveEvent({ ...event }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENTS_DATA_KEY,
      }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, number>({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: EVENTS_DATA_KEY,
      }),
  });
};

export const useGetEvent = (eventId: number) =>
  useQuery<EventApiState | null, Error, EventUiState | null>({
    queryKey: [...EVENTS_DATA_KEY, `${eventId}`],
    queryFn: () => getEvent(eventId),
  });

export const useGetEvents = () =>
  useQuery<EventApiState[], Error, EventUiState[]>({
    queryKey: EVENTS_DATA_KEY,
    queryFn: () => getEvents(),
  });
