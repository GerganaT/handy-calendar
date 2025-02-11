import { useCalendarNavigationStore } from "@/navigation/store/calendarNavigationStore";
import { useEffect, useMemo } from "react";
import {
  formatHourInTwelveHourFormat,
  FULL_DAY_NIGHT_HOURS,
  getWeekDates,
  WEEK_DAYS_COUNT,
} from "../utils/calendarUtils";

const WeekCalendarPage = () => {
  return (
    <div className="flex flex-col w-full  rounded-xl p-4 m-4 bg-blue-100">
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col">
          <div className="h-10 sm:h-20"></div>
          <HoursIndicator />
        </div>
        <div className="w-full h-full">
          <WeekDatesHeader />
          <WeekdaysAgenda />
        </div>
      </div>
    </div>
  );
};

export default WeekCalendarPage;

const HoursIndicator = () => (
  <div className="grid grid-rows-24 w-16">
    {Array.from({ length: FULL_DAY_NIGHT_HOURS }).map((_, hour) => (
      <div
        key={hour}
        className="flex items-center justify-end pr-2 font-medium text-sm text-gray-600  h-10"
      >
        {formatHourInTwelveHourFormat(hour)}
      </div>
    ))}
  </div>
);

const WeekDatesHeader = () => {
  const { currentDate, initializeWeeklyDate } = useCalendarNavigationStore();

  useEffect(() => initializeWeeklyDate(), []);

  const weekDates = useMemo(() => {
    return getWeekDates(currentDate);
  }, [currentDate]);

  return (
    <div className="grid grid-cols-7 text-center bg-blue-100">
      {weekDates.length > 0 &&
        weekDates.map(({ day, date }, index) => (
          <div
            key={index}
            className="flex flex-col text-sm sm:text-base md:text-lg lg:text-xl pb-2"
          >
            <span className="font-medium">{day}</span>
            <span className="font-bold">{date}</span>
          </div>
        ))}
    </div>
  );
};

const WeekdaysAgenda = () => (
  <div className="grid grid-cols-7 grid-rows-24 w-full bg-white rounded-xl">
    {Array.from({ length: WEEK_DAYS_COUNT * FULL_DAY_NIGHT_HOURS }).map(
      (_, index) => (
        <div key={index} className="border border-gray-300 min-h-10"></div>
      )
    )}
  </div>
);
