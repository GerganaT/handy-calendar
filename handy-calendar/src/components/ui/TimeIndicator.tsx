import usePositionOffset from "@/hooks/use-position-offset";

const TimeIndicator = () => {
  const positionOffset = usePositionOffset();
  return (
    <div
      className="absolute w-full overflow-hidden z-40 flex flex-row items-center"
      style={{
        // position the element higher up to compensate for the rounded indicator piece pushing the whole element lower
        top: `${positionOffset - 0.5}%`,
      }}
    >
      <div className="rounded-full bg-red-500 size-2"></div>
      <div className="h-0.5 bg-red-500 w-full "></div>
    </div>
  );
};

export default TimeIndicator;
