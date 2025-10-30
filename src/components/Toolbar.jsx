// src/components/Toolbar.jsx
import { useState, useCallback } from "react";
import { findNodeId, highlightNode, normalizePath } from "../assets/lib/searchPath";

/**
 * Toolbar Component
 *
 * Provides search and viewport control actions for the JSON Tree visualization.
 *
 * Props:
 *  - rfRef: React ref for React Flow instance
 *  - graph: current graph object ({ nodes, edges, index })
 *  - setGraph: React state setter for graph updates
 */
export default function Toolbar({ rfRef, graph, setGraph }) {
  const [query, setQuery] = useState("$.user.address.city");
  const [message, setMessage] = useState("");

  /** Run search by JSON path */
  const handleSearch = useCallback(() => {
    if (!graph || !graph.nodes?.length) {
      setMessage("Please load or generate JSON first");
      return;
    }

    const normalized = normalizePath(query);
    const nodeId = findNodeId(graph, normalized);

    if (!nodeId) {
      setMessage("No match found");
      return;
    }

    // highlight selected node
    highlightNode(graph, setGraph, nodeId);
    setMessage("Match found");

    // focus viewport on target node
    const instance = rfRef.current;
    const node = graph.nodes.find((n) => n.id === nodeId);
    if (instance && node) {
      instance.setCenter(node.position.x, node.position.y, {
        zoom: 1.2,
        duration: 400,
      });
    }
  }, [graph, query, rfRef, setGraph]);

  /** Fit the view to all nodes */
  const handleFitView = useCallback(() => {
    rfRef.current?.fitView({ padding: 0.2, duration: 300 });
    setMessage("View reset");
  }, [rfRef]);

  return (
    <div className="toolbar">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter JSON path (e.g. $.user.address.city)"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleFitView}>Fit View</button>
      <span className="hint">{message}</span>
    </div>
  );
}
