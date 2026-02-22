import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const optionRegex = /^\s*([A-D])[\).:-]\s*(.+)$/i

export async function parsePdfToQuestions(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let p = 1; p <= pdf.numPages; p += 1) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    fullText += `${content.items.map((it) => it.str).join(' ')}\n`
  }

  const blocks = fullText
    .split(/\n(?=\d+[).]\s)/)
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 180)

  return blocks.map((block, index) => {
    const lines = block.split(/\s{2,}|\n/).map((l) => l.trim()).filter(Boolean)
    const questionLine = lines[0]?.replace(/^\d+[).]\s*/, '') || `Question ${index + 1}`
    const options = []

    lines.forEach((line) => {
      const match = line.match(optionRegex)
      if (match) options.push(match[2])
    })

    const answerMatch = block.match(/Answer\s*[:=-]\s*([A-D])/i)
    const answer = answerMatch ? answerMatch[1].toUpperCase().charCodeAt(0) - 65 : 0

    return {
      id: `pdf-${Date.now()}-${index}`,
      subject: 'Imported',
      chapter: 'Imported PDF',
      topic: 'Imported Topic',
      difficulty: 'Medium',
      question: questionLine,
      image: '',
      options: options.length === 4 ? options : ['Option A', 'Option B', 'Option C', 'Option D'],
      answer,
      year: new Date().getFullYear(),
      notesLink: '',
      videoLink: ''
    }
  })
}
