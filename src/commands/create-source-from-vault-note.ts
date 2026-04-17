import { Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.2. Fuzzy-pick an existing vault note; create a Source with:
//   link  = wikilink to the selected note
//   title = note's basename
//   category = "note", trust = "self-published", access = "local"
export async function createSourceFromVaultNoteCommand(_plugin: Veritous): Promise<void> {
	new Notice("Veritous: Create source from vault note — not yet implemented.");
}
