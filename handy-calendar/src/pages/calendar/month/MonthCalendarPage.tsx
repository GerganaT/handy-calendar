const MonthCalendarPage = () => {
  return (
    <>
      <div className="rounded-xl overflow-hidden border p-4 mt-8 h-screen w-full bg-blue-100">
        <div className="grid grid-cols-7 overflow-clip h-full rounded-xl">
          {Array.from({ length: 31 }).map((_, index) => (
            <div key={index} className="border p-2 bg-white">
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthCalendarPage;
