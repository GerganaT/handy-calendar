import { create } from "zustand";

interface NavigationStore {
    currentRoute: string ;
    setCurrentRoute: (route: string) => void;
}

const defaultNavigationRoute = "Month";

const useNavigationStore = create<NavigationStore>(set => ({
    currentRoute: defaultNavigationRoute,
    setCurrentRoute: (newRoute:string) => set({currentRoute: newRoute}),
}));

export default useNavigationStore;