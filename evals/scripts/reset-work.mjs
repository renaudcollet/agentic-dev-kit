#!/usr/bin/env node
// Resets the evaluation working copy from the fixture.
//
// Usage:
//   node evals/scripts/reset-work.mjs --task 01-confirm-modal --mode with-kit
//   node evals/scripts/reset-work.mjs --task 01-confirm-modal --mode without-kit
//
// Steps: clean evals/work (node_modules is kept), copy the fixture, copy the kit's
// .claude/ when --mode with-kit, install or prune dependencies, create a baseline
// commit, then apply the task's overlay (left uncommitted).

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const evalsDir = resolve(here, '..')
const repoRoot = resolve(evalsDir, '..')
const fixtureDir = join(evalsDir, 'fixture')
const workDir = join(evalsDir, 'work')

// Kit files that are only used to run evaluations, never copied into a project.
const KIT_INTERNAL = ['skills/run-evals', 'agents/eval-grader']
const FIXTURE_SKIP = new Set(['node_modules', '.nuxt', '.output', '.data', 'test-results', 'playwright-report'])

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}

const taskId = arg('task')
const mode = arg('mode', 'with-kit')
if (!taskId) throw new Error('Missing --task <id>')
if (!['with-kit', 'without-kit'].includes(mode)) throw new Error('--mode must be with-kit or without-kit')

const taskDir = join(evalsDir, 'tasks', taskId)
if (!existsSync(join(taskDir, 'task.json'))) throw new Error(`Unknown task: ${taskId}`)
const task = JSON.parse(readFileSync(join(taskDir, 'task.json'), 'utf8'))

const run = (cmd, cwd = workDir) => execSync(cmd, { cwd, stdio: 'inherit' })
const toPosix = p => p.split(sep).join('/')

// 1. Clean the working copy, keeping node_modules
mkdirSync(workDir, { recursive: true })
for (const entry of readdirSync(workDir)) {
  if (entry !== 'node_modules') rmSync(join(workDir, entry), { recursive: true, force: true })
}

// 2. Copy the fixture
cpSync(fixtureDir, workDir, {
  recursive: true,
  filter: src => !FIXTURE_SKIP.has(relative(fixtureDir, src).split(sep)[0]),
})

// 3. Copy the kit when evaluating with it
if (mode === 'with-kit') {
  const kitClaude = join(repoRoot, '.claude')
  cpSync(kitClaude, join(workDir, '.claude'), {
    recursive: true,
    filter: (src) => {
      const rel = toPosix(relative(kitClaude, src))
      return !KIT_INTERNAL.some(p => rel === p || rel.startsWith(`${p}/`))
    },
  })
}

// 4. Dependencies: install once, then prune what a previous run may have added
const hasLock = existsSync(join(workDir, 'package-lock.json'))
if (process.argv.includes('--skip-install')) {
  console.log('Dependencies left untouched (--skip-install).')
}
else if (!existsSync(join(workDir, 'node_modules'))) {
  run(hasLock ? 'npm ci' : 'npm install')
  if (!hasLock) {
    cpSync(join(workDir, 'package-lock.json'), join(fixtureDir, 'package-lock.json'))
    console.log('\npackage-lock.json created and copied to evals/fixture: commit it so every run uses the same versions.\n')
  }
}
else {
  run('npm prune')
  run('npx nuxt prepare')
}

// 5. Baseline commit (the kit and the fixture are part of the baseline, so the diff shows only the agent's work)
run('git init -q')
run('git add -A')
run('git -c user.name=eval -c user.email=eval@localhost commit -q -m "eval baseline"')

// 6. Task overlay, left uncommitted
if (task.overlay) {
  cpSync(join(taskDir, task.overlay), workDir, { recursive: true })
}

console.log(`\nWork copy ready: task ${taskId}, ${mode}.`)
