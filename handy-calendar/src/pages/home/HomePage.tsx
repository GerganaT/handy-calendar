import CurrentNavigationPage from "@/navigation/CurrentNavigationPage";
import NavigationDropdown from "@/navigation/NavigationDropdown";
import { useMonthNavigationStore } from "@/navigation/store/monthNavigationStore";
import MonthNavigator from "../../navigation/MonthNavigator";

const HomePage = () => {
  const { currentDate, prevMonth, nextMonth } = useMonthNavigationStore();
  return (
    <>
      <div className="flex flex-col items-center m-8">
        <div className="flex flex-row p-2">
          <MonthNavigator
            currentDate={currentDate}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
          />
          <NavigationDropdown />
        </div>
        <CurrentNavigationPage />
      </div>
    </>
  );
};

export default HomePage;
