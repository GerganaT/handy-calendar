
interface DateDetails{
    day:string;
    date:string;
}

export const getTodayDateDetails = ():DateDetails => {
    const today = new Date();
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][today.getDay()];
    const formattedDate = today.getDate().toString().padStart(2, "0");
    return { day, date: formattedDate };
  };


export  const getWeekDates = (): DateDetails[] => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();
    const week: DateDetails[] = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.setDate(startOfWeek + i));
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
      const formattedDate = date.getDate().toString().padStart(2, "0");
      week.push({ day, date: formattedDate });
    }
    return week;
  };

  export const formatHourInTwelveHourFormat = (hour:number) => 
    { return hour === 0 ? "12 AM" : hour < 12 ?
         `${hour} AM` : hour === 12  ?
          "12 PM" : `${hour - 12} PM`}
    