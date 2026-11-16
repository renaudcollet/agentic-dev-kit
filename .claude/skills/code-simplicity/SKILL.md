---
name: code-simplicity
description: Criteria for keeping code simple and readable, without needless abstraction or defensive code. Apply when writing or refactoring code (TypeScript, Vue, PHP), and when reviewing generated code to spot over-engineering.
---

# Code simplicity

Goal: the shortest, most direct code that solves the actual problem, readable by someone new to the project.

## Rule status
These criteria are the default behaviour. Less simple code is sometimes justified: an optimized render loop or hot path (object pools, reused vectors, manual loops), a workaround for a library or browser bug, a third-party API constraint. In that case:
1. Add a `simplicity-exception:` comment: why the simple version does not work (measurement, bug referenced with a link, constraint).
2. Keep the complexity local: one function or module, not spread through the calling code.
3. When the agent introduces an exception itself, it says so in its reply for approval.
Never "simplify" a documented exception unless asked.

## Avoid
- **Single-use abstraction**: a function, composable, class or interface with one caller that clarifies nothing. Inline it.
- **Anticipated genericity**: options, configuration parameters or extension points that nothing uses today.
- **Delegation layers**: a function that only calls another function with the same arguments.
- **Unneeded defensive code**: `null` checks on values the types guarantee, `try/catch` that rethrows without adding anything, defaults for impossible cases.
- **A dependency for three lines**: if native JavaScript or the standard library is enough, do not add a package.
- **Type acrobatics**: nested generics or conditional types where a simple type will do.
- **Comments that paraphrase the code**. Keep those that explain a non-obvious *why*.
- **Dead code**: unused variables, imports, branches and props.

## Prefer
- Early returns over nested conditions.
- Names that say what the thing does, no obscure abbreviations.
- `map`, `filter`, `reduce` when clearer than a loop, and the other way round otherwise.
- Vue: local state until it is shared, `computed` rather than a `watch` that copies a value, components split when they become hard to read, not on principle.
- One function does one thing, at a single level of abstraction.

## The test
For every added element: "If I delete it, what breaks or becomes less clear?" If the answer is "nothing", delete it.

## Review format (when asked)
For each point: file and line, what is superfluous, simplified version in code. Do not report style preferences already covered by the linter.
