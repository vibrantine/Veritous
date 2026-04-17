// SQLite index. Lives at `.obsidian/plugins/veritous/index.db` (spec §4.2).
// Derived from markdown; rebuilt on schema mismatch, missing file, or user command.

import type { TAbstractFile } from "obsidian";
import type Veritous from "./main";
import type { Source, Scrawl, ReasoningNode, ValidationProblem } from "./types";

// `better-sqlite3` is marked external in esbuild.config.mjs — resolved at runtime.
// Import typed lazily inside load() so bundle works even if the module is missing.
type Database = unknown;

export type VaultChangeKind = "create" | "modify" | "delete" | "rename";

export class VeritousIndex {
	private db: Database | null = null;
	private problems: ValidationProblem[] = [];

	constructor(private plugin: Veritous) {}

	async load(): Promise<void> {
		// TODO:
		//   1. Resolve absolute path: <vault>/.obsidian/plugins/veritous/index.db
		//   2. const Database = require("better-sqlite3"); this.db = new Database(path);
		//   3. Run CREATE_STATEMENTS from ./db-schema.
		//   4. Check schema_version row. If missing/mismatched → rebuild().
		//   5. Otherwise leave alone; incremental updates will take over.
	}

	async rebuild(): Promise<void> {
		// TODO:
		//   1. Close + delete index.db.
		//   2. Re-run CREATE_STATEMENTS.
		//   3. Call TranslationLayer.indexAll() and upsert results.
		//   4. Populate this.problems with any ValidationProblems returned.
	}

	async close(): Promise<void> {
		this.db = null;
	}

	async onVaultChange(
		_kind: VaultChangeKind,
		_file: TAbstractFile,
		_oldPath?: string,
	): Promise<void> {
		// TODO: dispatch on kind. On create/modify of a Veritous-folder file,
		// re-parse via TranslationLayer and upsert. On delete, remove by path.
		// On rename, remove old_path row and re-index under new path.
	}

	getProblems(): ValidationProblem[] {
		return [...this.problems];
	}

	// ---- Query API (stubs) ----

	allSources(): Source[] { return []; }
	allScrawls(): Scrawl[] { return []; }
	allNodes(): ReasoningNode[] { return []; }

	sourceById(_id: string): Source | null { return null; }
	scrawlById(_id: string): Scrawl | null { return null; }
	nodeById(_id: string): ReasoningNode | null { return null; }

	recordInsertion(_scrawlId: string, _documentPath: string, _insertedAt: string): void {
		// TODO: INSERT OR IGNORE INTO scrawl_insertions.
	}
}
