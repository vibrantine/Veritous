import type { ReasoningNode, NodeType } from "../types";
import { NODE_TYPES } from "../constants";

export function isNodeType(value: unknown): value is NodeType {
	return typeof value === "string" && (NODE_TYPES as readonly string[]).includes(value);
}

export interface ParsedNode {
	node: ReasoningNode | null;
	problems: string[];
}

export function parseNodeFrontmatter(
	path: string,
	frontmatter: Record<string, unknown> | undefined,
): ParsedNode {
	const problems: string[] = [];
	if (!frontmatter) return { node: null, problems: ["missing frontmatter"] };

	const { id, type, node_type, statement, tags } = frontmatter;

	if (type !== "node") problems.push("'type' must be 'node'");
	if (typeof id !== "string") problems.push("'id' is required and must be a string");
	if (!isNodeType(node_type)) {
		problems.push(`'node_type' must be one of: ${NODE_TYPES.join(", ")}`);
	}
	if (typeof statement !== "string") problems.push("'statement' is required and must be a string");

	if (problems.length > 0) return { node: null, problems };

	return {
		node: {
			id: id as string,
			nodeType: node_type as NodeType,
			statement: statement as string,
			tags: Array.isArray(tags) ? tags.map(String) : [],
			markdownPath: path,
		},
		problems,
	};
}
