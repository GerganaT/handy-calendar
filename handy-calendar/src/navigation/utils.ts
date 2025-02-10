import { endOfWeek, format, isSameMonth, isSameYear, startOfWeek } from "date-fns";

import { WEEKLY_ROUTE } from "./constants";

export function getCalendarNavigatorText(currentRoute:string,currentDate: Date) {

    // fall-through behavior is intentional for case WEEKLY_ROUTE to avoid code repetition
    switch (currentRoute) {
        case WEEKLY_ROUTE:{
            
            const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
            const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      
            if (!isSameMonth(weekStart, weekEnd) && isSameYear(weekStart, weekEnd)) {
              return `${format(weekStart, "MMM")} - ${format(weekEnd, "MMM yyyy")}`;
            }
      
            if (!isSameYear(weekStart, weekEnd)) {
              return `${format(weekStart, "MMM yyyy")} - ${format(
                weekEnd,
                "MMM yyyy"
              )}`;
            }
        }
        default: return format(currentDate, "MMMM yyyy");
    }
    }