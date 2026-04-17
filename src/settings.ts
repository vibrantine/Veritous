import { App, PluginSettingTab, Setting } from "obsidian";
import type Veritous from "./main";

export interface VeritousSettings {
	sourcesFolder: string;
	scrawlsFolder: string;
	nodesFolder: string;
	bibliographyHeading: string;
}

export const DEFAULT_SETTINGS: VeritousSettings = {
	sourcesFolder: "sources",
	scrawlsFolder: "scrawls",
	nodesFolder: "nodes",
	bibliographyHeading: "References",
};

export class VeritousSettingTab extends PluginSettingTab {
	plugin: Veritous;

	constructor(app: App, plugin: Veritous) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Sources folder")
			.setDesc("Folder where Source notes are stored.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.sourcesFolder)
					.onChange(async (value) => {
						this.plugin.settings.sourcesFolder = value.trim() || DEFAULT_SETTINGS.sourcesFolder;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Scrawls folder")
			.setDesc("Folder where Scrawl notes are stored.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.scrawlsFolder)
					.onChange(async (value) => {
						this.plugin.settings.scrawlsFolder = value.trim() || DEFAULT_SETTINGS.scrawlsFolder;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Nodes folder")
			.setDesc("Folder where reasoning node notes are stored.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.nodesFolder)
					.onChange(async (value) => {
						this.plugin.settings.nodesFolder = value.trim() || DEFAULT_SETTINGS.nodesFolder;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Bibliography section heading")
			.setDesc("Heading used for the references section appended to documents.")
			.addText((text) =>
				text
					.setValue(this.plugin.settings.bibliographyHeading)
					.onChange(async (value) => {
						this.plugin.settings.bibliographyHeading =
							value.trim() || DEFAULT_SETTINGS.bibliographyHeading;
						await this.plugin.saveSettings();
					}),
			);
	}
}
