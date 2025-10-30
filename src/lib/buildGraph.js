// --- layout constants ---
const BASE_NODE_WIDTH = 260;        
const HORIZONTAL_GAP = 40;         
const VERTICAL_SPACING = 140;      
const ROOT_X = 600;
const ROOT_Y = 100;

// sanitize id for React Flow
function normalizeId(str) {
  return String(str).replace(/[.[\]]+/g, "_");
}

function getKind(value) {
  if (Array.isArray(value)) return "array";
  if (value && typeof value === "object") return "object";
  return "primitive";
}

/**
 * Width calculation for a subtree.
 * For objects and arrays we sum child widths plus gaps.
 * For primitives we return BASE_NODE_WIDTH.
 */
function measureSubtreeWidth(nodeValue) {
  // arrays: sum of each child's subtree width + gaps
  if (Array.isArray(nodeValue)) {
    if (!nodeValue.length) return BASE_NODE_WIDTH;

    const childWidths = nodeValue.map((child) => measureSubtreeWidth(child));
    const totalChildrenWidth = childWidths.reduce((acc, w) => acc + w, 0);
    const totalGaps =
      (childWidths.length - 1) * HORIZONTAL_GAP;
    return Math.max(BASE_NODE_WIDTH, totalChildrenWidth + totalGaps);
  }

  if (nodeValue && typeof nodeValue === "object") {
    const keys = Object.keys(nodeValue);
    if (!keys.length) return BASE_NODE_WIDTH;

    const childWidths = keys.map((key) => measureSubtreeWidth(nodeValue[key]));
    const totalChildrenWidth = childWidths.reduce((acc, w) => acc + w, 0);
    const totalGaps =
      (childWidths.length - 1) * HORIZONTAL_GAP;
    return Math.max(BASE_NODE_WIDTH, totalChildrenWidth + totalGaps);
  }

  // primitive leaf
  return BASE_NODE_WIDTH;
}

// last logical segment "user.address.city" -> "city"
// "items[0]" stays "items[0]" for label
function getLastSegment(path) {
  if (!path) return "root";
  const parts = path.split(".");
  return parts[parts.length - 1];
}

function getNodeLabel(path, value, kind) {
  if (!path) return "root";

  const segment = getLastSegment(path);

  if (kind === "primitive") {
    return `${segment}: ${String(value)}`;
  }
  if (kind === "array") {
    return `${segment} [${Array.isArray(value) ? value.length : 0}]`;
  }
  if (kind === "object") {
    return segment;
  }
  return segment || "unknown";
}

function createNode({ id, label, kind, x, y, path, value }) {
  return {
    id: normalizeId(id),
    type: "json",
    position: { x, y },
    data: {
      label,
      kind,
      path,
      value,
    },
  };
}

function createEdge(parentId, childId) {
  return {
    id: `e-${normalizeId(parentId)}-${normalizeId(childId)}`,
    source: normalizeId(parentId),
    target: normalizeId(childId),
    sourceHandle: "b",
    targetHandle: "t",
    style: { stroke: "#4a5568", strokeWidth: 2 },
  };
}

/**
 * buildGraph
 * Returns { nodes, edges, index }
 * nodes: React Flow nodes
 * edges: React Flow edges
 * index: map from "$.path.to.node" -> nodeId
 */
export function buildGraph(rootValue) {
  const nodes = [];
  const edges = [];
  const index = {};

  /**
   * Depth-first layout.
   * We compute each node position using subtree widths so siblings do not overlap.
   *
   * @param {*} value         current JSON value
   * @param {string} path     logical path ("user.address.city", "items[0]", etc). "" for root.
   * @param {number} depth    vertical level
   * @param {number} xCenter  x-center position to place this node
   */
  function visit(value, path, depth, xCenter) {
    const kind = getKind(value);
    const yPos = ROOT_Y + depth * VERTICAL_SPACING;

    const nodeId = path || "root";
    const label = getNodeLabel(path, value, kind);

    const node = createNode({
      id: nodeId,
      label,
      kind,
      x: xCenter,
      y: yPos,
      path: path || "$",
      value: kind === "primitive" ? value : undefined,
    });

    nodes.push(node);
    index[path || "$"] = node.id;

    // no children for primitive
    if (kind === "primitive") return;

    // compute children layout
    if (kind === "object") {
      const keys = Object.keys(value);
      if (!keys.length) return;

      // width of this whole subtree
      const totalWidth = measureSubtreeWidth(value);
      // start cursor at left edge
      let cursorX = xCenter - totalWidth / 2;

      keys.forEach((key, idx) => {
        const childVal = value[key];
        const childWidth = measureSubtreeWidth(childVal);

        // place child centered in its own slice
        const childCenterX = cursorX + childWidth / 2;
        const childPath = path ? `${path}.${key}` : key;

        edges.push(createEdge(nodeId, childPath));
        visit(childVal, childPath, depth + 1, childCenterX);

        // advance cursor by this child's width plus gap
        cursorX += childWidth + HORIZONTAL_GAP;
      });

      return;
    }

    if (kind === "array") {
      if (!value.length) return;

      const totalWidth = measureSubtreeWidth(value);
      let cursorX = xCenter - totalWidth / 2;

      value.forEach((childVal, i) => {
        const childWidth = measureSubtreeWidth(childVal);
        const childCenterX = cursorX + childWidth / 2;
        const childPath = `${path}[${i}]`;

        edges.push(createEdge(nodeId, childPath));
        visit(childVal, childPath, depth + 1, childCenterX);

        cursorX += childWidth + HORIZONTAL_GAP;
      });

      return;
    }
  }

  visit(rootValue, "", 0, ROOT_X);

  return { nodes, edges, index };
}
