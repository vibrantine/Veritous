import { Editor, MarkdownView, Notice } from "obsidian";
import type Veritous from "../main";

// Spec §10.5 + §11. Fuzzy-pick a Scrawl (shown with Source title + preview).
// On select:
//   1. Insert scrawl content at cursor.
//   2. Prepend invisible marker: <!-- veritous:scrawl-id=<id> -->
//   3. Append footnote marker [^N] (N = next available or reused if source already cited).
//   4. Ensure `## <bibliographyHeading>` section exists at document end.
//   5. Append footnote definition per spec §11.2, wikilinking to Source note
//      and showing [category / trust / access] and raw link.
//   6. Record in scrawl_insertions table.
export async function insertScrawlCommand(
	_plugin: Veritous,
	_editor: Editor,
	_view: MarkdownView,
): Promise<void> {
	new Notice("Veritous: Insert scrawl — not yet implemented.");
}
