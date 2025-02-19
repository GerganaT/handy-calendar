import CalendarEntryUiState from "@/types/calendar/CalendarEntryUiState";
import { format, parse } from "date-fns";

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEK_DAYS_COUNT = 7;
export const FULL_DAY_NIGHT_HOURS = 24;
export const FIRST_DAY_OF_THE_MONTH = 1;
export const MINUTES_IN_AN_HOUR = 60;
export const WEEK_START_DAY_INDEX = 0;

export const getDateDetails = (date: Date):CalendarEntryUiState => {
    const providedDate = new Date(date);
    const day = WEEK_DAYS[providedDate.getDay()];
    const formattedDate = formatDate(providedDate.getDate());
    return { day,
      date: formattedDate,
      month: getCurrentMonthShortText(providedDate),
      year: providedDate.getFullYear(),
      events: [],
     };
  };

export const getWeekDates = (date:Date): CalendarEntryUiState[] => {
    const selectedDate = new Date(date);
    const startOfWeek = selectedDate.getDate() - selectedDate.getDay();
    const week: CalendarEntryUiState[] = [];
  
    for (let i = 0; i < WEEK_DAYS_COUNT; i++) {
      const weekDate = new Date(selectedDate);
      weekDate.setDate(startOfWeek + i);
      const day = WEEK_DAYS[i];
      const formattedDate = formatDate(weekDate.getDate());
      week.push({ day, date: formattedDate,
         month: getCurrentMonthShortText(weekDate),
         year: weekDate.getFullYear(),
         events: [],
         });
    }
   
    return week;
  };

  export const getMonthDates = (selectedDate:Date): CalendarEntryUiState[] => {
   
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const currentMonthDates =  getCurrentMonthDates(
      daysInMonth,
      year,
       month,
       selectedDate,
      );
    
    const previousMonthDates = getPreviousMonthDates(
      year,
       month,
       selectedDate,
      );
    
    const nextMonthDates = getNextMonthDates(
      daysInMonth,
      year,
       month,
       selectedDate,
       previousMonthDates,
       currentMonthDates,
      );
    
    const totalDays = [
      ...previousMonthDates,
      ...currentMonthDates,
      ...nextMonthDates,
    ];
  
    return totalDays;
  };
  
  function getCurrentMonthDates(daysInMonth:number,
    year:number,
     month:number,
     selectedDate:Date,
    ) {
    const currentMonthDates: CalendarEntryUiState[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const day = WEEK_DAYS[date.getDay()];
      const formattedDate = formatDate(i);
      currentMonthDates.push({ 
        day,
        date: formattedDate,
        month: getCurrentMonthShortText(selectedDate),
        year: year,
        events: [],
       });
    }
    return currentMonthDates;
  }

  function getPreviousMonthDates(year:number,
     month:number,
     selectedDate:Date,
    ){
     const prevMonthDates: CalendarEntryUiState[] = [];
     const prevMonthLastDay = new Date(year, month, 0).getDate();
     const firstDayOfMonth = new Date(year, month, 1).getDay();
     const previousMonthYear = month === 0 ? year -1: year ;
     for (let i = firstDayOfMonth - 1; i >= 0; i--) {
       const day = WEEK_DAYS[i];
       const date = prevMonthLastDay - (firstDayOfMonth - 1 - i);
       prevMonthDates.push({ day,
         date: formatDate(date),
         month: getPreviousMonthText(selectedDate),
         year: previousMonthYear,
         events: []
     });
    }
     return prevMonthDates.reverse();
  }

  function getNextMonthDates(daysInMonth:number,
    year:number,
     month:number,
     selectedDate:Date,
     previousMonthDates:CalendarEntryUiState[],
     currentMonthDates:CalendarEntryUiState[],
    ){
    const nextMonthDates: CalendarEntryUiState[] = [];
    const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
    const nextMonthYear = month === 11 ? year +1: year ;
    const totalDaysInGrid = previousMonthDates.length + currentMonthDates.length + nextMonthDates.length;
    const requiredCells = 42;
    const remainingCells = requiredCells - totalDaysInGrid;
    for (let i = 1; i <= remainingCells; i++) {
      const day = WEEK_DAYS[(lastDayOfMonth + i) % WEEK_DAYS_COUNT];
      nextMonthDates.push({ day,
         date: formatDate(i),
         month: getNextMonthText(selectedDate),
         year: nextMonthYear,
         events: [],
         });
    }
    return nextMonthDates;
  }
  
  function getNextMonthText(selectedDate: Date){
    const prevDate = new Date(selectedDate);
    prevDate.setMonth(prevDate.getMonth() + 1);
    return  prevDate.toLocaleString('en-US', { month: 'short' });
  }

  function getPreviousMonthText(selectedDate: Date){
    const prevDate = new Date(selectedDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    return  prevDate.toLocaleString('en-US', { month: 'short' });
  }

  function getCurrentMonthShortText(selectedDate: Date){
    return format(new Date(selectedDate), 'MMM');
  }

  export const formatHourInTwelveHourFormat = (hour:number) => 
    { return hour === 0 ? "12 AM" : hour < 12 ?
         `${hour} AM` : hour === 12  ?
          "12 PM" : `${hour - 12} PM`}

 export const formatDate = (date: number) => date.toString();  

export const twelveHoursFormattedTime = (date: Date) => new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
}).format(new Date(date));

export const formattedLongDate = (date:Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  
  return date.toLocaleString("en-US", options);
}

export function isEventStartInCalendarEntry(
  startEvent: Date,
  entry: CalendarEntryUiState,
  ) {
 return WEEK_DAYS[startEvent.getDay()] === entry.day &&
  formatDate(startEvent.getDate()) === entry.date &&
  startEvent.getFullYear() === entry.year &&
  startEvent.toLocaleString("en-US", { month: "short" }) ===
    entry.month
}

export function getDateFromCalendarEntry ({date, year,month}: CalendarEntryUiState){
  return parse(`${date} ${month} ${year}`, 'd MMM yyyy', new Date());
}
