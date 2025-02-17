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
          className={`fixed bottom-5 right-5 sm:bottom-10 sm:right-10 bg-blue-400 hover:bg-blue-600 text-black text-sm sm:text-lg m-6 rounded-full shadow-lg sm:scale-150 z-50`}
        >
          Create Event
        </Button>
      </ManageEventDialog>
      <div className="flex flex-col items-center m-8">
        <div className="flex flex-row p-2">
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
