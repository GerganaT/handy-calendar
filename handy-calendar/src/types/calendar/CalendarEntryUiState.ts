import EventUiState from "./event/EventUiState";

export default interface CalendarEntryUiState{
    day:string;
    date:string;
    month?: string;
    year?: number,
    events: EventUiState[],
}