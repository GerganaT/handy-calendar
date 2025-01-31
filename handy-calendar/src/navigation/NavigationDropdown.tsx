import CustomDropdownMenu from "@/components/ui/dropdown/CustomDropdownMenu";

import Routes from "./Routes";
import useNavigationStore from "./store";

const NavigationDropdown = () => {
  const menuItems = Object.keys(Routes);
  const { currentRoute, setCurrentRoute } = useNavigationStore();

  return (
    <CustomDropdownMenu
      menuItems={menuItems}
      defaultValue={currentRoute}
      stylingClassMenuTrigger="text-2xl bg-blue-100 p-2 rounded-xl"
      stylingClassMenuContent="text-2xl bg-blue-100 p-2 rounded-xl"
      onOptionClick={(optionClicked) => setCurrentRoute(optionClicked)}
    />
  );
};

export default NavigationDropdown;
