export default defineEventHandler(() => {
  return projects.map(({ id, title, year }) => ({ id, title, year }))
})
