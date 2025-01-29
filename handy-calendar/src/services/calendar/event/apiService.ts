import EventApiState from "@/types/calendar/event/EventApiState";
import apiClient from "./apiClient";
import { EVENT_DEFAULT_ID } from "./constants";

// this also updates an existing entry, this is how localStorage works per default when the item
// key is the same, didn't create a second function just for update to save time and not repeat the same code

export const saveEvent = async (event:EventApiState) => {
            const storedObject = {
              ...event,
              startEvent: event.startEvent.getMilliseconds(),
              endEvent: event.endEvent.getMilliseconds(),
            }; 
            apiClient.setItem(`${event.id}`, JSON.stringify(storedObject));
            return true;
};

export const deleteEvent = async (eventId: number) => {
        apiClient.removeItem(`${eventId}`)
        return true;  
};

export const getEvent = (eventId: number) => {
        const storedItem = apiClient.getItem(`${eventId}`);
        return storedItem ? (JSON.parse(storedItem) as EventApiState) : null;
};

export const getEvents = () => {
    const storedEvents: EventApiState[] = [];
    for (let index = 0; index < apiClient.length; index++) {
        const storedEvent = apiClient.getItem(apiClient.key(index) ?? `${EVENT_DEFAULT_ID}`);
        if(storedEvent){
            storedEvents.push(JSON.parse(storedEvent) as EventApiState);
        }
    }
    return storedEvents;
};
