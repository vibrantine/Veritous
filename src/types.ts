// Shared entity types. Canonical schemas live in the spec; these mirror them.

export type SourceCategory =
	| "paper"
	| "article"
	| "blog"
	| "forum"
	| "video"
	| "podcast"
	| "book"
	| "docs"
	| "gov"
	| "ai-generated"
	| "personal"
	| "note"
	| "other";

export type SourceTrust =
	| "peer-reviewed"
	| "editorially-reviewed"
	| "self-published"
	| "user-generated"
	| "ai-generated"
	| "primary"
	| "unknown";

export type SourceAccess =
	| "open"
	| "paywall"
	| "login"
	| "archive"
	| "local"
	| "unknown";

export type NodeType = "proposition" | "observation" | "question";

export type Relation =
	| "supports"
	| "contradicts"
	| "describes"
	| "illustrates"
	| "relates"
	| "answers";

export interface Source {
	id: string;
	title: string;
	link: string;
	category: SourceCategory;
	trust: SourceTrust;
	access: SourceAccess;
	tags: string[];
	markdownPath: string;
}

export interface ScrawlAttachment {
	nodeId: string;
	relation: Relation;
}

export interface Scrawl {
	id: string;
	sourceId: string;
	content: string;
	gathered: string;
	tags: string[];
	attachments: ScrawlAttachment[];
	markdownPath: string;
}

export interface ReasoningNode {
	id: string;
	nodeType: NodeType;
	statement: string;
	tags: string[];
	markdownPath: string;
}

export interface ValidationProblem {
	path: string;
	message: string;
}
