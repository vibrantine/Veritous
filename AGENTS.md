# Veritous — AGENTS.md

Project-specific guidance for AI agents (and humans) working in this plugin. Generic Obsidian-plugin conventions are not repeated here; see the [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin) if you need them.

## What this is

Veritous is a markdown-native, local-first Obsidian plugin for epistemically-typed source and evidence management. It collects **Sources**, attaches loose human-authored **Scrawls** to them, clusters scrawls around structured reasoning **Nodes** (Proposition / Observation / Question), and composes documents that cite the accumulated evidence with traceable references.

The thesis: a peer-reviewed paper, a blog post, a Reddit thread, and an AI-generated summary are epistemically distinct, and citations should reflect that. Three orthogonal typing axes — `category`, `trust`, `access` — appear in every bibliography entry.

## Source of truth

**The design spec is `../../veritous-spec-v0.4.md`** (the markdown file at the vault's `.obsidian/` folder, one level above `plugins/`). Read it before making non-trivial changes. Section references in this file and in code comments (§5.3, §10.5, etc.) point into that spec.

When spec and code disagree, the spec wins unless a decision recorded below overrides it.

## Commands

Run from this folder (`.obsidian/plugins/veritous/`):

| Task | Command |
| --- | --- |
| Install deps | `npm install` |
| Dev (watch, rebuilds `main.js` on save) | `npm run dev` |
| Production build (type-check + minify) | `npm run build` |
| Lint | `npm run lint` |
| Bump version | `npm version patch\|minor\|major` |

No test runner. Testing is manual: `npm run dev`, reload Obsidian, exercise the feature.

## Architectural decisions (not in the spec)

These were made during scaffolding. Update this list — not just the code — if you reverse one.

1. **SQLite library: `better-sqlite3`.** Native, synchronous, real on-disk DB. Forces `isDesktopOnly: true` in `manifest.json`. Rejected alternative: `sql.js` (WASM, mobile-compatible, but in-memory-and-serialize). Revisit only if mobile support becomes required.
2. **Native binary distribution is a release-time problem.** For local dev, `npm install` pulls the right binary. For releases, the `.node` binary has to be shipped alongside `main.js` for each supported platform. Not yet solved.
3. **Category fallback is `"other"`, not `"unknown"`.** Spec §5.4 says unknown-URL defaults all three fields to `unknown`, but §5.3's `category` enum has no `unknown` value. Resolved at `src/constants.ts` (`UNKNOWN_SOURCE_DEFAULTS`). Flag in a future spec revision.
4. **Wikilinks resolve to frontmatter `id`, not filename.** Scrawl `source:` and `attachments[].node` are wikilinks (Obsidian renders them natively). The translation layer resolves them via `app.metadataCache.getFirstLinkpathDest`, then reads the target file's frontmatter `id` as the DB foreign-key value. This means filenames are free to differ from IDs. Implementation belongs in `src/translation.ts::resolveWikilinkToId`.
5. **Frontmatter editing uses `app.fileManager.processFrontMatter`.** Don't parse or serialize YAML by hand; Obsidian provides a mutative API that preserves formatting and comments.

## Architecture

Markdown is canonical (spec §4.1). SQLite is derived (§4.2) and rebuildable from markdown at any time.

```
vault.md file
    │
    ▼  metadataCache.getFileCache()
frontmatter + body
    │
    ▼  entities/{source,scrawl,node}.ts — parse + validate enums
ParsedEntity | problems[]
    │
    ▼  translation.ts — resolve wikilinks to IDs
index row
    │
    ▼  db.ts — upsert into SQLite
index.db
```

`main.ts` wires four vault events (`create`, `modify`, `delete`, `rename`) into `VeritousIndex.onVaultChange`, which re-runs the relevant slice of the above pipeline for a single file. Full rebuild (`VeritousIndex.rebuild`) replays it for every file under the three configured folders.

The db file lives at `.obsidian/plugins/veritous/index.db` and is excluded from Obsidian Sync by default (spec §4.4). Never commit it.

## Layout

```
src/
├── main.ts           plugin lifecycle: load settings, open index, register view/commands, wire watcher
├── settings.ts       VeritousSettings + SettingTab (four fields, spec §12)
├── types.ts          Source, Scrawl, ReasoningNode, enum types
├── constants.ts      enum lists + URL-pattern defaults (§5.4), `defaultsForUrl`
├── db.ts             VeritousIndex — open/rebuild/query/onVaultChange. Most methods stubbed.
├── db-schema.ts      CREATE TABLE/INDEX statements, verbatim from §8
├── translation.ts    TranslationLayer — markdown ↔ index, wikilink resolution. Stubbed.
├── entities/
│   ├── source.ts     parseSourceFrontmatter, enum type-guards, slugifyId
│   ├── scrawl.ts     parseScrawlFrontmatter (leaves wikilinks unresolved)
│   └── node.ts       parseNodeFrontmatter, isNodeType
├── commands/
│   ├── index.ts      registerCommands — wires all seven
│   └── *.ts          one per command (§10.1–§10.7), all stubs except rebuild-index
└── ui/problems-view.ts   ItemView skeleton for the `Show problems` panel
```

## Status (as of scaffold)

**Wired:** plugin lifecycle, settings, command registration, file-watcher hookup, ProblemsView registration, `VeritousIndex` construction.

**Stubbed with TODOs:** `VeritousIndex.load` / `rebuild` / `onVaultChange` / all query methods, every command body, `TranslationLayer.indexFile` / `indexAll` / `resolveWikilinkToId` / `removeFileFromIndex`, the ProblemsView's render loop.

**First real implementation should be:** `db.load` + `db-schema` execution → `TranslationLayer.indexAll` → `rebuild-index` command end-to-end. That unblocks everything else, because every other command either reads from or writes to the index.

## Scope discipline

v1 is a personal tool (spec §1). **Do not add:**
- Concept nodes, node-to-node relations, proposition-to-proposition edges (§2.2)
- CSL-JSON, APA/MLA/Chicago formatting, structured bibliographic fields (author, date, publication)
- Zotero / BibTeX import
- AI generation, verification, or adaptive-compute features
- Multi-document scrawl-reuse commands (the `scrawl_insertions` table exists; the commands that read it are v2)

The `scrawl_insertions` table *is* populated in v1 even though no v1 command reads it (§2.1). Preserving this data now costs almost nothing and avoids a migration later.

## Coding conventions

- Tabs for indent; LF line endings (`.editorconfig`).
- Keep `main.ts` to lifecycle only. Feature logic lives in focused modules.
- ~200–300 line ceiling per file; split when you exceed it.
- Use `this.register*` helpers (`registerEvent`, `registerDomEvent`, `registerInterval`, `registerView`) so unload cleans up.
- No backwards-compat shims — pre-v1, rename freely. The one exception is `manifest.json`'s `id`, which is `"veritous"` and must never change.
- Prefer `app.fileManager.processFrontMatter` for frontmatter edits; `app.vault.process` for body edits (atomic, conflict-safe).
- Don't bundle `better-sqlite3`, `obsidian`, or `electron` — they're marked external in `esbuild.config.mjs`.

## Git commits (when made by an agent)

Rules for any commit authored by Claude or another AI agent. Human-authored commits are not bound by these but following them is encouraged for consistency.

- **Past tense** for subject lines. `Added scrawl validation`, not `Add scrawl validation`.
- **No emoji.** Ever. Not in the subject, not in the body, not in trailers.
- **No attribution trailers.** Drop `Co-Authored-By: Claude`, `Generated with Claude Code`, and similar. Commits should read as if a human wrote them.
- **Reference the spec when the change traces to it.** Cite the section inline — `(implements §10.5)`, `(per §5.4)`, `(closes open item §14 #1)` — in subject or body as fits.
- **Batch freely.** One commit may contain multiple logical changes. Don't split commits for the sake of splitting.

## Spec open items to watch

Full list is in spec §14. Items that will need decisions during v1 implementation:

- **#1 URL metadata fetch** — how `requestUrl` failures, offline, and rate limits behave. Affects `create-source`.
- **#8 Vault-ref rename sync** — when a user renames a note that a Source's `link` wikilinks to, does our index need to re-run? Depends on what Obsidian's `rename` event exposes.
- **#10 URL-pattern defaults tuning** — real usage may reshape `URL_PATTERN_RULES` in `constants.ts`.

## What not to do

- Don't commit `main.js`, `index.db`, or `node_modules/` (all gitignored).
- Don't invent v2 features; spec §2.2 is authoritative.
- Don't write unit tests against mocked Obsidian APIs — the ROI is poor for a plugin of this size. Manual testing with `npm run dev` and an Obsidian reload is the v1 model.
- Don't add `CLAUDE.md`/`AGENTS.md` content outside this file. `CLAUDE.md` is a one-line pointer; keep all project guidance here.
