import { App, Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, PluginSettings, GeneralSettingTab } from "./settings";
import { GetStopwatch as getStopwatch } from "./util/date-utils";

type MeetRecord = {
	inProgress: boolean;
	start: Date;
};

export default class MeetRecorderPlugin extends Plugin {
	settings: PluginSettings;
	meetRecord?: MeetRecord;

	async onload() {
		await this.loadSettings();

		const statusBarItemEl = this.addStatusBarItem();

		this.addRibbonIcon("mic", "Record meet", (evt: MouseEvent) => {
			if (!this.meetRecord) {
				new Notice("Start recording meet!", 5000);
				this.meetRecord = {
					inProgress: true,
					start: new Date(),
				};
			} else {
				this.meetRecord = undefined;
				new Notice("Stop record meet!", 5000);
			}
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-modal-simple",
			name: "Open modal (simple)",
			callback: () => {
				new RecordModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "replace-selected",
			name: "Replace selected content",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection("Sample editor command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-modal-complex",
			name: "Open modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new RecordModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
				return false;
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GeneralSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			//new Notice("Click");
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => {
				if (this.meetRecord && this.meetRecord.inProgress) {
					let msg = "Gravando...";
					if (this.meetRecord.start) {
						const durationStr = getStopwatch(this.meetRecord.start);
						msg += ` ${durationStr}`;
					}
					statusBarItemEl.setText(msg);
				} else {
					statusBarItemEl.setText("");
				}
			}, 200)
		);
	}

	onunload() {}

	async loadSettings() {
		const data = (await this.loadData()) as PluginSettings;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class RecordModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
