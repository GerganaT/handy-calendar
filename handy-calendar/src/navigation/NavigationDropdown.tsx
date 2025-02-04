import CustomDropdownMenu from "@/components/ui/dropdown/CustomDropdownMenu";

import Routes from "./Routes";
import useNavigationStore from "./store/pageNavigationStore";

const NavigationDropdown = () => {
  const menuItems = Object.keys(Routes);
  const { currentRoute, setCurrentRoute } = useNavigationStore();

  return (
    <CustomDropdownMenu
      menuItems={menuItems}
      defaultValue={currentRoute}
      stylingClassMenuTrigger=" text-sm sm:text-2xl hover:bg-blue-400 bg-blue-200 p-2 rounded-xl w-30"
      stylingClassMenuContent=" text-sm sm:text-2xl bg-blue-100 p-2 rounded-xl w-30"
      onOptionClick={(optionClicked) => setCurrentRoute(optionClicked)}
    />
  );
};

export default NavigationDropdown;
