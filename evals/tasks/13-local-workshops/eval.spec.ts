import { expect, test } from '@playwright/test'

// Every check reads the raw server HTML: no JavaScript runs, as for most AI crawlers.

const workshops = [
  { slug: 'lyon', city: /lyon/i, street: /rue Merci[eè]re/i, phoneEnd: '472000001' },
  { slug: 'nantes', city: /nantes/i, street: /quai de la Fosse/i, phoneEnd: '240000002' },
]

type JsonLdNode = Record<string, unknown>

function jsonLdNodes(html: string): JsonLdNode[] {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  return blocks.flatMap(([, json]) => {
    const data = JSON.parse(json ?? 'null') as JsonLdNode | JsonLdNode[] | null
    const roots = Array.isArray(data) ? data : data ? [data] : []
    return roots.flatMap(root => (Array.isArray(root['@graph']) ? (root['@graph'] as JsonLdNode[]) : [root]))
  })
}

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;| | /g, ' ')
}

for (const workshop of workshops) {
  test(`/ateliers/${workshop.slug} is indexable and describes the workshop`, async ({ request }) => {
    const response = await request.get(`/ateliers/${workshop.slug}`)
    expect(response.status()).toBe(200)
    const html = await response.text()

    const text = visibleText(html)
    expect(text).toMatch(workshop.street)
    expect(text.replace(/\D/g, '')).toContain(workshop.phoneEnd)

    const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? ''
    expect(title).toMatch(workshop.city)

    const description = html.match(/<meta[^>]*name="description"[^>]*>/)?.[0] ?? ''
    expect(description).toMatch(/content="[^"]{20,}"/)

    const business = jsonLdNodes(html).find(node => node.address && node.telephone)
    expect(business, 'a JSON-LD node with address and telephone').toBeTruthy()
    expect(JSON.stringify(business?.address)).toMatch(workshop.street)
    expect(String(business?.telephone).replace(/\D/g, '')).toContain(workshop.phoneEnd)
    expect(business?.openingHoursSpecification ?? business?.openingHours).toBeTruthy()
  })
}

test('/ateliers links to each workshop page with real links', async ({ request }) => {
  const response = await request.get('/ateliers')
  expect(response.status()).toBe(200)
  const html = await response.text()
  for (const { slug } of workshops) {
    expect(html).toMatch(new RegExp(`href="/ateliers/${slug}/?"`))
  }
})

test('an unknown workshop returns a real 404', async ({ request }) => {
  const response = await request.get('/ateliers/marseille')
  expect(response.status()).toBe(404)
})
