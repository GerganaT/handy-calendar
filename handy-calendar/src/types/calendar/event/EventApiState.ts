interface EventApiState{
    id: number;
    title: string;
    description?: string;
    startEvent: Date;
    endEvent: Date;
    type: EventType;
}

enum EventType {
    Birthday = "GREEN",
    Meeting = "BLUE",
    Task = "ORANGE",
}

export default EventApiState;