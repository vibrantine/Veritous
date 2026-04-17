import { Plugin, TAbstractFile } from "obsidian";
import { DEFAULT_SETTINGS, VeritousSettings, VeritousSettingTab } from "./settings";
import { registerCommands } from "./commands";
import { VeritousIndex } from "./db";
import { PROBLEMS_VIEW_TYPE, ProblemsView } from "./ui/problems-view";

export default class Veritous extends Plugin {
	settings!: VeritousSettings;
	index!: VeritousIndex;

	async onload() {
		await this.loadSettings();

		this.index = new VeritousIndex(this);
		await this.index.load();

		this.registerView(PROBLEMS_VIEW_TYPE, (leaf) => new ProblemsView(leaf));

		registerCommands(this);
		this.addSettingTab(new VeritousSettingTab(this.app, this));

		this.registerEvent(
			this.app.vault.on("create", (f: TAbstractFile) => this.index.onVaultChange("create", f)),
		);
		this.registerEvent(
			this.app.vault.on("modify", (f: TAbstractFile) => this.index.onVaultChange("modify", f)),
		);
		this.registerEvent(
			this.app.vault.on("delete", (f: TAbstractFile) => this.index.onVaultChange("delete", f)),
		);
		this.registerEvent(
			this.app.vault.on("rename", (f: TAbstractFile, oldPath: string) =>
				this.index.onVaultChange("rename", f, oldPath),
			),
		);
	}

	async onunload() {
		await this.index?.close();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<VeritousSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
