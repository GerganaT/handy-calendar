import { useMonthNavigationStore } from "@/navigation/store/monthNavigationStore";
import { useMemo } from "react";
import {
  DateDetails,
  FIRST_DAY_OF_THE_MONTH,
  getMonthDates,
  WEEK_DAYS,
  WEEK_DAYS_COUNT,
} from "../utils/dateTimeUtils";

const MonthCalendarPage = () => {
  const { currentDate } = useMonthNavigationStore();
  const totalDays = useMemo(() => getMonthDates(currentDate), [currentDate]);

  return (
    <div className="rounded-xl overflow-hidden border p-4 mt-8 h-screen w-full bg-blue-100">
      <div className="grid grid-cols-7 overflow-clip h-full rounded-xl">
        {totalDays.length > 0 &&
          totalDays.map((dateDetails, index) => (
            <DateElement details={dateDetails} cellIndex={index} key={index} />
          ))}
      </div>
    </div>
  );
};

export default MonthCalendarPage;

interface DateHeaderProps {
  details: DateDetails;
  cellIndex: number;
}

const DateElement = ({ details, cellIndex }: DateHeaderProps) => {
  return (
    <div className="flex items-center flex-col py-2 text-lg sm:text-xl md:text-2xl border bg-white">
      {cellIndex < WEEK_DAYS_COUNT && (
        <h1 className="font-semibold">{WEEK_DAYS[cellIndex]}</h1>
      )}
      <h1 className="font-normal">
        {details.date === `${FIRST_DAY_OF_THE_MONTH}`
          ? `${details.month} ${details.date}`
          : details.date}
      </h1>
    </div>
  );
};
