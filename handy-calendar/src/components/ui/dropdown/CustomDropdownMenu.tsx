import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface DropdownMenuProps {
  menuItems: string[];
  defaultValue: string;
  onOptionClick: (value: string) => void;
}

const CustomDropdownMenu = ({
  menuItems,
  defaultValue,
  onOptionClick,
}: DropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{defaultValue}</DropdownMenuTrigger>
      <DropdownMenuContent>
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
