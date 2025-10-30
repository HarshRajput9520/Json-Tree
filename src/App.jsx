import { useState, useRef, useCallback } from "react";
import { ReactFlowProvider } from "reactflow";

import JsonInput from "./components/JsonInput";
import TreeCanvas from "./components/TreeCanvas";
import { buildGraph } from "./lib/buildGraph";

import "reactflow/dist/style.css";
import "./styles.css";

/**
 * Root Application
 * Handles JSON parsing, React Flow graph generation,
 * node search, highlighting, theming, and export actions.
 */
export default function App() {
  /** --------------------------
   * Application State
   * -------------------------- */
  const [graph, setGraph] = useState({ nodes: [], edges: [], index: {} });
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [status, setStatus] = useState("");
  const [isDark, setIsDark] = useState(false);

  const flowRef = useRef(null);

  /** --------------------------
   * Handlers
   * -------------------------- */

  /** Parse JSON input and rebuild graph */
  const handleGenerate = useCallback((rawJson) => {
    try {
      const parsed =
        typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;

      const nextGraph = buildGraph(parsed);
      setGraph(nextGraph);
      setHighlightId(null);
      setStatus("Tree generated successfully");
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON. Please check syntax.");
    }
  }, []);

  /** Normalize user search input */
  const normalizePath = (path) => {
    if (!path || path === "$") return "$";
    return path.trim().replace(/^\$\.*?/, ""); // removes $, $., etc.
  };

  /** Search node by JSON path */
  const handleSearch = useCallback(() => {
    if (!graph.nodes.length) {
      setStatus("Please generate a tree first.");
      return;
    }

    const normalized = normalizePath(query);
    const nodeId = graph.index[normalized === "$" ? "$" : normalized];

    if (!nodeId) {
      setHighlightId(null);
      setStatus("No match found");
      return;
    }

    setHighlightId(nodeId);
    setStatus("Match found");

    // focus the viewport on the node
    const instance = flowRef.current;
    if (instance) {
      const node = graph.nodes.find((n) => n.id === nodeId);
      if (node) {
        instance.setCenter(node.position.x + 100, node.position.y + 30, {
          zoom: 1.2,
          duration: 400,
        });
      }
    }
  }, [graph, query]);

  /** Copy node path on click */
  const handleNodeClick = useCallback((node) => {
    const path = node?.data?.path;
    if (!path) return;

    navigator.clipboard
      ?.writeText(path)
      .then(() => setStatus(`Copied path: ${path}`))
      .catch(() => setStatus("Copy failed"));
  }, []);

  /** Export graph as PNG */
  const handleDownload = useCallback(async () => {
    try {
      const { toPng } = await import("html-to-image");
      const canvas = document.querySelector(".react-flow");
      if (!canvas) return;

      const bg =
        getComputedStyle(document.body).getPropertyValue("--canvas-bg") ||
        "#ffffff";

      const dataUrl = await toPng(canvas, {
        backgroundColor: bg,
        pixelRatio: 2,
        filter: (node) => {
          const has = (cls) => node?.classList?.contains?.(cls);
          return !(
            has("react-flow__controls") ||
            has("react-flow__minimap") ||
            has("react-flow__attribution")
          );
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "json-tree.png";
      link.click();
      setStatus("Tree exported as PNG");
    } catch (error) {
      console.error("Export failed:", error);
      setStatus("Export failed");
    }
  }, []);

  /** --------------------------
   * Render
   * -------------------------- */
  return (
    <div className={`app ${isDark ? "dark" : ""}`}>
      {/* Left Sidebar */}
      <aside className="left">
        <header className="theme-toggle">
          <label htmlFor="darkModeToggle">Dark Mode</label>
          <input
            id="darkModeToggle"
            type="checkbox"
            checked={isDark}
            onChange={(e) => setIsDark(e.target.checked)}
          />
        </header>

        <JsonInput onGenerate={handleGenerate} />

        <section className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="$.user.address.city"
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleDownload}>Download</button>
        </section>

        <footer className="status">{status}</footer>
      </aside>

      {/* Visualization Canvas */}
      <main className="right">
        <ReactFlowProvider>
          <TreeCanvas
            rfRef={flowRef}
            graph={graph}
            highlightId={highlightId}
            onNodeClick={handleNodeClick}
          />
        </ReactFlowProvider>
      </main>
    </div>
  );
}
