export default function TodayCard() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[now.getDay()];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-base font-semibold text-foreground">Today</h2>
      <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10">
        <p className="text-7xl font-light text-foreground tracking-tight">
          {month}/{day}
        </p>
        <p className="text-xl text-muted-foreground">{dayName}</p>
      </div>
    </div>
  );
}
