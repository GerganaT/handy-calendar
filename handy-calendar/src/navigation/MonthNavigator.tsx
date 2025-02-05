import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMonthNavigationStore } from "./store/monthNavigationStore";

const MonthNavigator = () => {
  const { currentDate, prevMonth, nextMonth } = useMonthNavigationStore();

  return (
    <Card className="flex items-center justify-center w-50 pr-2 sm:w-80 text-sm sm:text-2xl border-none shadow-none">
      <Button variant="ghost" onClick={prevMonth}>
        <ChevronLeft />
      </Button>
      <span>{format(currentDate, "MMMM yyyy")}</span>
      <Button variant="ghost" onClick={nextMonth}>
        <ChevronRight />
      </Button>
    </Card>
  );
};

export default MonthNavigator;
