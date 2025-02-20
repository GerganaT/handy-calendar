import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { useCalendarNavigationStore } from "./store/calendarNavigationStore";
import useNavigationStore from "./store/pageNavigationStore";
import { getCalendarNavigatorText } from "./utils";

const CalendarNavigator = () => {
  const { currentDate, prevPeriod, nextPeriod, resetToToday } =
    useCalendarNavigationStore();

  const { currentRoute } = useNavigationStore();

  const navigatorText = useMemo(
    () => getCalendarNavigatorText(currentRoute, currentDate),
    [currentRoute, currentDate]
  );

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        onClick={resetToToday}
        className="text-sm sm:text-2xl font-normal hover:bg-blue-400 bg-blue-200 py-6 rounded-xl w-30 select-none"
      >
        Today
      </Button>

      <Card className="flex items-center justify-center w-50  sm:w-80 text-sm sm:text-2xl border-none shadow-none">
        <Button variant="ghost" onClick={() => prevPeriod(currentRoute)}>
          <ChevronLeft />
        </Button>
        <span className="text-center">{navigatorText}</span>
        <Button variant="ghost" onClick={() => nextPeriod(currentRoute)}>
          <ChevronRight />
        </Button>
      </Card>
    </div>
  );
};

export default CalendarNavigator;
