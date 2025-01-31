import {
  formatHourInTwelveHourFormat,
  getTodayDateDetails,
} from "../utils/dateTimeUtils";

const DayCalendarPage = () => {
  return (
    <div className="flex flex-col w-full rounded-xl p-4 m-4 bg-blue-100">
      <DateHeader />
      <div className="flex w-full h-full">
        <HoursIndicator />
        <HoursAgenda />
      </div>
    </div>
  );
};

export default DayCalendarPage;

const DateHeader = () => {
  const todayDateDetails = getTodayDateDetails();
  return (
    <div className="flex ps-16 items-start flex-col py-2 text-lg sm:text-xl md:text-2xl">
      <h1 className="font-medium">{todayDateDetails.day}</h1>
      <h1 className="font-bold">{todayDateDetails.date}</h1>
    </div>
  );
};

const HoursAgenda = () => (
  <div className="w-full h-full">
    <div className="grid grid-cols-1 grid-rows-24 w-full bg-white rounded-xl">
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className="border border-gray-300 min-h-10"></div>
      ))}
    </div>
  </div>
);

const HoursIndicator = () => (
  <div className="flex flex-col">
    <div className="grid grid-rows-24 w-16">
      {Array.from({ length: 24 }).map((_, hour) => (
        <div
          key={hour}
          className="flex items-end justify-end pr-2 font-medium text-sm text-gray-600 h-10"
        >
          {formatHourInTwelveHourFormat(hour)}
        </div>
      ))}
    </div>
  </div>
);
