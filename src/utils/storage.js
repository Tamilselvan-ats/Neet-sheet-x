const STORAGE_KEY = 'neet-tracker-v1'

export const defaultStore = {
  version: 1,
  topicCompletion: {},
  topicNotes: {},
  questionBank: [],
  quizAttempts: [],
  lastQuizResult: null,
  activeQuiz: null
}

export function safeLoad(initialQuestionBank = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { ...defaultStore, questionBank: initialQuestionBank }
    }
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== 1) {
      return { ...defaultStore, questionBank: initialQuestionBank }
    }
    return {
      ...defaultStore,
      ...parsed,
      questionBank: parsed.questionBank?.length ? parsed.questionBank : initialQuestionBank
    }
  } catch {
    return { ...defaultStore, questionBank: initialQuestionBank }
  }
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export { STORAGE_KEY }
