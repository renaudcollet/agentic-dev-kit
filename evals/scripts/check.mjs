#!/usr/bin/env node
// Runs the automated checks of a task on the evaluation working copy.
//
// Usage:
//   node evals/scripts/check.mjs --task 01-confirm-modal [--skip-commands] [--skip-e2e]
//
// Prints a JSON report and writes it to evals/work/.eval-checks.json.

import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const evalsDir = resolve(here, '..')
const workDir = join(evalsDir, 'work')

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const flag = name => process.argv.includes(`--${name}`)

const taskId = arg('task')
if (!taskId) throw new Error('Missing --task <id>')
const taskDir = join(evalsDir, 'tasks', taskId)
const task = JSON.parse(readFileSync(join(taskDir, 'task.json'), 'utf8'))

const sh = cmd => execSync(cmd, { cwd: workDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const toPosix = p => p.split(sep).join('/')
const tail = (text, n = 20) => text.split('\n').slice(-n).join('\n').trim()

const results = []
const add = (id, kind, pass, detail = '') => results.push({ id, kind, pass, detail })

// Files changed or added by the agent since the baseline commit (eval files excluded)
const changed = [
  ...sh('git diff --name-only HEAD').split('\n'),
  ...sh('git ls-files --others --exclude-standard').split('\n'),
].map(s => s.trim()).filter(f => f && !f.includes('__eval__') && !f.startsWith('.eval-'))
const uniqueChanged = [...new Set(changed)]

function allFiles(dir = workDir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.nuxt', '.output', '.git', 'test-results', 'playwright-report'].includes(entry)) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) allFiles(full, out)
    else out.push(toPosix(relative(workDir, full)))
  }
  return out
}

// 1. Grep checks
for (const g of task.grep ?? []) {
  const pathRe = new RegExp(g.path)
  if (g.mustNotChange) {
    const touched = uniqueChanged.filter(f => pathRe.test(f))
    add(g.id, 'grep', touched.length === 0, touched.length ? `changed: ${touched.join(', ')}` : g.desc)
    continue
  }
  const pool = (g.scope === 'all' ? allFiles() : uniqueChanged).filter(f => pathRe.test(f) && existsSync(join(workDir, f)))
  const re = new RegExp(g.must ?? g.mustNot, g.flags ?? '')
  const hits = pool.filter(f => re.test(readFileSync(join(workDir, f), 'utf8')))
  if (g.must) add(g.id, 'grep', hits.length > 0, hits.length ? `found in ${hits.join(', ')}` : `${g.desc}: not found in ${pool.length} file(s)`)
  else add(g.id, 'grep', hits.length === 0, hits.length ? `found in ${hits.join(', ')}` : g.desc)
}

// 2. No commit made by the agent
if (task.noNewCommit) {
  const count = Number(sh('git rev-list --count HEAD').trim())
  add('no-commit', 'git', count === 1, count === 1 ? 'no commit made' : `${count - 1} commit(s) made by the agent`)
}

// 3. Dependencies added
const basePkg = JSON.parse(sh('git show HEAD:package.json'))
const pkg = JSON.parse(readFileSync(join(workDir, 'package.json'), 'utf8'))
const depsOf = p => Object.keys({ ...p.dependencies, ...p.devDependencies })
const addedDeps = depsOf(pkg).filter(d => !depsOf(basePkg).includes(d))
if (task.noNewDeps) add('no-new-deps', 'deps', addedDeps.length === 0, addedDeps.join(', ') || 'none')

// 4. Commands (lint, typecheck, tests)
if (!flag('skip-commands')) {
  for (const c of task.commands ?? []) {
    try {
      const out = sh(c.run)
      add(c.name, 'command', true, tail(out, 5))
    }
    catch (e) {
      add(c.name, 'command', false, tail(`${e.stdout ?? ''}\n${e.stderr ?? ''}`))
    }
  }
}

// 5. Behavioural e2e spec
if (task.e2e && !flag('skip-e2e')) {
  const evalDir = join(workDir, 'tests', 'e2e', '__eval__')
  mkdirSync(evalDir, { recursive: true })
  cpSync(join(taskDir, task.e2e), join(evalDir, task.e2e))
  try {
    const out = sh('npx playwright test tests/e2e/__eval__ --reporter=line')
    add('e2e-behaviour', 'e2e', true, tail(out, 5))
  }
  catch (e) {
    add('e2e-behaviour', 'e2e', false, tail(`${e.stdout ?? ''}\n${e.stderr ?? ''}`, 30))
  }
}

const report = {
  task: taskId,
  changedFiles: uniqueChanged,
  addedDependencies: addedDeps,
  passed: results.filter(r => r.pass).length,
  total: results.length,
  results,
}
writeFileSync(join(workDir, '.eval-checks.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
