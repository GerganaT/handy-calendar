import CurrentNavigationPage from "@/navigation/CurrentNavigationPage";
import NavigationDropdown from "@/navigation/NavigationDropdown";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col items-center m-8">
        <NavigationDropdown />
        <CurrentNavigationPage />
      </div>
    </>
  );
};

export default HomePage;
