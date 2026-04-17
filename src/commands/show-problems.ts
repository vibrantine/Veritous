import { WorkspaceLeaf } from "obsidian";
import type Veritous from "../main";
import { PROBLEMS_VIEW_TYPE } from "../ui/problems-view";

// Spec §10.7. Open (or focus) the Veritous problems panel.
export async function showProblemsCommand(plugin: Veritous): Promise<void> {
	const { workspace } = plugin.app;

	let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(PROBLEMS_VIEW_TYPE)[0] ?? null;
	if (!leaf) {
		leaf = workspace.getRightLeaf(false);
		await leaf?.setViewState({ type: PROBLEMS_VIEW_TYPE, active: true });
	}
	if (leaf) workspace.revealLeaf(leaf);
}
