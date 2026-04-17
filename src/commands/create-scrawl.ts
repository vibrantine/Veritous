import { Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.3. Fuzzy-pick a Source. Create Scrawl file with frontmatter pointing
// to the selected Source, empty attachments array, gathered = today. Open for
// editing with cursor in the body.
export async function createScrawlCommand(_plugin: Veritous): Promise<void> {
	new Notice("Veritous: Create scrawl — not yet implemented.");
}
