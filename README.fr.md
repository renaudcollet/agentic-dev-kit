# agentic-dev-kit

[🇬🇧 English](README.md) · 🇫🇷 Français

Mon kit pour développer avec des agents IA : les règles, procédures et agents spécialisés qui guident l'IA dans mon travail de développeur web, 3D temps réel et WebAR.

Il est conçu pour **Claude Code** (format `.claude/`), mais les skills suivent le standard ouvert Agent Skills et peuvent servir dans d'autres outils. Les skills sont rédigées en anglais ; les agents répondent dans la langue dans laquelle tu travailles.

## Périmètre

Ce dépôt contient tout ce qui **configure ou guide l'IA** :
skills, sous-agents, modèles de `CLAUDE.md`, configuration MCP, hooks et prompts réutilisables.

Il ne contient **pas** les fichiers de configuration d'outils (ESLint, tsconfig, workflows de CI) : ils vivent dans les projets. Le kit contient les instructions qui permettent à l'agent de les mettre en place.

## Contenu

### Skills appliquées pendant le travail
| Skill | Se déclenche quand l'agent... |
|---|---|
| `accessibility` | écrit ou modifie un élément interactif, un formulaire, une modale |
| `security-frontend` | affiche du contenu externe, gère l'authentification côté client, ajoute une dépendance |
| `security-backend` | écrit une route d'API, une requête, une policy RLS, un upload |
| `code-simplicity` | écrit, refactorise ou relit du code |
| `responsive` | écrit du CSS ou de la mise en page |
| `performance-memory` | écrit une scène WebGL, une animation GSAP, du Canvas, Phaser ou WebAR, une liste longue, un chargement d'assets |
| `e2e-tests` | crée ou modifie un parcours utilisateur, écrit un test e2e, configure la CI des tests |
| `conventional-commits` | rédige un message de commit, découpe des changements en commits, nomme une branche |

Les skills n'ont pas de modèle imposé : elles utilisent celui de la session.

### Skill manuelle
| Skill | Rôle |
|---|---|
| `project-setup` | `/project-setup` : lint, formatage, TypeScript strict, tests unitaires, CI GitHub Actions, vérifications avant commit et des messages de commit (sur demande), `CLAUDE.md` du projet à partir de `CLAUDE-template.md`. Ne se déclenche jamais seule. |

### Sous-agents : contexte séparé, ne renvoient qu'une conclusion
| Agent | Rôle | Modèle |
|---|---|---|
| `reviewer` | relecture indépendante en lecture seule sur tous les axes avant commit ou PR, avec un message de commit proposé | `opus` |
| `perf-profiler` | mesures dans le navigateur (traces, tas, fps, draw calls), recherche de fuites, diagnostic chiffré | `opus` |
| `e2e-runner` | lance les tests e2e, diagnostique les échecs, garde les logs hors de la conversation | `sonnet` |

Les sous-agents diagnostiquent ; l'agent principal corrige, après validation.

### Maintenance du kit (utilisés dans ce dépôt uniquement, jamais copiés dans les projets)
| Élément | Rôle |
|---|---|
| skill `run-evals` | `/run-evals` : lance la suite d'évaluations et produit un tableau de résultats |
| sous-agent `eval-grader` | note chaque essai d'évaluation selon sa grille (`opus`) |

## Principes

- **Skills pour le savoir-faire, sous-agents pour la vérification indépendante** ou les tâches qui produisent beaucoup de bruit (logs, traces, captures). Pas un sous-agent par type de problème.
- **Règles par défaut, exceptions assumées.** Un écart volontaire se signale dans le code :

| Marqueur | Conditions |
|---|---|
| `perf-exception:` | coût contenu (surface, durée, pause hors écran, mobile, reduced-motion) |
| `a11y-exception:` | socle non négociable respecté (alternative, sortie clavier, reduced-motion, pas de flash) |
| `responsive-exception:` | comportement propre hors cible (letterbox ou message) |
| `simplicity-exception:` | raison mesurée ou bug référencé, complexité localisée |
| `security-exception:` | sécurité front uniquement, validée par le développeur, portée minimale |
| aucun | sécurité back : pas d'exception |

L'agent signale toute exception qu'il introduit, ne touche pas à celles qui sont documentées, et le relecteur les liste à part.
- **Rien n'est commité sans l'accord du développeur.**

## Installation dans un projet

Le kit est la version de référence ; chaque projet en reçoit une copie dans son dossier `.claude/`.

```powershell
# Aperçu sans rien modifier
.\scripts\sync.ps1 -Target "D:\projets\mon-projet" -DryRun

# Copie ou mise à jour
.\scripts\sync.ps1 -Target "D:\projets\mon-projet"
```

Le script :
- ajoute les fichiers absents et met à jour ceux qui n'ont pas été modifiés dans le projet ;
- **ne remplace jamais un fichier adapté localement** (il le signale ; `-Force` pour l'écraser quand même) ;
- ignore les chemins listés dans `.claude/.kit-ignore` du projet (un chemin par ligne, par exemple `skills/responsive`) ;
- note la version synchronisée dans `.claude/.kit-sync.json`.

**Nouveau projet** : le dossier cible doit déjà exister. Créer d'abord le projet (par exemple `pnpm create nuxt mon-projet`), lancer `sync.ps1` dessus, puis `/project-setup` dans Claude Code pour mettre en place le lint, les tests unitaires, la CI et le `CLAUDE.md` du projet.

**Projet existant** : commencer par `-DryRun` pour voir les fichiers qui seraient ajoutés et ceux qui entrent en conflit avec un dossier `.claude/` déjà présent.

Une amélioration faite dans un projet et utile ailleurs se reporte ici, dans le kit.

Sur un dépôt d'agence ou de client, demander avant de committer le dossier `.claude/`. Garder `.claude/settings.local.json` hors du dépôt.

## Configuration personnelle

Copier le contenu de `templates/CLAUDE-personal.md` dans `~/.claude/CLAUDE.md` : il fait proposer `/project-setup` à chaque nouveau projet.

Ne pas définir la variable `CLAUDE_CODE_SUBAGENT_MODEL` : elle écraserait le modèle de chaque sous-agent.

## Serveurs MCP

`mcp/.mcp.json` donne un exemple de configuration à copier à la racine d'un projet :
- **Playwright** : captures responsive pour le `reviewer` ;
- **Chrome DevTools** : traces et snapshots mémoire pour le `perf-profiler` ;
- **Context7** : documentation à jour des bibliothèques, utilisée par `project-setup`.

Sous Windows, si `npx` n'est pas trouvé, remplacer `"command": "npx"` par `"command": "cmd"` et préfixer les arguments par `"/c", "npx"`. Vérifier les commandes dans la documentation de chaque serveur, elles évoluent.

Si les noms d'outils du MCP Playwright diffèrent, ajuster la ligne `tools:` de `.claude/agents/reviewer.md`.

## Évaluations

`evals/` contient 12 tâches de référence sur un petit projet Nuxt (modale accessible, validation de formulaire, HTML non fiable, route d'upload, RLS Supabase, cycle de vie Three.js, animation GSAP, grande galerie, fonction utilitaire, découpage de commits, test e2e, exception documentée). Chaque essai est vérifié par des scripts, noté selon une grille oui/non par un agent séparé, et quelques points restent à contrôler à l'œil. Voir [evals/README.md](evals/README.md).

```
/run-evals            toutes les tâches, avec le kit
/run-evals both       avec et sans le kit, pour mesurer ce qu'il apporte
```

## Maintenance

Le kit est fait pour évoluer. Le revoir :
- **à chaque nouvelle génération de modèle** : lancer `/run-evals both`. Les règles que le modèle applique désormais de lui-même consomment du contexte pour rien : les retirer. Réévaluer le modèle des sous-agents ;
- **après une modification importante** d'une skill ou d'un sous-agent : lancer les tâches concernées, deux fois ;
- **tous les six mois** sinon : vérifier les détails liés aux versions (formats de config, API de bibliothèques, commandes MCP, champs d'en-tête de Claude Code) avec la documentation à jour.

Principes :
- Ajouter une règle quand un même problème revient dans les rapports du relecteur ; retirer celles qui ne servent jamais.
- Ne pas expliquer ce que l'agent sait déjà : des règles courtes et impératives, pas de théorie.
- Changer une chose à la fois et comparer les résultats avant et après.
- Noter chaque évolution dans `CHANGELOG.md`, avec des Conventional Commits.

## Licence

[MIT](LICENSE) : libre de réutiliser, adapter et redistribuer ces skills et sous-agents, en conservant la mention de copyright.
