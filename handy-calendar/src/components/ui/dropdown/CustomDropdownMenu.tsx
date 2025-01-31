import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface DropdownMenuProps {
  menuItems: string[];
  defaultValue: string;
  stylingClassMenuTrigger?: string;
  stylingClassMenuContent?: string;
  onOptionClick: (value: string) => void;
}

const CustomDropdownMenu = ({
  menuItems,
  defaultValue,
  stylingClassMenuTrigger = "",
  stylingClassMenuContent = "",
  onOptionClick,
}: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={stylingClassMenuTrigger}>
        {defaultValue}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={stylingClassMenuContent}>
        {menuItems.map((menuItem) => (
          <DropdownMenuItem
            onClick={() => onOptionClick(menuItem)}
            key={menuItem}
          >
            {menuItem}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdownMenu;
