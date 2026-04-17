import { Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.6. Drop the SQLite database and rebuild it from markdown files in
// the three Veritous folders. Show progress. Recovery mechanism.
export async function rebuildIndexCommand(plugin: Veritous): Promise<void> {
	new Notice("Veritous: Rebuilding index…");
	try {
		await plugin.index.rebuild();
		new Notice("Veritous: Index rebuilt.");
	} catch (err) {
		console.error("Veritous: rebuild failed", err);
		new Notice("Veritous: Rebuild failed — see console.");
	}
}
