import { create } from "zustand";
import { DEFAULT_NAVIGATION_ROUTE } from "../constants";

interface NavigationStore {
    currentRoute: string ;
    setCurrentRoute: (route: string) => void;
}

const useNavigationStore = create<NavigationStore>(set => ({
    currentRoute: DEFAULT_NAVIGATION_ROUTE,
    setCurrentRoute: (newRoute:string) => set({currentRoute: newRoute}),
}));

export default useNavigationStore;