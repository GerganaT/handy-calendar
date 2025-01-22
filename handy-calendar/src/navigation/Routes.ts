import DayCalendarPage from "@/pages/calendar/day/DayCalendarPage";
import MonthCalendarPage from "@/pages/calendar/month/MonthCalendarPage";
import WeekCalendarPage from "@/pages/calendar/week/WeekCalendarPage";

const Routes: {[route: string]: JSX.Element} = {
    Day: DayCalendarPage(),
    Week: WeekCalendarPage(),
    Month: MonthCalendarPage(),
}

export default Routes