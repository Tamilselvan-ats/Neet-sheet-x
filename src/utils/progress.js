export function computeProgress(completed, total) {
  if (!total) return 0
  return Math.round((completed / total) * 100)
}

export function flattenTopics(structure) {
  return structure.flatMap((subject) =>
    subject.chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({
        ...topic,
        subject: subject.subject,
        chapter: chapter.name
      }))
    )
  )
}
