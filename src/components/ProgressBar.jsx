export function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-800">
      <div className="h-2 rounded-full bg-cyan-400 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}
