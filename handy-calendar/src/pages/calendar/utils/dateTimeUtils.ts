
export interface DateDetails{
    day:string;
    date:string;
    month?: string;
}

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEK_DAYS_COUNT = 7;
export const FULL_DAY_NIGHT_HOURS = 24;
export const FIRST_DAY_OF_THE_MONTH = 1;

export const getTodayDateDetails = ():DateDetails => {
    const today = new Date();
    const day = WEEK_DAYS[today.getDay()];
    const formattedDate = formatDate(today.getDate());
    return { day, date: formattedDate };
  };

export  const getWeekDates = (): DateDetails[] => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();
    const week: DateDetails[] = [];
  
    for (let i = 0; i < WEEK_DAYS_COUNT; i++) {
      const date = new Date(today.setDate(startOfWeek + i));
      const day = WEEK_DAYS[i];
      const formattedDate = formatDate(date.getDate());
      week.push({ day, date: formattedDate });
    }
    return week;
  };

  export const getMonthDates = (): DateDetails[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
    
  
    const currentMonthDates: DateDetails[] = [];
    const prevMonthDates: DateDetails[] = [];
    const nextMonthDates: DateDetails[] = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const day = WEEK_DAYS[date.getDay()];
      const formattedDate = formatDate(i);
      currentMonthDates.push({ day,
         date: formattedDate,
        month: getCurrentMonthText(),
       });
    }
  
const prevMonthLastDay = new Date(year, month, 0).getDate();
for (let i = firstDayOfMonth - 1; i >= 0; i--) {
  const day = WEEK_DAYS[i];
  const date = prevMonthLastDay - (firstDayOfMonth - 1 - i);
  prevMonthDates.push({ day,
     date: formatDate(date),
     month: getPreviousMonthText(),
     });
}

    const totalDaysInGrid = prevMonthDates.length + currentMonthDates.length + nextMonthDates.length;
    const requiredCells = 42;
    const remainingCells = requiredCells - totalDaysInGrid;
    for (let i = 1; i <= remainingCells; i++) {
      const day = WEEK_DAYS[(lastDayOfMonth + i) % WEEK_DAYS_COUNT];
      nextMonthDates.push({ day,
         date: formatDate(i),
         month: getNextMonthText(),
         });
    }

    const totalDays = [
      ...prevMonthDates.reverse(),
      ...currentMonthDates,
      ...nextMonthDates,
    ];
  
    return totalDays;
  };
  
  export const formatHourInTwelveHourFormat = (hour:number) => 
    { return hour === 0 ? "12 AM" : hour < 12 ?
         `${hour} AM` : hour === 12  ?
          "12 PM" : `${hour - 12} PM`}

  const formatDate = (date: number) => date.toString();  
  
  function getNextMonthText(){
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() + 1);
    return  prevDate.toLocaleString('en-US', { month: 'short' });
  }

  function getPreviousMonthText(){
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    return  prevDate.toLocaleString('en-US', { month: 'short' });
  }

  function getCurrentMonthText(){
    return new Date().toLocaleString('en-US', { month: 'short' });
  }
    