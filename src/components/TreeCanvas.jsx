// src/components/TreeCanvas.jsx
import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
} from "reactflow";

function JsonNode({ data }) {
  const { label, kind, value } = data || {};

  const borderColor =
    kind === "primitive" ? "#e53e3e" : kind === "array" ? "#38a169" : "#3182ce";

  return (
    <div
      style={{
        minWidth: 240,
        maxWidth: 260,
        padding: "16px 20px 14px",
        borderRadius: 12,
        background: "#ffffff",
        border: `3px solid ${borderColor}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        boxSizing: "border-box",
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      {/* top handle with spacing */}
      <Handle
        type="target"
        id="t"
        position={Position.Top}
        style={{ top: -6, background: "#1a202c" }}
      />

      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          maxWidth: 220,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: kind === "primitive" && value !== undefined ? 4 : 0,
        }}
        title={label}
      >
        {label ?? ""}
      </div>

      {kind === "primitive" && value !== undefined && (
        <div
          style={{
            fontWeight: 500,
            fontSize: 12,
            color: "#4a5568",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={String(value)} 
        >
          {String(value)}
        </div>
      )}

      {/* bottom handle with spacing */}
      <Handle
        type="source"
        id="b"
        position={Position.Bottom}
        style={{ bottom: -6, background: "#1a202c" }}
      />
    </div>
  );
}

export default function TreeCanvas({ graph, rfRef, highlightId, onNodeClick }) {
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(() => ({ json: JsonNode }), []);

  // fallback for empty
  const fallbackNodes = [
    {
      id: "sample-1",
      type: "json",
      position: { x: 200, y: 100 },
      data: { label: "Sample Node 1", kind: "object" },
    },
    {
      id: "sample-2",
      type: "json",
      position: { x: 520, y: 260 },
      data: { label: "Sample Node 2", kind: "primitive", value: "Hello" },
    },
  ];

  const fallbackEdges = [
    {
      id: "sample-edge",
      source: "sample-1",
      target: "sample-2",
      style: { stroke: "#4a5568", strokeWidth: 2 },
    },
  ];

  const activeNodes = graph?.nodes?.length ? graph.nodes : fallbackNodes;
  const activeEdges = graph?.edges?.length ? graph.edges : fallbackEdges;

  // inject highlight style per node
  const renderNodes = useMemo(() => {
    return activeNodes.map((n) => {
      const isHighlighted = n.id === highlightId;
      const kind = n.data?.kind;
      const baseBorder =
        kind === "primitive"
          ? "#e53e3e"
          : kind === "array"
          ? "#38a169"
          : "#3182ce";

      return {
        ...n,
        style: {
          background: isHighlighted ? "#f0fff4" : "#ffffff",
          border: `3px solid ${baseBorder}`,
          borderRadius: 12,
          boxShadow: isHighlighted
            ? "0 0 0 4px rgba(56,161,105,0.5), 0 4px 12px rgba(0,0,0,0.15)"
            : "0 4px 12px rgba(0,0,0,0.15)",
        },
      };
    });
  }, [activeNodes, highlightId]);

  // auto fit view once graph has real nodes
  useEffect(() => {
    if (!graph?.nodes?.length) return;
    const t = setTimeout(
      () => fitView({ padding: 0.2, duration: 300 }),
      0
    );
    return () => clearTimeout(t);
  }, [graph?.nodes?.length, fitView]);

  return (
    <div
      className="tree-canvas"
      style={{
        width: "100%",
        height: "100vh",
        background: "#f7fafc",
        position: "relative",
      }}
    >
      <ReactFlow
        ref={rfRef}
        nodes={renderNodes}
        edges={activeEdges}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          rfRef.current = instance;
        }}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        proOptions={{ hideAttribution: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Background gap={20} size={1} color="#cbd5e0" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
