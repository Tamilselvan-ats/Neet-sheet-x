import { useMemo, useState } from 'react'

export function useQuizEngine(questions) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState({})
  const [review, setReview] = useState({})

  const current = questions[index]

  const stats = useMemo(() => {
    let correct = 0
    questions.forEach((q) => {
      if (selected[q.id] === q.answer) correct += 1
    })
    return {
      total: questions.length,
      attempted: Object.keys(selected).length,
      correct,
      incorrect: Object.keys(selected).length - correct
    }
  }, [questions, selected])

  return {
    current,
    index,
    setIndex,
    selected,
    setSelected,
    review,
    setReview,
    stats
  }
}
