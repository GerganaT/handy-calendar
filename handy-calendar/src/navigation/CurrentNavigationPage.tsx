import Routes from "@/navigation/Routes";
import useNavigationStore from "@/navigation/store/pageNavigationStore";

const CurrentNavigationPage = () => {
  const { currentRoute } = useNavigationStore();

  return Routes[currentRoute];
};

export default CurrentNavigationPage;
