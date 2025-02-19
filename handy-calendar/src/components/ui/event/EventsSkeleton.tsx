import { Skeleton } from "../skeleton";

const EventsSkeleton = () => (
  <div className="relative h-full px-1 ">
    {[...Array(3)].map((_, eventIndex) => {
      const randomSkeletonTopPosition = Math.floor(Math.random() * 80);
      const randomSkeletonHeight = Math.floor(Math.random() * 10) + 10;
      const randomSkeletonStackIndex = eventIndex;
      const randomSkeletonWidth = Math.max(
        95 - randomSkeletonStackIndex * 20,
        40
      );

      return (
        <Skeleton
          key={eventIndex}
          className="absolute rounded-md bg-blue-200"
          style={{
            background: `bg-white`,
            top: `${randomSkeletonTopPosition}%`,
            height: `${randomSkeletonHeight}%`,
            width: `${randomSkeletonWidth}%`,
            transform: `translateZ(${randomSkeletonStackIndex * 2}px)`,
            zIndex: randomSkeletonStackIndex + 1,
          }}
        />
      );
    })}
  </div>
);

export default EventsSkeleton;
