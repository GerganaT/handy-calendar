
interface EventApiState{
    id: number;
    title: string;
    description?: string;
    startEvent: Date;
    endEvent: Date;
    type: EventType;
}

export default EventApiState;

enum EventType {
    Birthday = "GREEN",
    Meeting = "BLUE",
    Task = "ORANGE",
}