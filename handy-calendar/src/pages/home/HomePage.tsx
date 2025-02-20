import { Button } from "@/components/ui/button";
import ManageEventDialog from "@/components/ui/event/ManageEventDialog";
import { Toaster } from "@/components/ui/toaster";
import CurrentNavigationPage from "@/navigation/CurrentNavigationPage";
import NavigationDropdown from "@/navigation/NavigationDropdown";
import CalendarNavigator from "../../navigation/CalendarNavigator";

const HomePage = () => {
  return (
    <>
      <ManageEventDialog>
        <Button
          className={`select-none fixed bottom-1 right-1 lg:bottom-10 lg:right-10 bg-blue-400 hover:bg-blue-600 text-black text-sm sm:text-lg m-6 rounded-full shadow-lg lg:scale-150 z-50`}
        >
          Create Event
        </Button>
      </ManageEventDialog>
      <div className="flex flex-col items-center my-2 sm:my-8 sm:mx-8">
        <div className="flex flex-row p-1 sm:p-2">
          <CalendarNavigator />
          <NavigationDropdown />
        </div>
        <CurrentNavigationPage />
      </div>
      <Toaster />
    </>
  );
};

export default HomePage;
