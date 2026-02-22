import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { PdfImportPage } from './pages/PdfImportPage'
import { QuizPage } from './pages/QuizPage'
import { TrackerPage } from './pages/TrackerPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/pdf" element={<PdfImportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
