import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useQuizEngine } from '../hooks/useQuizEngine'

const defaultFilters = { subject: 'All', chapter: 'All', topic: 'All', difficulty: 'All', year: 'All', count: 10 }

export function QuizPage() {
  const { store, actions } = useApp()
  const [filters, setFilters] = useState(defaultFilters)
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60 * 30)
  const [result, setResult] = useState(null)

  const questions = useMemo(() => {
    let q = [...store.questionBank]
    Object.entries(filters).forEach(([k, v]) => {
      if (['count'].includes(k) || v === 'All') return
      q = q.filter((item) => String(item[k]) === String(v))
    })
    return q.slice(0, Math.min(Number(filters.count), 180))
  }, [filters, store.questionBank])

  const quiz = useQuizEngine(questions)

  useEffect(() => {
    if (!started || result) return undefined
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [started, result])

  useEffect(() => {
    if (timeLeft === 0 && started && !result) handleSubmit()
  }, [timeLeft])

  const unique = (field) => ['All', ...new Set(store.questionBank.map((q) => q[field]).filter(Boolean))]

  function handleSubmit() {
    const weakMap = {}
    questions.forEach((q) => {
      if (quiz.selected[q.id] !== q.answer) weakMap[q.topic] = (weakMap[q.topic] || 0) + 1
    })
    const weakTopics = Object.keys(weakMap)
    const payload = { ...quiz.stats, weakTopics, ts: Date.now() }
    setResult(payload)
    actions.saveQuizResult(payload)
  }

  if (result) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Quiz Result</h1>
        <p>Score: {result.correct}/{result.total}</p>
        <p>Correct: {result.correct} | Incorrect: {result.incorrect}</p>
        <div>
          <h2 className="font-semibold">Weak Topics</h2>
          <ul className="list-disc pl-5 text-slate-300">
            {result.weakTopics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-slate-950" onClick={() => { setStarted(false); setResult(null) }}>
          Start New Quiz
        </button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Quiz System</h1>
        <div className="grid gap-3 md:grid-cols-3">
          {['subject', 'chapter', 'topic', 'difficulty', 'year'].map((field) => (
            <select
              key={field}
              className="rounded-md border border-slate-700 bg-slate-900 p-2"
              value={filters[field]}
              onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value }))}
            >
              {unique(field).map((v) => <option key={v}>{v}</option>)}
            </select>
          ))}
          <input
            className="rounded-md border border-slate-700 bg-slate-900 p-2"
            type="number"
            max={180}
            min={1}
            value={filters.count}
            onChange={(e) => setFilters((f) => ({ ...f, count: e.target.value }))}
          />
        </div>
        <p className="text-sm text-slate-400">Filtered Questions: {questions.length}</p>
        <button className="rounded bg-cyan-500 px-4 py-2 text-slate-950" onClick={() => setStarted(true)} disabled={!questions.length}>
          Start Quiz
        </button>
      </div>
    )
  }

  const current = quiz.current
  if (!current) return <p>No questions found for selected filters.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Question {quiz.index + 1}/{questions.length}</h1>
        <p className="rounded bg-slate-800 px-3 py-1">⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <p className="mb-3">{current.question}</p>
        {current.image && <img src={current.image} alt="question" className="mb-3 max-h-56 rounded" />}
        <div className="space-y-2">
          {current.options.map((op, idx) => (
            <label key={op} className="flex cursor-pointer items-center gap-2 rounded border border-slate-700 p-2">
              <input
                type="radio"
                checked={quiz.selected[current.id] === idx}
                onChange={() => quiz.setSelected((s) => ({ ...s, [current.id]: idx }))}
              />
              <span>{op}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-slate-700 px-3 py-2" onClick={() => quiz.setReview((r) => ({ ...r, [current.id]: !r[current.id] }))}>
          {quiz.review[current.id] ? 'Unmark Review' : 'Mark for Review'}
        </button>
        <button className="rounded bg-slate-700 px-3 py-2" onClick={() => quiz.setIndex((i) => Math.max(i - 1, 0))}>Previous</button>
        <button className="rounded bg-slate-700 px-3 py-2" onClick={() => quiz.setIndex((i) => Math.min(i + 1, questions.length - 1))}>Next</button>
        <button className="rounded bg-cyan-500 px-3 py-2 text-slate-950" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}
