// Bidirectional conversion between markdown files and SQLite index rows (spec §9).
// Read path: frontmatter → entity → (wikilink resolution) → index row.
// Write path: user intent → frontmatter template → markdown file.

import type { TFile } from "obsidian";
import type Veritous from "./main";
import type { ValidationProblem } from "./types";

export interface IndexResult {
	sourcesIndexed: number;
	scrawlsIndexed: number;
	nodesIndexed: number;
	problems: ValidationProblem[];
}

export type VeritousFolder = "sources" | "scrawls" | "nodes";

export class TranslationLayer {
	constructor(private plugin: Veritous) {}

	folderForFile(path: string): VeritousFolder | null {
		const { sourcesFolder, scrawlsFolder, nodesFolder } = this.plugin.settings;
		if (path.startsWith(sourcesFolder + "/")) return "sources";
		if (path.startsWith(scrawlsFolder + "/")) return "scrawls";
		if (path.startsWith(nodesFolder + "/")) return "nodes";
		return null;
	}

	async indexFile(_file: TFile): Promise<ValidationProblem[]> {
		// TODO:
		//   1. Determine folder via folderForFile.
		//   2. Read frontmatter: app.metadataCache.getFileCache(file)?.frontmatter.
		//   3. Delegate to entities/{source,scrawl,node}.parseXFrontmatter.
		//   4. For scrawls: resolve sourceLink and attachments[].nodeLink to IDs
		//      via app.metadataCache.getFirstLinkpathDest → that file's frontmatter `id`.
		//   5. Upsert to db.
		return [];
	}

	async indexAll(): Promise<IndexResult> {
		// TODO: iterate files in each Veritous folder, indexFile each, collect results.
		return { sourcesIndexed: 0, scrawlsIndexed: 0, nodesIndexed: 0, problems: [] };
	}

	async removeFileFromIndex(_path: string): Promise<void> {
		// TODO: DELETE FROM the appropriate table WHERE markdown_path = ?.
	}

	/**
	 * Resolve a wikilink string like `[[atlantic-agents-2024]]` to the target note's
	 * frontmatter `id`. Returns null if the link can't be resolved or the target
	 * has no `id`.
	 */
	resolveWikilinkToId(_wikilink: string, _sourcePath: string): string | null {
		// TODO: strip brackets, use app.metadataCache.getFirstLinkpathDest, then
		// read frontmatter `id` from the target file.
		return null;
	}
}
