import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { parsePdfToQuestions } from '../utils/pdfParser'

export function PdfImportPage() {
  const { actions } = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    try {
      const parsed = await parsePdfToQuestions(file)
      setItems(parsed)
    } finally {
      setLoading(false)
    }
  }

  const updateItem = (idx, field, value) => {
    setItems((prev) => prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">PDF → Quiz Generator</h1>
      <input type="file" accept="application/pdf" onChange={handleUpload} className="block w-full rounded border border-slate-700 bg-slate-900 p-2" />
      {loading && <p>Parsing PDF...</p>}
      {!!items.length && (
        <>
          <p className="text-sm text-slate-400">Preview extracted questions (max 180). Edit before saving.</p>
          <div className="space-y-2">
            {items.slice(0, 20).map((q, idx) => (
              <div key={q.id} className="rounded border border-slate-800 bg-slate-900 p-3">
                <input className="w-full rounded bg-slate-800 p-2" value={q.question} onChange={(e) => updateItem(idx, 'question', e.target.value)} />
              </div>
            ))}
          </div>
          <button className="rounded bg-cyan-500 px-4 py-2 text-slate-950" onClick={() => actions.mergeQuestionBank(items)}>
            Save & Merge Questions
          </button>
        </>
      )}
      <p className="text-xs text-slate-500">Note: Complex scanned PDFs may need OCR pre-processing before upload.</p>
    </div>
  )
}
