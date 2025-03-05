import ErrorAlert from "@/components/ui/ErrorAlert";
import DailyEvents from "@/components/ui/event/DailyEvents";
import EventDetailsDialog from "@/components/ui/event/EventDetailsDialog";
import EventsSkeleton from "@/components/ui/event/EventsSkeleton";
import TimeIndicator from "@/components/ui/TimeIndicator";
import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useGetEvents } from "@/services/calendar/event/eventService";
import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import EventUiState from "@/types/calendar/event/EventUiState";
import { isToday, isWithinInterval, startOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  formatHourInTwelveHourFormat,
  FULL_DAY_NIGHT_HOURS,
  getDateDetails,
  getDateFromCalendarEntry,
} from "../utils/calendarUtils";
import { useTriggerLoadingSkeleton } from "../utils/helperHooks";

const DayCalendarPage = () => {
  const { data: events, error } = useGetEvents();
  const { currentDate, initializeCurrentDate } = useCalendarNavigationStore();
  const { shouldShowLoadingSkeleton, showLoadingSkeleton } =
    useTriggerLoadingSkeleton();
  const [clickedEvent, setClickedEvent] = useState<EventUiState | null>(null);

  useEffect(() => initializeCurrentDate(), []);

  const currentDateWithEvents = useMemo(() => {
    showLoadingSkeleton();
    let dateDetails = getDateDetails(currentDate);
    if (events && events.length > 0) {
      dateDetails = {
        ...dateDetails,
        events: events?.filter((event) => {
          return isWithinInterval(
            startOfDay(getDateFromCalendarEntry(dateDetails)),
            {
              start: startOfDay(event.startEvent),
              end: startOfDay(event.endEvent),
            }
          );
        }),
      } as CalendarEntryUiState;
    }

    return dateDetails;
  }, [currentDate, events]);

  return (
    <>
      {error && <ErrorAlert error={error} />}
      <div
        key={currentDate.getDate()}
        className="flex flex-col w-full rounded-xl sm:p-4 sm:m-4 sm:bg-blue-100 animate-slide-in"
      >
        {clickedEvent && (
          <EventDetailsDialog
            selectedEvent={clickedEvent}
            onDialogDismiss={() => setClickedEvent(null)}
            onEventDeleted={() => setClickedEvent(null)}
          />
        )}
        <DateHeader
          day={currentDateWithEvents.day}
          date={currentDateWithEvents.date}
          isToday={isToday(currentDate)}
        />
        <div className="flex w-full h-full">
          <HoursIndicator />

          <div className="flex-1 relative">
            <TimeIndicator key={events?.length} />
            <HoursAgenda />
            <div
              className="absolute top-0 left-0 right-0 bottom-0"
              onClick={() => setClickedEvent(null)}
            >
              {shouldShowLoadingSkeleton ? (
                <EventsSkeleton />
              ) : (
                <DailyEvents
                  calendarEntry={currentDateWithEvents}
                  passedEvent={clickedEvent}
                  onEventClick={(event) => setClickedEvent(event)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface DateHeaderProps {
  day: string;
  date: string;
  isToday: boolean;
}

const DateHeader = ({ day, date, isToday }: DateHeaderProps) => {
  return (
    <div className="flex ps-11 sm:ps-16 items-start flex-col py-2 text-sm sm:text-xl md:text-2xl select-none">
      <h1 className={`font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</h1>
      <h1 className={`font-bold ${isToday ? "text-blue-600" : ""}`}>{date}</h1>
    </div>
  );
};

const HoursAgenda = () => (
  <div className="w-full h-full">
    <div className="grid grid-cols-1 grid-rows-24 w-full bg-white rounded-xl select-none">
      {Array.from({ length: FULL_DAY_NIGHT_HOURS }).map((_, index) => (
        <div key={index} className="border border-gray-300 min-h-10"></div>
      ))}
    </div>
  </div>
);

const HoursIndicator = () => (
  <div className="flex flex-col">
    <div className="grid grid-rows-24 w-11 sm:w-16">
      {Array.from({ length: FULL_DAY_NIGHT_HOURS }).map((_, hour) => (
        <div
          key={hour}
          className="flex items-start justify-end pr-1 sm:pr-2 font-medium text-xs sm:text-sm text-gray-600 h-10 select-none"
        >
          {formatHourInTwelveHourFormat(hour)}
        </div>
      ))}
    </div>
  </div>
);

export default DayCalendarPage;
