export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const index = projects.findIndex(p => p.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
  }
  projects.splice(index, 1)
  return { ok: true }
})
