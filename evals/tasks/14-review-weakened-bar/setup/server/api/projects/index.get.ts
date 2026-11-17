export default defineEventHandler(() => {
  // eslint-disable-next-line no-console -- temporary log requested by the client to count API calls during the demo, remove after 2026-12-01
  console.info('projects listed')
  return sortByYearDesc(projects).map(({ id, title, year }) => ({ id, title, year }))
})
