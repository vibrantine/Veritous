import { Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.4. Prompt for node type (Proposition, Observation, Question) and
// statement. Create node file in nodes folder; open for optional elaboration.
export async function createNodeCommand(_plugin: Veritous): Promise<void> {
	new Notice("Veritous: Create node — not yet implemented.");
}
