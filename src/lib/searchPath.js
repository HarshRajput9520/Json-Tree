/**
 * Normalize a JSON path into a canonical form.
 * Ensures it starts with "$." and preserves array indices.
 *
 * Examples:
 *   "user.address.city"  → "$.user.address.city"
 *   "$.items[0].name"    → "$.items[0].name"
 *   ""                   → "$"
 */
export function normalizePath(path) {
  if (!path) return "$";

  let p = path.trim();

  // prepend "$." if missing
  if (!p.startsWith("$")) p = `$.${p}`;

  // keep indices in their original form
  p = p.replace(/\[(\d+)\]/g, "[$1]");

  return p;
}

/**
 * Find the node id in a graph by normalized path.
 *
 * @param {{ nodes: Array<{id: string, data: any}> }} graph
 * @param {string} path
 * @returns {string|null} node id if found, else null
 */
export function findNodeId(graph, path) {
  if (!graph || !Array.isArray(graph.nodes)) return null;

  const targetId = normalizePath(path);

  // Since node IDs are usually normalized (dots/brackets removed),
  // attempt loose matching if exact id fails.
  const exact = graph.nodes.find((n) => n.id === targetId);
  if (exact) return exact.id;

  // fallback: try matching data.path if available
  const byPath = graph.nodes.find((n) => n.data?.path === targetId);
  return byPath ? byPath.id : null;
}

/**
 * Highlight a node by id by applying a transient style.
 *
 * @param {{ nodes: Array }} graph
 * @param {Function} setGraph React state setter from useState
 * @param {string|null} nodeId
 */
export function highlightNode(graph, setGraph, nodeId) {
  if (!nodeId || !setGraph) return;

  setGraph((prev) => ({
    ...prev,
    nodes: prev.nodes.map((n) => ({
      ...n,
      style:
        n.id === nodeId
          ? {
              boxShadow: "0 0 0 3px #ff3366",
              borderRadius: 4,
              transition: "box-shadow 0.2s ease",
            }
          : {},
    })),
  }));
}
