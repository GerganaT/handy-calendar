import { Skeleton } from "@/components/ui/skeleton";
import { useMonthNavigationStore } from "@/navigation/store/monthNavigationStore";
import { useMemo, useState } from "react";
import {
  DateDetails,
  FIRST_DAY_OF_THE_MONTH,
  getMonthDates,
  WEEK_DAYS,
  WEEK_DAYS_COUNT,
} from "../utils/dateTimeUtils";

const LOADING_DURATION_IN_SECONDS = 1000;
const MonthCalendarPage = () => {
  const { currentDate } = useMonthNavigationStore();

  const [shouldShowLoadingSkeleton, setShouldShowLoadingSkeleton] =
    useState(true);

  const showLoadingSkeleton = () => {
    setShouldShowLoadingSkeleton(true);
    setTimeout(() => {
      setShouldShowLoadingSkeleton(false);
    }, LOADING_DURATION_IN_SECONDS);
  };

  const totalDays = useMemo(() => {
    showLoadingSkeleton();
    return getMonthDates(currentDate);
  }, [currentDate]);

  return (
    <div className="rounded-xl overflow-hidden border p-4 mt-8 h-screen w-full bg-blue-100">
      <div className="grid grid-cols-7 overflow-clip h-full rounded-xl">
        {shouldShowLoadingSkeleton
          ? Array.from({ length: 42 }).map((_, index) => (
              <DateElementSkeleton key={index} />
            ))
          : totalDays.length > 0 &&
            totalDays.map((dateDetails, index) => (
              <DateElement
                details={dateDetails}
                cellIndex={index}
                key={index}
              />
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

const DateElementSkeleton = () => (
  <div className="flex items-center flex-col py-2 border bg-white">
    <Skeleton className="w-1/4 h-6 mb-1" />
    <Skeleton className="w-1/12 h-6 mb-4" />
    <Skeleton className="w-1/2 h-4 mb-1" />
    <Skeleton className="w-1/2 h-4 mb-1" />
    <Skeleton className="w-1/2 h-4" />
  </div>
);
