import { endOfWeek, format, isSameMonth, isSameYear, startOfWeek } from "date-fns";

import { WEEK_START_DAY_INDEX } from "@/pages/calendar/utils/calendarUtils";
import { DAILY_ROUTE, WEEKLY_ROUTE } from "./constants";

export function getCalendarNavigatorText(currentRoute:string,currentDate: Date) {

    switch (currentRoute) {
        case WEEKLY_ROUTE:{
            
            const weekStart = startOfWeek(currentDate, { weekStartsOn: WEEK_START_DAY_INDEX });
            const weekEnd = endOfWeek(currentDate, { weekStartsOn: WEEK_START_DAY_INDEX });

            switch(true){
              case !isSameMonth(weekStart, weekEnd) && isSameYear(weekStart, weekEnd): return `${format(weekStart, "MMM")} - ${format(weekEnd, "MMM yyyy")}`;
              case !isSameYear(weekStart, weekEnd):  return `${format(weekStart, "MMM yyyy")} - ${format(
                weekEnd,
                "MMM yyyy"
              )}`;
              default: return format(currentDate, "MMMM yyyy");
            }
        }
        case DAILY_ROUTE:{
          return format(currentDate,'MMMM d, yyyy' );
      }
        default: return format(currentDate, "MMMM yyyy");
    }
    }