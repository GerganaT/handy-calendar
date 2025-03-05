import { getTimePositionOffset } from "@/pages/calendar/utils/calendarUtils";
import { useEffect, useState } from "react";

const REFRESH_RATE_IN_MILLISECONDS = 300_000;
const VISIBILITY_CHANGE_LISTENER_TYPE = "visibilitychange";

const usePositionOffset = () => {
  const [positionOffset, setPositionOffset] = useState(
    getTimePositionOffset(new Date())
  );

  useEffect(() => {
    const refreshPositionInterval = setInterval(() => {
      setPositionOffset(getTimePositionOffset(new Date()));
    }, REFRESH_RATE_IN_MILLISECONDS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setPositionOffset(getTimePositionOffset(new Date()));
      }
    };

    document.addEventListener(
      VISIBILITY_CHANGE_LISTENER_TYPE,
      handleVisibilityChange
    );

    return () => {
      clearInterval(refreshPositionInterval);
      document.removeEventListener(
        VISIBILITY_CHANGE_LISTENER_TYPE,
        handleVisibilityChange
      );
    };
  }, []);

  return positionOffset;
};

export default usePositionOffset;
