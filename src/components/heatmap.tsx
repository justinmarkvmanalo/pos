type HeatmapEntry = {
  date: string;
  value: number;
};

const intensityClasses = [
  "bg-[#efe2d0]",
  "bg-[#dcb79f]",
  "bg-[#cb875f]",
  "bg-[#a7522d]",
  "bg-[#6f2f16]",
];

export function Heatmap({ entries }: { entries: HeatmapEntry[] }) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-2 sm:grid-cols-9 lg:grid-cols-7 xl:grid-cols-9">
        {entries.map((entry) => (
          <div key={entry.date} className="flex flex-col gap-1">
            <div
              className={`aspect-square rounded-[0.55rem] border border-white/40 ${
                intensityClasses[entry.value]
              }`}
              title={`${entry.date}: ${entry.value} habits`}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-ink-soft">
        <span>Lower</span>
        <span>Higher</span>
      </div>
    </div>
  );
}
