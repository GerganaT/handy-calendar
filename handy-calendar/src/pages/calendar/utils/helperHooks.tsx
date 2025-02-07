import { useState } from "react";

const LOADING_DURATION_IN_SECONDS = 1000;

export const useTriggerLoadingSkeleton = () => {
  const [shouldShowLoadingSkeleton, setShouldShowLoadingSkeleton] =
    useState(true);
  const showLoadingSkeleton = () => {
    setShouldShowLoadingSkeleton(true);
    setTimeout(() => {
      setShouldShowLoadingSkeleton(false);
    }, LOADING_DURATION_IN_SECONDS);
  };
  return { shouldShowLoadingSkeleton, showLoadingSkeleton };
};
