import type { SourceCategory, SourceTrust, SourceAccess, NodeType, Relation } from "./types";

export const SOURCE_CATEGORIES: readonly SourceCategory[] = [
	"paper", "article", "blog", "forum", "video", "podcast", "book",
	"docs", "gov", "ai-generated", "personal", "note", "other",
];

export const SOURCE_TRUSTS: readonly SourceTrust[] = [
	"peer-reviewed", "editorially-reviewed", "self-published",
	"user-generated", "ai-generated", "primary", "unknown",
];

export const SOURCE_ACCESSES: readonly SourceAccess[] = [
	"open", "paywall", "login", "archive", "local", "unknown",
];

export const NODE_TYPES: readonly NodeType[] = ["proposition", "observation", "question"];

export const RELATIONS_BY_NODE_TYPE: Record<NodeType, readonly Relation[]> = {
	proposition: ["supports", "contradicts"],
	observation: ["describes", "illustrates"],
	question: ["relates", "answers"],
};

export interface SourceDefaults {
	category: SourceCategory;
	trust: SourceTrust;
	access: SourceAccess;
}

// Spec §5.4 says unknown-match → all three default to 'unknown', but `category`
// has no 'unknown' value in its enum. Using 'other' for the category fallback.
export const UNKNOWN_SOURCE_DEFAULTS: SourceDefaults = {
	category: "other",
	trust: "unknown",
	access: "unknown",
};

interface UrlPatternRule {
	test: (hostname: string) => boolean;
	defaults: SourceDefaults;
}

const URL_PATTERN_RULES: readonly UrlPatternRule[] = [
	{
		test: (h) => /(^|\.)reddit\.com$/i.test(h),
		defaults: { category: "forum", trust: "user-generated", access: "open" },
	},
	{
		test: (h) => /(^|\.)arxiv\.org$/i.test(h),
		defaults: { category: "paper", trust: "self-published", access: "open" },
	},
	{
		test: (h) => /\.gov(\.|$)/i.test(h),
		defaults: { category: "gov", trust: "primary", access: "open" },
	},
	{
		test: (h) => /(^|\.)(twitter|x)\.com$/i.test(h),
		defaults: { category: "forum", trust: "user-generated", access: "open" },
	},
	{
		test: (h) => /(^|\.)(youtube|vimeo)\.com$/i.test(h),
		defaults: { category: "video", trust: "self-published", access: "open" },
	},
];

export function defaultsForUrl(url: string): SourceDefaults {
	let hostname = "";
	try {
		hostname = new URL(url).hostname;
	} catch {
		return UNKNOWN_SOURCE_DEFAULTS;
	}
	for (const rule of URL_PATTERN_RULES) {
		if (rule.test(hostname)) return rule.defaults;
	}
	return UNKNOWN_SOURCE_DEFAULTS;
}
