import { Toaster } from "@/components/ui/toaster";
import CreateEventFAB from "@/features/event/CreateEvent";
import CurrentNavigationPage from "@/navigation/CurrentNavigationPage";
import NavigationDropdown from "@/navigation/NavigationDropdown";
import MonthNavigator from "../../navigation/MonthNavigator";

const HomePage = () => {
  return (
    <>
      <CreateEventFAB />
      <div className="flex flex-col items-center m-8">
        <div className="flex flex-row p-2">
          <MonthNavigator />
          <NavigationDropdown />
        </div>
        <CurrentNavigationPage />
      </div>
      <Toaster />
    </>
  );
};

export default HomePage;
