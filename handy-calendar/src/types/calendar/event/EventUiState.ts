
interface EventUiState{
    id: number;
    title: string;
    description?: string;
    startEvent: Date;
    endEvent: Date;
    type: EventType;
}

export default EventUiState;

export enum EventType {
    Birthday = "GREEN",
    Meeting = "BLUE",
    Task = "ORANGE",
}