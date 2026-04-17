import type Veritous from "../main";
import { createSourceCommand } from "./create-source";
import { createSourceFromVaultNoteCommand } from "./create-source-from-vault-note";
import { createScrawlCommand } from "./create-scrawl";
import { createNodeCommand } from "./create-node";
import { insertScrawlCommand } from "./insert-scrawl";
import { rebuildIndexCommand } from "./rebuild-index";
import { showProblemsCommand } from "./show-problems";

export function registerCommands(plugin: Veritous): void {
	plugin.addCommand({
		id: "create-source",
		name: "Create source",
		callback: () => createSourceCommand(plugin),
	});

	plugin.addCommand({
		id: "create-source-from-vault-note",
		name: "Create source from vault note",
		callback: () => createSourceFromVaultNoteCommand(plugin),
	});

	plugin.addCommand({
		id: "create-scrawl",
		name: "Create scrawl",
		callback: () => createScrawlCommand(plugin),
	});

	plugin.addCommand({
		id: "create-node",
		name: "Create node",
		callback: () => createNodeCommand(plugin),
	});

	plugin.addCommand({
		id: "insert-scrawl",
		name: "Insert scrawl into document",
		editorCallback: (editor, view) => insertScrawlCommand(plugin, editor, view),
	});

	plugin.addCommand({
		id: "rebuild-index",
		name: "Rebuild index",
		callback: () => rebuildIndexCommand(plugin),
	});

	plugin.addCommand({
		id: "show-problems",
		name: "Show problems",
		callback: () => showProblemsCommand(plugin),
	});
}
