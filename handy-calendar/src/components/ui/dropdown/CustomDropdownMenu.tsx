import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

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
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 select-none",
          stylingClassMenuTrigger
        )}
      >
        {defaultValue}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={stylingClassMenuContent}>
        {menuItems.map((menuItem) => (
          <DropdownMenuItem
            onClick={() => onOptionClick(menuItem)}
            key={menuItem}
            className="select-none cursor-pointer"
          >
            {menuItem}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdownMenu;
