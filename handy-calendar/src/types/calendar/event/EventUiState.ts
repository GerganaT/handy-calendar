interface EventUiState{
    id: number;
    title: string;
    description: string;
    startEvent: Date;
    endEvent: Date;
    type: EventType;
}

export enum EventType {
    Birthday = "GREEN",
    Meeting = "BLUE",
    Task = "ORANGE",
}

export default EventUiState;