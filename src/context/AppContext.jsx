import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { sampleQuestions } from '../data/sampleQuestions'
import { safeLoad, saveStore } from '../utils/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [store, setStore] = useState(() => safeLoad(sampleQuestions))

  useEffect(() => {
    saveStore(store)
  }, [store])

  const actions = useMemo(
    () => ({
      toggleTopic: (topicId) => {
        setStore((prev) => ({
          ...prev,
          topicCompletion: {
            ...prev.topicCompletion,
            [topicId]: !prev.topicCompletion[topicId]
          }
        }))
      },
      setTopicNote: (topicId, note) => {
        setStore((prev) => ({ ...prev, topicNotes: { ...prev.topicNotes, [topicId]: note } }))
      },
      saveQuizResult: (result) => {
        setStore((prev) => ({
          ...prev,
          lastQuizResult: result,
          quizAttempts: [result, ...prev.quizAttempts].slice(0, 50),
          activeQuiz: null
        }))
      },
      setActiveQuiz: (quiz) => setStore((prev) => ({ ...prev, activeQuiz: quiz })),
      mergeQuestionBank: (questions) => {
        setStore((prev) => ({ ...prev, questionBank: [...prev.questionBank, ...questions].slice(0, 1000) }))
      }
    }),
    []
  )

  return <AppContext.Provider value={{ store, actions }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
