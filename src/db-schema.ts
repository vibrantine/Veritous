// SQLite DDL — spec §8. Run at index creation and full rebuild.

export const SCHEMA_VERSION = 1;

export const CREATE_STATEMENTS: readonly string[] = [
	`CREATE TABLE IF NOT EXISTS sources (
		id TEXT PRIMARY KEY,
		title TEXT NOT NULL,
		link TEXT NOT NULL,
		category TEXT NOT NULL,
		trust TEXT NOT NULL,
		access TEXT NOT NULL,
		tags_json TEXT,
		markdown_path TEXT NOT NULL,
		updated_at TEXT NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS scrawls (
		id TEXT PRIMARY KEY,
		source_id TEXT NOT NULL REFERENCES sources(id),
		content TEXT NOT NULL,
		gathered TEXT NOT NULL,
		tags_json TEXT,
		markdown_path TEXT NOT NULL,
		updated_at TEXT NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS nodes (
		id TEXT PRIMARY KEY,
		node_type TEXT NOT NULL,
		statement TEXT NOT NULL,
		tags_json TEXT,
		markdown_path TEXT NOT NULL,
		updated_at TEXT NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS scrawl_attachments (
		scrawl_id TEXT NOT NULL REFERENCES scrawls(id) ON DELETE CASCADE,
		node_id TEXT NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
		relation TEXT NOT NULL,
		PRIMARY KEY (scrawl_id, node_id)
	)`,
	`CREATE TABLE IF NOT EXISTS scrawl_insertions (
		scrawl_id TEXT NOT NULL REFERENCES scrawls(id) ON DELETE CASCADE,
		document_path TEXT NOT NULL,
		inserted_at TEXT NOT NULL,
		PRIMARY KEY (scrawl_id, document_path, inserted_at)
	)`,
	`CREATE TABLE IF NOT EXISTS schema_version (version INTEGER NOT NULL)`,
	`CREATE INDEX IF NOT EXISTS idx_scrawls_source ON scrawls(source_id)`,
	`CREATE INDEX IF NOT EXISTS idx_scrawls_gathered ON scrawls(gathered)`,
	`CREATE INDEX IF NOT EXISTS idx_attachments_node ON scrawl_attachments(node_id)`,
	`CREATE INDEX IF NOT EXISTS idx_sources_category ON sources(category)`,
	`CREATE INDEX IF NOT EXISTS idx_sources_trust ON sources(trust)`,
	`CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(node_type)`,
	`CREATE INDEX IF NOT EXISTS idx_insertions_document ON scrawl_insertions(document_path)`,
];
