import { ItemView, WorkspaceLeaf } from "obsidian";

export const PROBLEMS_VIEW_TYPE = "veritous-problems";

export class ProblemsView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return PROBLEMS_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Veritous problems";
	}

	async onOpen(): Promise<void> {
		// TODO: subscribe to problem updates from the index and render them.
		const root = this.containerEl.children[1] as HTMLElement;
		root.empty();
		root.createEl("h3", { text: "Veritous problems" });
		root.createEl("p", { text: "No problems reported." });
	}
}
