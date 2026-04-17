import type { Source, SourceCategory, SourceTrust, SourceAccess } from "../types";
import { SOURCE_CATEGORIES, SOURCE_TRUSTS, SOURCE_ACCESSES } from "../constants";

export function isSourceCategory(value: unknown): value is SourceCategory {
	return typeof value === "string" && (SOURCE_CATEGORIES as readonly string[]).includes(value);
}

export function isSourceTrust(value: unknown): value is SourceTrust {
	return typeof value === "string" && (SOURCE_TRUSTS as readonly string[]).includes(value);
}

export function isSourceAccess(value: unknown): value is SourceAccess {
	return typeof value === "string" && (SOURCE_ACCESSES as readonly string[]).includes(value);
}

export function slugifyId(title: string): string {
	const base = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
	return base || "source";
}

export interface ParsedSource {
	source: Source | null;
	problems: string[];
}

export function parseSourceFrontmatter(
	path: string,
	frontmatter: Record<string, unknown> | undefined,
): ParsedSource {
	const problems: string[] = [];
	if (!frontmatter) return { source: null, problems: ["missing frontmatter"] };

	const { id, type, title, link, category, trust, access, tags } = frontmatter;

	if (type !== "source") problems.push("'type' must be 'source'");
	if (typeof id !== "string") problems.push("'id' is required and must be a string");
	if (typeof title !== "string") problems.push("'title' is required and must be a string");
	if (typeof link !== "string") problems.push("'link' is required and must be a string");
	if (!isSourceCategory(category)) {
		problems.push(`'category' must be one of: ${SOURCE_CATEGORIES.join(", ")}`);
	}
	if (!isSourceTrust(trust)) {
		problems.push(`'trust' must be one of: ${SOURCE_TRUSTS.join(", ")}`);
	}
	if (!isSourceAccess(access)) {
		problems.push(`'access' must be one of: ${SOURCE_ACCESSES.join(", ")}`);
	}

	if (problems.length > 0) return { source: null, problems };

	return {
		source: {
			id: id as string,
			title: title as string,
			link: link as string,
			category: category as SourceCategory,
			trust: trust as SourceTrust,
			access: access as SourceAccess,
			tags: Array.isArray(tags) ? tags.map(String) : [],
			markdownPath: path,
		},
		problems,
	};
}
