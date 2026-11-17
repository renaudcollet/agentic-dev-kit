#!/usr/bin/env node
// Checks static assets against the budgets in assets-budget.json (project root).
// GLB files: file size, KTX2 textures, texture size, geometry compression,
// draw calls, meshes that could be merged, USDZ counterpart.
// Other files: size per extension. No dependencies: reads the GLB JSON chunk
// and image headers directly, so Draco or Meshopt decoders are not needed.
// Usage: node scripts/check-assets.mjs [path/to/assets-budget.json]
// Exit code 1 if an error-level rule fails; warnings never fail the build.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'

const configPath = resolve(process.argv[2] ?? 'assets-budget.json')
const config = JSON.parse(readFileSync(configPath, 'utf8'))
const root = dirname(configPath)
const glbRules = {
  maxTextureSize: 2048,
  requireKtx2: true,
  requireMeshCompression: true,
  maxDrawCalls: 100,
  requireUsdz: false,
  ...config.glb,
}
const maxKB = config.maxKB ?? {}

const findings = []
const report = (level, file, message) => findings.push({ level, file: relative(root, file), message })

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function readGlb(buffer) {
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB file')
  let offset = 12
  let json = null
  let bin = null
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset)
    const type = buffer.readUInt32LE(offset + 4)
    const chunk = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8'))
    if (type === 0x004e4942) bin = chunk
    offset += 8 + length
  }
  return { json, bin }
}

// Returns { width, height, scheme } or null when the format is not recognized.
function imageInfo(bytes) {
  if (bytes.length < 48) return null
  if (bytes.readUInt32BE(0) === 0x89504e47) return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  if (bytes.toString('latin1', 1, 4) === 'KTX' && bytes[5] === 0x32) {
    return { width: bytes.readUInt32LE(20), height: bytes.readUInt32LE(24), scheme: bytes.readUInt32LE(44) }
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2
    while (i + 9 < bytes.length) {
      if (bytes[i] !== 0xff) return null
      const marker = bytes[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5) }
      }
      i += 2 + bytes.readUInt16BE(i + 2)
    }
  }
  return null
}

function checkGlb(file, buffer) {
  const { json, bin } = readGlb(buffer)
  const used = new Set(json.extensionsUsed ?? [])

  // Textures: which image each one uses, and whether it is a normal map.
  const normalTextures = new Set((json.materials ?? []).map(m => m.normalTexture?.index).filter(i => i !== undefined))
  for (const [index, texture] of (json.textures ?? []).entries()) {
    const ktx2Source = texture.extensions?.KHR_texture_basisu?.source
    const image = json.images?.[ktx2Source ?? texture.source]
    if (!image) continue
    const name = image.name || texture.name || `texture ${index}`
    if (glbRules.requireKtx2 && ktx2Source === undefined) {
      report('error', file, `${name}: not KTX2 (gltf-transform etc1s / uastc)`)
    }
    const view = json.bufferViews?.[image.bufferView]
    const info = view && bin ? imageInfo(bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)) : null
    if (!info) continue
    if (Math.max(info.width, info.height) > glbRules.maxTextureSize) {
      report('error', file, `${name}: ${info.width}x${info.height}, max ${glbRules.maxTextureSize}`)
    }
    // KTX2 supercompression scheme 1 = BasisLZ (ETC1S): visible artifacts on normal maps.
    if (info.scheme === 1 && normalTextures.has(index)) {
      report('warning', file, `${name}: normal map in ETC1S, prefer UASTC`)
    }
  }

  if (glbRules.requireMeshCompression && !used.has('KHR_draco_mesh_compression') && !used.has('EXT_meshopt_compression')) {
    report('error', file, 'geometry not compressed (Draco or Meshopt)')
  }

  // Draw calls: one per primitive of each node that holds a mesh (GPU instancing counts once).
  let drawCalls = 0
  const materialsUsed = new Set()
  for (const node of json.nodes ?? []) {
    if (node.mesh === undefined) continue
    for (const primitive of json.meshes[node.mesh].primitives) {
      drawCalls++
      materialsUsed.add(primitive.material ?? -1)
    }
  }
  if (drawCalls > glbRules.maxDrawCalls) report('error', file, `${drawCalls} draw calls, max ${glbRules.maxDrawCalls}`)
  if (drawCalls > materialsUsed.size * 2) {
    report('warning', file, `${drawCalls} draw calls for ${materialsUsed.size} materials: static meshes could be merged (gltf-transform join) or instanced`)
  }

  if (glbRules.requireUsdz && !existsSync(join(dirname(file), `${basename(file, '.glb')}.usdz`))) {
    report('error', file, 'no USDZ counterpart for iOS AR Quick Look')
  }
}

for (const folder of config.paths ?? ['public']) {
  const dir = resolve(root, folder)
  if (!existsSync(dir)) {
    report('error', dir, 'folder not found')
    continue
  }
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase()
    const sizeKB = statSync(file).size / 1024
    if (maxKB[ext] !== undefined && sizeKB > maxKB[ext]) {
      report('error', file, `${Math.round(sizeKB)} KB, max ${maxKB[ext]} KB`)
    }
    if (ext === '.gltf') report('warning', file, 'use GLB (single binary file) rather than glTF')
    if (ext === '.glb') {
      try {
        checkGlb(file, readFileSync(file))
      }
      catch (error) {
        report('error', file, `unreadable: ${error.message}`)
      }
    }
  }
}

for (const { level, file, message } of findings) console.log(`${level === 'error' ? 'ERROR' : 'warn '}  ${file}  ${message}`)
const errors = findings.filter(f => f.level === 'error').length
console.log(`\n${errors} error(s), ${findings.length - errors} warning(s)`)
process.exit(errors ? 1 : 0)
