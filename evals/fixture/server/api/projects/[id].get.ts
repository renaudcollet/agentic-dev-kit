export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const project = projects.find(p => p.id === id)
  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
  }
  return project
})
