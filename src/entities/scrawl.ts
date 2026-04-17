import type { Relation } from "../types";

// The parse result uses wikilinks (strings) rather than resolved IDs —
// the translation layer resolves links to entity IDs in a second pass.
export interface ParsedAttachment {
	nodeLink: string;
	relation: Relation;
}

export interface ParsedScrawlData {
	id: string;
	sourceLink: string;
	gathered: string;
	tags: string[];
	attachments: ParsedAttachment[];
	content: string;
	markdownPath: string;
}

export interface ParsedScrawl {
	scrawl: ParsedScrawlData | null;
	problems: string[];
}

export function parseScrawlFrontmatter(
	path: string,
	frontmatter: Record<string, unknown> | undefined,
	body: string,
): ParsedScrawl {
	const problems: string[] = [];
	if (!frontmatter) return { scrawl: null, problems: ["missing frontmatter"] };

	const { id, type, source, gathered, tags, attachments } = frontmatter;

	if (type !== "scrawl") problems.push("'type' must be 'scrawl'");
	if (typeof id !== "string") problems.push("'id' is required and must be a string");
	if (typeof source !== "string") problems.push("'source' is required and must be a wikilink");
	if (typeof gathered !== "string") problems.push("'gathered' is required (YYYY-MM-DD)");

	const parsedAttachments: ParsedAttachment[] = [];
	if (Array.isArray(attachments)) {
		for (const a of attachments) {
			if (!a || typeof a !== "object") {
				problems.push("'attachments[]' entries must be objects");
				continue;
			}
			const { node, relation } = a as Record<string, unknown>;
			if (typeof node !== "string" || typeof relation !== "string") {
				problems.push("'attachments[].node' and '.relation' are required strings");
				continue;
			}
			parsedAttachments.push({ nodeLink: node, relation: relation as Relation });
		}
	}

	if (problems.length > 0) return { scrawl: null, problems };

	return {
		scrawl: {
			id: id as string,
			sourceLink: source as string,
			gathered: gathered as string,
			tags: Array.isArray(tags) ? tags.map(String) : [],
			attachments: parsedAttachments,
			content: body,
			markdownPath: path,
		},
		problems,
	};
}
