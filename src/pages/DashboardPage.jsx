import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { useApp } from '../context/AppContext'
import { neetStructure } from '../data/trackerData'
import { computeProgress, flattenTopics } from '../utils/progress'

export function DashboardPage() {
  const { store } = useApp()
  const topics = useMemo(() => flattenTopics(neetStructure), [])
  const completed = topics.filter((t) => store.topicCompletion[t.id]).length
  const progress = computeProgress(completed, topics.length)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Topics" value={topics.length} />
        <StatCard label="Completed Topics" value={completed} />
        <StatCard label="Overall Progress" value={`${progress}%`} />
        <StatCard label="Last Quiz Score" value={store.lastQuizResult ? `${store.lastQuizResult.correct}/${store.lastQuizResult.total}` : 'N/A'} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-slate-950" to="/quiz">
          Quick Start Quiz
        </Link>
        {store.activeQuiz && (
          <Link className="rounded-md bg-slate-700 px-4 py-2" to="/quiz?resume=1">
            Resume Last Quiz
          </Link>
        )}
      </div>
    </div>
  )
}
