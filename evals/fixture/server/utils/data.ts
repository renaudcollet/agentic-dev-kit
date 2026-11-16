export interface Project {
  id: number
  title: string
  year: number
  // HTML coming from the headless CMS. Not sanitized at the source.
  descriptionHtml: string
  model?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Vitrine Horlogerie',
    year: 2025,
    descriptionHtml: '<p>Une vitrine <strong>3D temps réel</strong> pour une collection de montres.</p>',
    model: '/models/watch.glb',
  },
  {
    id: 2,
    title: 'Campagne WebAR',
    year: 2026,
    descriptionHtml: '<p>Une expérience en réalité augmentée.</p><img src="x" onerror="alert(document.cookie)">',
  },
  {
    id: 3,
    title: 'Jeu concours',
    year: 2024,
    descriptionHtml: '<p>Un jeu navigateur avec <a href="javascript:alert(1)">règlement</a>.</p>',
  },
]

export interface Photo {
  id: number
  src: string
  alt: string
  width: number
  height: number
}

export const photos: Photo[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/id/${i % 1000}/600/400`,
  alt: `Photo de session numéro ${i + 1}`,
  width: 600,
  height: 400,
}))

export const newsletterEmails = new Set<string>()
