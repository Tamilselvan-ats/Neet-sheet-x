import { useMemo, useState } from 'react'
import { ProgressBar } from '../components/ProgressBar'
import { useApp } from '../context/AppContext'
import { neetStructure } from '../data/trackerData'
import { computeProgress } from '../utils/progress'

export function TrackerPage() {
  const { store, actions } = useApp()
  const [filters, setFilters] = useState({ subject: 'All', difficulty: 'All' })

  const subjects = useMemo(() => ['All', ...neetStructure.map((s) => s.subject)], [])

  const filtered = neetStructure.filter((s) => filters.subject === 'All' || s.subject === filters.subject)

  const totalTopics = neetStructure.flatMap((s) => s.chapters.flatMap((c) => c.topics)).length
  const totalDone = Object.values(store.topicCompletion).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold">NEET Portion Tracker</h1>
        <div className="flex gap-2">
          <select
            className="rounded-md border border-slate-700 bg-slate-900 p-2"
            value={filters.subject}
            onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-700 bg-slate-900 p-2"
            value={filters.difficulty}
            onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
          >
            {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <p className="mb-2 text-sm text-slate-300">Overall Progress: {computeProgress(totalDone, totalTopics)}%</p>
        <ProgressBar value={computeProgress(totalDone, totalTopics)} />
      </div>

      {filtered.map((subject) => {
        const subjectTopics = subject.chapters.flatMap((c) => c.topics)
        const subjectDone = subjectTopics.filter((t) => store.topicCompletion[t.id]).length
        return (
          <section key={subject.subject} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="text-xl font-semibold">{subject.subject}</h2>
            <ProgressBar value={computeProgress(subjectDone, subjectTopics.length)} />
            {subject.chapters.map((chapter) => {
              const chapterTopics = chapter.topics.filter(
                (t) => filters.difficulty === 'All' || t.difficulty === filters.difficulty
              )
              if (!chapterTopics.length) return null
              const chapterDone = chapterTopics.filter((t) => store.topicCompletion[t.id]).length
              return (
                <div key={chapter.name} className="space-y-2 rounded-lg border border-slate-700 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{chapter.name}</h3>
                    <span className="text-xs text-slate-400">{computeProgress(chapterDone, chapterTopics.length)}%</span>
                  </div>
                  <ProgressBar value={computeProgress(chapterDone, chapterTopics.length)} />
                  <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-400">
                          <th className="p-2">Done</th><th className="p-2">Topic</th><th className="p-2">Difficulty</th><th className="p-2">Resources</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapterTopics.map((topic) => (
                          <tr key={topic.id} className="border-t border-slate-800">
                            <td className="p-2">
                              <input type="checkbox" checked={!!store.topicCompletion[topic.id]} onChange={() => actions.toggleTopic(topic.id)} />
                            </td>
                            <td className="p-2">{topic.name}</td>
                            <td className="p-2">{topic.difficulty}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-2">
                                <a className="text-cyan-300" href={topic.textbookLink} target="_blank" rel="noreferrer">Textbook</a>
                                <a className="text-cyan-300" href={topic.youtubeLink} target="_blank" rel="noreferrer">YouTube</a>
                                {topic.notesLink && <a className="text-cyan-300" href={topic.notesLink}>Notes</a>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
