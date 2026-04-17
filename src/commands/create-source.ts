import { Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.1. Prompt for URL (optional) and title (required if no URL).
// If URL present, fetch page title via `requestUrl`. Default category/trust/access
// per URL-pattern rules in constants.ts. Create template-filled file in sources folder,
// open it for editing.
export async function createSourceCommand(_plugin: Veritous): Promise<void> {
	new Notice("Veritous: Create source — not yet implemented.");
}
