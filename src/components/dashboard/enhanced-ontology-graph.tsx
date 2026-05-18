"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import * as d3 from "d3"
import { useIntelBus } from "@/engine/intelligence/bus"
import { buildOntologyFromRegistry } from "@/engine/ontology/classifier"
import { CATEGORY_COLORS } from "@/design/blueprint-tokens"
import type { OntologyNode, OntologyEdge, OntologyGraph, RelationshipType } from "@/engine/ontology/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = "full" | "focus" | "causal" | "category"

interface GraphFilters {
  viewMode: ViewMode
  selectedNode: string | null
  focusCategory: string | null
  minStrength: number
  showEdgeTypes: Set<string>
  searchQuery: string
  priorityFilter: Set<string>
}

interface Props {
  lang?: "en" | "ms"
  height?: number
  onNodeClick?: (node: OntologyNode) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EDGE_COLORS: Record<string, string> = {
  DRIVES: "#00D4FF",
  LEADS: "#F59E0B",
  CORRELATES_POSITIVE: "#10B981",
  CORRELATES_NEGATIVE: "#EF4444",
  CONTAINS: "#1F2937",
  SHARES_GEOGRAPHY: "#1E3A5F",
  SHARES_FREQUENCY: "#0F172A",
  POLICY_TRANSMITS: "#8B5CF6",
}

// Short aliases used in the classifier for SHARES_GEOGRAPHY / SHARES_FREQUENCY
const EDGE_ALIAS: Record<string, string> = {
  SHARES_GEO: "SHARES_GEOGRAPHY",
  SHARES_FREQ: "SHARES_FREQUENCY",
}

const EDGE_DISTANCE: Record<string, number> = {
  CONTAINS: 120,
  DRIVES: 180,
  LEADS: 200,
  SHARES_GEOGRAPHY: 150,
  SHARES_GEO: 150,
  SHARES_FREQUENCY: 150,
  SHARES_FREQ: 150,
  POLICY_TRANSMITS: 170,
}

const EDGE_STRENGTH_MULT: Record<string, number> = {
  CONTAINS: 0.8,
}

const CAUSAL_TYPES = new Set(["DRIVES", "LEADS", "POLICY_TRANSMITS"])

const DIRECTED_TYPES = new Set(["DRIVES", "LEADS", "POLICY_TRANSMITS"])

const TIER_COLORS: Record<string, string> = {
  api: "#10B981",
  csv: "#F59E0B",
  static: "#6B7280",
}

const PRIORITY_COLORS: Record<string, string> = {
  P0: "#EF4444",
  P1: "#F59E0B",
  P2: "#3B82F6",
  P3: "#6B7280",
}

const ALL_EDGE_TYPES = [
  "DRIVES",
  "LEADS",
  "CORRELATES_POSITIVE",
  "CORRELATES_NEGATIVE",
  "CONTAINS",
  "SHARES_GEOGRAPHY",
  "SHARES_FREQUENCY",
  "POLICY_TRANSMITS",
]

const ALERT_PULSE_COLORS: Record<string, string> = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#3B82F6",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveEdgeType(type: string): string {
  return EDGE_ALIAS[type] ?? type
}

function getEdgeColor(type: string): string {
  return EDGE_COLORS[resolveEdgeType(type)] ?? "#4B5563"
}

function getEdgeDistance(type: string): number {
  return EDGE_DISTANCE[type] ?? 160
}

function getEdgeStrengthMult(type: string): number {
  return EDGE_STRENGTH_MULT[type] ?? 0.6
}

function truncate(s: string, max = 16): string {
  return s.length > max ? s.slice(0, max - 1) + "\u2026" : s
}

function dashPattern(type: string): string | null {
  const resolved = resolveEdgeType(type)
  if (resolved === "CORRELATES_NEGATIVE") return "4,4"
  if (resolved === "SHARES_GEOGRAPHY") return "2,6"
  if (resolved === "LEADS") return "6,3"
  return null
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Toolbar with search, view modes, strength slider, priority toggles */
function GraphToolbar({
  filters,
  onFiltersChange,
  lang,
}: {
  filters: GraphFilters
  onFiltersChange: (f: GraphFilters) => void
  lang: "en" | "ms"
}) {
  const toggleEdgeType = (et: string) => {
    const next = new Set(filters.showEdgeTypes)
    if (next.has(et)) next.delete(et)
    else next.add(et)
    onFiltersChange({ ...filters, showEdgeTypes: next })
  }

  const togglePriority = (p: string) => {
    const next = new Set(filters.priorityFilter)
    if (next.has(p)) next.delete(p)
    else next.add(p)
    onFiltersChange({ ...filters, priorityFilter: next })
  }

  const setViewMode = (vm: ViewMode) => {
    onFiltersChange({
      ...filters,
      viewMode: vm,
      focusCategory: vm === "category" ? filters.focusCategory ?? "Economy" : filters.focusCategory,
    })
  }

  const categories = Object.keys(CATEGORY_COLORS)

  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        right: 8,
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        zIndex: 20,
        pointerEvents: "auto",
      }}
    >
      {/* Search */}
      <input
        type="text"
        value={filters.searchQuery}
        onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
        placeholder={lang === "ms" ? "Cari dataset..." : "Search datasets..."}
        style={{
          background: "rgba(8,12,20,0.9)",
          border: "1px solid rgba(6,182,212,0.15)",
          borderRadius: 4,
          padding: "4px 10px",
          fontSize: 11,
          color: "#E0F7FA",
          fontFamily: "monospace",
          width: 180,
          outline: "none",
        }}
      />

      {/* View mode buttons */}
      {(
        [
          ["full", lang === "ms" ? "Penuh" : "Full"],
          ["focus", lang === "ms" ? "Fokus" : "Focus"],
          ["causal", lang === "ms" ? "Kausal" : "Causal"],
          ["category", lang === "ms" ? "Kategori" : "Category"],
        ] as [ViewMode, string][]
      ).map(([vm, label]) => (
        <button
          key={vm}
          onClick={() => setViewMode(vm)}
          style={{
            background:
              filters.viewMode === vm
                ? "rgba(6,182,212,0.2)"
                : "rgba(8,12,20,0.85)",
            border: `1px solid ${
              filters.viewMode === vm
                ? "rgba(6,182,212,0.5)"
                : "rgba(6,182,212,0.12)"
            }`,
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 10,
            fontFamily: "monospace",
            color: filters.viewMode === vm ? "#06b6d4" : "#ABB3BF",
            cursor: "pointer",
            fontWeight: filters.viewMode === vm ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}

      {/* Category selector (when category mode) */}
      {filters.viewMode === "category" && (
        <select
          value={filters.focusCategory ?? "Economy"}
          onChange={(e) =>
            onFiltersChange({ ...filters, focusCategory: e.target.value })
          }
          style={{
            background: "rgba(8,12,20,0.9)",
            border: "1px solid rgba(6,182,212,0.15)",
            borderRadius: 4,
            padding: "4px 8px",
            fontSize: 10,
            fontFamily: "monospace",
            color: "#E0F7FA",
            cursor: "pointer",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      {/* Strength slider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(8,12,20,0.85)",
          border: "1px solid rgba(6,182,212,0.12)",
          borderRadius: 4,
          padding: "2px 8px",
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "#6B7280",
          }}
        >
          {lang === "ms" ? "Kekuatan" : "Str"} &ge;{filters.minStrength.toFixed(1)}
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={filters.minStrength}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              minStrength: parseFloat(e.target.value),
            })
          }
          style={{ width: 60, height: 14, cursor: "pointer" }}
        />
      </div>

      {/* Priority toggles */}
      <div
        style={{
          display: "flex",
          gap: 3,
          background: "rgba(8,12,20,0.85)",
          border: "1px solid rgba(6,182,212,0.12)",
          borderRadius: 4,
          padding: "2px 6px",
        }}
      >
        {["P0", "P1", "P2", "P3"].map((p) => (
          <button
            key={p}
            onClick={() => togglePriority(p)}
            style={{
              background: filters.priorityFilter.has(p)
                ? `${PRIORITY_COLORS[p]}22`
                : "transparent",
              border: `1px solid ${
                filters.priorityFilter.has(p)
                  ? PRIORITY_COLORS[p]
                  : "rgba(107,114,128,0.3)"
              }`,
              borderRadius: 3,
              padding: "1px 6px",
              fontSize: 9,
              fontFamily: "monospace",
              color: filters.priorityFilter.has(p)
                ? PRIORITY_COLORS[p]
                : "#6B7280",
              cursor: "pointer",
              fontWeight: filters.priorityFilter.has(p) ? 600 : 400,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Edge type toggles */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          background: "rgba(8,12,20,0.85)",
          border: "1px solid rgba(6,182,212,0.12)",
          borderRadius: 4,
          padding: "2px 6px",
        }}
      >
        {ALL_EDGE_TYPES.map((et) => (
          <button
            key={et}
            onClick={() => toggleEdgeType(et)}
            style={{
              background: filters.showEdgeTypes.has(et)
                ? `${getEdgeColor(et)}22`
                : "transparent",
              border: `1px solid ${
                filters.showEdgeTypes.has(et)
                  ? getEdgeColor(et)
                  : "rgba(107,114,128,0.2)"
              }`,
              borderRadius: 3,
              padding: "1px 5px",
              fontSize: 8,
              fontFamily: "monospace",
              color: filters.showEdgeTypes.has(et)
                ? getEdgeColor(et)
                : "#6B7280",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {et.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Tooltip shown on node hover */
function NodeTooltip({
  node,
  x,
  y,
  lang,
  containerWidth,
}: {
  node: OntologyNode
  x: number
  y: number
  lang: "en" | "ms"
  containerWidth: number
}) {
  const label = lang === "ms" ? node.labelBM : node.label
  const color =
    node.type === "category"
      ? CATEGORY_COLORS[node.category]?.color ?? "#ABB3BF"
      : CATEGORY_COLORS[node.category]?.color ?? "#ABB3BF"

  const confidence = node.confidence ?? 1
  const confidencePct = Math.round(confidence * 100)

  const leftPos = Math.min(x + 16, containerWidth - 230)
  const topPos = y - 10

  return (
    <div
      style={{
        position: "absolute",
        left: leftPos,
        top: topPos,
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      <div
        style={{
          background: "rgba(8,12,20,0.96)",
          border: `1px solid ${color}40`,
          borderRadius: 6,
          padding: 10,
          minWidth: 180,
          maxWidth: 260,
          boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 16px ${color}15`,
          backdropFilter: "blur(12px)",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}60`,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#E0F7FA" }}>
            {truncate(label, 28)}
          </span>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {node.datasetId && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>ID</span>
              <span style={{ fontSize: 9, color: "#ABB3BF" }}>{node.datasetId}</span>
            </div>
          )}
          {node.latestValue != null && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>
                {lang === "ms" ? "Nilai" : "Value"}
              </span>
              <span style={{ fontSize: 9, color: "#E0F7FA", fontWeight: 600 }}>
                {node.latestValue.toLocaleString()}
                {node.unit ? ` ${node.unit}` : ""}
              </span>
            </div>
          )}
          {node.trend && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>
                {lang === "ms" ? "Trend" : "Trend"}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color:
                    node.trend === "up"
                      ? "#10B981"
                      : node.trend === "down"
                      ? "#EF4444"
                      : "#6B7280",
                }}
              >
                {node.trend === "up" ? "\u25B2" : node.trend === "down" ? "\u25BC" : "\u2014"}
              </span>
            </div>
          )}

          {/* Confidence bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: "#6B7280" }}>
              {lang === "ms" ? "Keyakinan" : "Conf"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  width: 50,
                  height: 4,
                  background: "rgba(107,114,128,0.2)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${confidencePct}%`,
                    height: "100%",
                    background:
                      confidencePct > 85
                        ? "#10B981"
                        : confidencePct > 60
                        ? "#F59E0B"
                        : "#EF4444",
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 9, color: "#ABB3BF" }}>{confidencePct}%</span>
            </div>
          </div>

          {/* Tier badge */}
          {node.tier && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>Tier</span>
              <span
                style={{
                  fontSize: 8,
                  color: TIER_COLORS[node.tier] ?? "#6B7280",
                  background: `${TIER_COLORS[node.tier] ?? "#6B7280"}15`,
                  border: `1px solid ${TIER_COLORS[node.tier] ?? "#6B7280"}30`,
                  borderRadius: 3,
                  padding: "0 4px",
                }}
              >
                {node.tier.toUpperCase()}
              </span>
            </div>
          )}

          {/* Priority badge */}
          {node.priority && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: "#6B7280" }}>
                {lang === "ms" ? "Keutamaan" : "Priority"}
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: PRIORITY_COLORS[node.priority] ?? "#6B7280",
                  fontWeight: 600,
                }}
              >
                {node.priority}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Legend for edge types */
function GraphLegend({ lang }: { lang: "en" | "ms" }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 8,
        left: 8,
        background: "rgba(8,12,20,0.92)",
        border: "1px solid rgba(6,182,212,0.12)",
        borderRadius: 6,
        padding: 10,
        zIndex: 15,
        backdropFilter: "blur(8px)",
        maxWidth: 200,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          fontWeight: 600,
          color: "#06b6d4",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        {lang === "ms" ? "LEGENDA" : "LEGEND"}
      </div>

      {/* Edge types */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "#6B7280",
            letterSpacing: "0.06em",
          }}
        >
          {lang === "ms" ? "JENIS PENGHUBUNG" : "EDGE TYPES"}
        </div>
        {ALL_EDGE_TYPES.filter(
          (et) => et !== "SHARES_GEOGRAPHY" && et !== "SHARES_FREQUENCY"
        ).map((et) => (
          <div key={et} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width={20} height={6} style={{ flexShrink: 0 }}>
              <line
                x1={0}
                y1={3}
                x2={20}
                y2={3}
                stroke={getEdgeColor(et)}
                strokeWidth={1.5}
                strokeDasharray={dashPattern(et) ?? "none"}
              />
            </svg>
            <span
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "#ABB3BF",
              }}
            >
              {et.replace(/_/g, " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Node types */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginTop: 8,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "#6B7280",
            letterSpacing: "0.06em",
          }}
        >
          {lang === "ms" ? "JENIS NOD" : "NODE TYPES"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "2px solid #ABB3BF",
              background: "rgba(171,179,191,0.1)",
            }}
          />
          <span style={{ fontSize: 8, fontFamily: "monospace", color: "#ABB3BF" }}>
            {lang === "ms" ? "Kategori" : "Category"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "1.5px solid #06b6d4",
              background: "rgba(6,182,212,0.15)",
            }}
          />
          <span style={{ fontSize: 8, fontFamily: "monospace", color: "#ABB3BF" }}>
            {lang === "ms" ? "Dataset" : "Dataset"}
          </span>
        </div>
      </div>

      {/* Tier legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginTop: 8,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "#6B7280",
            letterSpacing: "0.06em",
          }}
        >
          {lang === "ms" ? "TIER" : "TIERS"}
        </div>
        {(["api", "csv", "static"] as const).map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: TIER_COLORS[t],
              }}
            />
            <span style={{ fontSize: 8, fontFamily: "monospace", color: "#ABB3BF" }}>
              {t.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Stats bar showing counts */
function StatsBar({
  nodeCount,
  edgeCount,
  datasetCount,
  lang,
}: {
  nodeCount: number
  edgeCount: number
  datasetCount: number
  lang: "en" | "ms"
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        right: 8,
        background: "rgba(8,12,20,0.92)",
        border: "1px solid rgba(6,182,212,0.12)",
        borderRadius: 6,
        padding: "6px 10px",
        zIndex: 15,
        backdropFilter: "blur(8px)",
        display: "flex",
        gap: 12,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#06b6d4" }}>
          {nodeCount}
        </div>
        <div style={{ fontSize: 7, fontFamily: "monospace", color: "#6B7280" }}>
          {lang === "ms" ? "NOD" : "NODES"}
        </div>
      </div>
      <div style={{ width: 1, background: "rgba(6,182,212,0.12)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#10B981" }}>
          {edgeCount}
        </div>
        <div style={{ fontSize: 7, fontFamily: "monospace", color: "#6B7280" }}>
          {lang === "ms" ? "PENGHUBUNG" : "EDGES"}
        </div>
      </div>
      <div style={{ width: 1, background: "rgba(6,182,212,0.12)" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600, color: "#F59E0B" }}>
          {datasetCount}
        </div>
        <div style={{ fontSize: 7, fontFamily: "monospace", color: "#6B7280" }}>
          {lang === "ms" ? "DATASET" : "DATASETS"}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function EnhancedOntologyGraph({
  lang = "en",
  height = 600,
  onNodeClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<d3.Simulation<OntologyNode, OntologyEdge> | null>(null)

  const intelBus = useIntelBus()
  const [containerWidth, setContainerWidth] = useState(800)
  const [tooltip, setTooltip] = useState<{
    node: OntologyNode
    x: number
    y: number
  } | null>(null)

  const [filters, setFilters] = useState<GraphFilters>({
    viewMode: "full",
    selectedNode: null,
    focusCategory: null,
    minStrength: 0,
    showEdgeTypes: new Set(ALL_EDGE_TYPES),
    searchQuery: "",
    priorityFilter: new Set(["P0", "P1", "P2", "P3"]),
  })

  // ── A. Build graph data (once) ────────────────────────────────────────
  const ontologyGraph: OntologyGraph = useMemo(
    () => buildOntologyFromRegistry(),
    []
  )

  // ── B. Filtering logic ────────────────────────────────────────────────
  const filteredGraph = useMemo(() => {
    const { nodes, edges } = ontologyGraph
    const {
      viewMode,
      selectedNode,
      focusCategory,
      minStrength,
      showEdgeTypes,
      searchQuery,
      priorityFilter,
    } = filters

    // 1. Priority filter: always show category nodes; filter dataset nodes by priority
    let filteredNodes = nodes.filter((n) => {
      if (n.type === "category") return true
      const p = n.priority ?? "P3"
      return priorityFilter.has(p)
    })

    // 2. Search filter: match label, labelBM, datasetId, tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filteredNodes = filteredNodes.filter((n) => {
        if (n.type === "category") {
          // Keep category nodes in search results if their name matches
          // or if any of their child datasets match (we keep them for structure)
          return true
        }
        const fields = [
          n.label,
          n.labelBM,
          n.datasetId,
          ...(n.tags ?? []),
        ]
          .filter(Boolean)
          .map((s) => s.toLowerCase())
        return fields.some((f) => f.includes(q))
      })
    }

    // Build node id set for edge filtering
    const nodeIds = new Set(filteredNodes.map((n) => n.id))

    // 3. Edge type filter
    let filteredEdges = edges.filter((e) => {
      const resolved = resolveEdgeType(e.type)
      return showEdgeTypes.has(resolved) || showEdgeTypes.has(e.type)
    })

    // 4. Strength filter (skip CONTAINS edges)
    filteredEdges = filteredEdges.filter((e) => {
      if (e.type === "CONTAINS") return true
      return e.strength >= minStrength
    })

    // 5. Only keep edges whose source/target are in filtered nodes
    filteredEdges = filteredEdges.filter((e) => {
      const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
      const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
      return nodeIds.has(srcId) && nodeIds.has(tgtId)
    })

    // 6. View mode filters
    if (viewMode === "focus" && selectedNode) {
      // Show only selected node + its neighbours
      const neighbourIds = new Set<string>([selectedNode])
      filteredEdges.forEach((e) => {
        const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
        const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
        if (srcId === selectedNode) neighbourIds.add(tgtId)
        if (tgtId === selectedNode) neighbourIds.add(srcId)
      })
      filteredNodes = filteredNodes.filter((n) => neighbourIds.has(n.id))
      filteredEdges = filteredEdges.filter((e) => {
        const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
        const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
        return neighbourIds.has(srcId) && neighbourIds.has(tgtId)
      })
    } else if (viewMode === "causal") {
      // Only DRIVES, LEADS, POLICY_TRANSMITS edges
      filteredEdges = filteredEdges.filter((e) => CAUSAL_TYPES.has(e.type))
      // Keep nodes that are endpoints of causal edges
      const causalNodeIds = new Set<string>()
      filteredEdges.forEach((e) => {
        const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
        const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
        causalNodeIds.add(srcId)
        causalNodeIds.add(tgtId)
      })
      filteredNodes = filteredNodes.filter((n) => causalNodeIds.has(n.id))
    } else if (viewMode === "category" && focusCategory) {
      // Only nodes matching focusCategory
      filteredNodes = filteredNodes.filter((n) => n.category === focusCategory)
      const catNodeIds = new Set(filteredNodes.map((n) => n.id))
      filteredEdges = filteredEdges.filter((e) => {
        const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
        const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
        return catNodeIds.has(srcId) && catNodeIds.has(tgtId)
      })
    }

    // Ensure all edges reference valid nodes
    const finalNodeIds = new Set(filteredNodes.map((n) => n.id))
    filteredEdges = filteredEdges.filter((e) => {
      const srcId = typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id
      const tgtId = typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id
      return finalNodeIds.has(srcId) && finalNodeIds.has(tgtId)
    })

    return { nodes: filteredNodes, edges: filteredEdges }
  }, [ontologyGraph, filters])

  // ── Responsive container width ────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 0) setContainerWidth(w)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // ── Intel Bus: sync selected object ───────────────────────────────────
  useEffect(() => {
    if (intelBus.selectedObjectId && !filters.selectedNode) {
      setFilters((prev) => ({ ...prev, selectedNode: intelBus.selectedObjectId, viewMode: "focus" }))
    }
  }, [intelBus.selectedObjectId])

  // ── C. D3 Rendering ──────────────────────────────────────────────────
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const w = containerWidth
    const h = height

    // Clean previous
    d3.select(svg).selectAll("*").remove()

    const svgSel = d3
      .select(svg)
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", `0 0 ${w} ${h}`)

    // ── Defs ──────────────────────────────────────────────────────────
    const defs = svgSel.append("defs")

    // Glow filter
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur")
    const feMerge = glowFilter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Strong glow for selected nodes
    const strongGlow = defs
      .append("filter")
      .attr("id", "glow-strong")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
    strongGlow
      .append("feGaussianBlur")
      .attr("stdDeviation", "8")
      .attr("result", "coloredBlur")
    const feMerge2 = strongGlow.append("feMerge")
    feMerge2.append("feMergeNode").attr("in", "coloredBlur")
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic")

    // Alert pulse glow
    const alertGlow = defs
      .append("filter")
      .attr("id", "alert-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
    alertGlow
      .append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "coloredBlur")
    const feMerge3 = alertGlow.append("feMerge")
    feMerge3.append("feMergeNode").attr("in", "coloredBlur")
    feMerge3.append("feMergeNode").attr("in", "SourceGraphic")

    // Arrow markers for each edge type
    ALL_EDGE_TYPES.forEach((et) => {
      const color = getEdgeColor(et)
      defs
        .append("marker")
        .attr("id", `arrow-${et}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 30)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .attr("fill", color)
        .attr("opacity", 0.7)
    })

    // Grid pattern
    const gridPattern = defs
      .append("pattern")
      .attr("id", "grid-bg")
      .attr("width", 30)
      .attr("height", 30)
      .attr("patternUnits", "userSpaceOnUse")
    gridPattern
      .append("path")
      .attr("d", "M 30 0 L 0 0 0 30")
      .attr("fill", "none")
      .attr("stroke", "rgba(6,182,212,0.04)")
      .attr("stroke-width", 0.5)

    // Background
    svgSel
      .append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "#080C14")

    svgSel
      .append("rect")
      .attr("width", w)
      .attr("height", h)
      .attr("fill", "url(#grid-bg)")

    // ── Zoom group ────────────────────────────────────────────────────
    const g = svgSel.append("g")

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svgSel.call(zoom)

    // ── Clone data for simulation ─────────────────────────────────────
    const simNodes: OntologyNode[] = filteredGraph.nodes.map((n) => ({ ...n }))
    const simEdges: OntologyEdge[] = filteredGraph.edges.map((e) => ({
      ...e,
      source: typeof e.source === "string" ? e.source : (e.source as unknown as OntologyNode).id,
      target: typeof e.target === "string" ? e.target : (e.target as unknown as OntologyNode).id,
    }))

    if (simNodes.length === 0) {
      // No nodes to render
      g.append("text")
        .attr("x", w / 2)
        .attr("y", h / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#6B7280")
        .attr("font-family", "monospace")
        .attr("font-size", 14)
        .text(lang === "ms" ? "Tiada data dipapar" : "No data to display")
      return
    }

    // ── Force simulation ──────────────────────────────────────────────
    const simulation = d3
      .forceSimulation<OntologyNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<OntologyNode, OntologyEdge>(simEdges)
          .id((d) => d.id)
          .distance((d) => getEdgeDistance(d.type))
          .strength((d) => {
            const mult = getEdgeStrengthMult(d.type)
            return d.type === "CONTAINS" ? mult : d.strength * mult
          })
      )
      .force(
        "charge",
        d3
          .forceManyBody<OntologyNode>()
          .strength((d) => (d.type === "category" ? -800 : -300))
      )
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force(
        "collide",
        d3.forceCollide<OntologyNode>((d) => {
          const s = d.type === "category" ? 45 : (d.size ?? 20) * 1.5
          return s + 8
        })
      )

    simRef.current = simulation

    // ── Draw edges ────────────────────────────────────────────────────
    const edgeGroup = g.append("g").attr("class", "edges")

    const edgeElements = edgeGroup
      .selectAll<SVGLineElement, OntologyEdge>("line")
      .data(simEdges)
      .join("line")
      .attr("stroke", (d) => getEdgeColor(d.type))
      .attr("stroke-width", (d) => {
        if (d.type === "CONTAINS") return 0.8
        return 1 + d.strength * 2.5
      })
      .attr("stroke-opacity", (d) => {
        if (d.type === "CONTAINS") return 0.15
        return 0.25 + d.strength * 0.35
      })
      .attr("stroke-dasharray", (d) => dashPattern(d.type) ?? "none")
      .attr("marker-end", (d) =>
        DIRECTED_TYPES.has(d.type) ? `url(#arrow-${d.type})` : "none"
      )

    // ── Draw nodes ────────────────────────────────────────────────────
    const nodeGroup = g.append("g").attr("class", "nodes")

    const nodeElements = nodeGroup
      .selectAll<SVGGElement, OntologyNode>("g")
      .data(simNodes, (d) => d.id)
      .join("g")
      .attr("class", "node")
      .style("cursor", "grab")

    // Highlighted/selected check helper
    const isHighlighted = (d: OntologyNode) =>
      intelBus.highlightedIds.includes(d.id)

    const isSelected = (d: OntologyNode) =>
      filters.selectedNode === d.id ||
      intelBus.selectedObjectId === d.id

    // For each node, render visuals
    nodeElements.each(function (d) {
      const nodeG = d3.select(this)
      const isCat = d.type === "category"
      const size = isCat ? 40 : (d.size ?? 18)
      const nodeColor =
        CATEGORY_COLORS[d.category]?.color ?? d.color ?? "#ABB3BF"
      const highlighted = isHighlighted(d)
      const selected = isSelected(d)

      // Alert pulse ring (behind everything)
      if (d.alertLevel) {
        const pulseColor = ALERT_PULSE_COLORS[d.alertLevel] ?? "#EF4444"
        nodeG
          .append("circle")
          .attr("class", "alert-pulse")
          .attr("r", size + 8)
          .attr("fill", "none")
          .attr("stroke", pulseColor)
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "3,5")
          .attr("opacity", 0.4)
          .attr("filter", "url(#alert-glow)")
      }

      // Confidence ring (dashed)
      if (d.confidence != null && d.confidence < 1) {
        nodeG
          .append("circle")
          .attr("class", "confidence-ring")
          .attr("r", size + 4)
          .attr("fill", "none")
          .attr("stroke", nodeColor)
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3,3")
          .attr("opacity", 0.35)
      }

      // Main circle
      nodeG
        .append("circle")
        .attr("class", "main-circle")
        .attr("r", size)
        .attr("fill", `${nodeColor}1A`) // 10% opacity fill
        .attr("stroke", nodeColor)
        .attr("stroke-width", isCat ? 2 : 1.5)
        .attr(
          "filter",
          selected || highlighted
            ? "url(#glow-strong)"
            : d.alertLevel
            ? "url(#alert-glow)"
            : "url(#glow)"
        )

      // Category icon / letter
      if (isCat) {
        nodeG
          .append("text")
          .attr("class", "cat-icon")
          .attr("text-anchor", "middle")
          .attr("dy", 1)
          .attr("fill", nodeColor)
          .attr("font-size", 14)
          .attr("font-weight", 700)
          .attr("font-family", "monospace")
          .attr("opacity", 0.7)
          .text(CATEGORY_COLORS[d.category]?.icon ?? d.category.charAt(0))
      }

      // Tier indicator dot (top-right)
      if (d.tier && !isCat) {
        const tierColor = TIER_COLORS[d.tier] ?? "#6B7280"
        const dotR = size * 0.22
        nodeG
          .append("circle")
          .attr("class", "tier-dot")
          .attr("cx", size * 0.65)
          .attr("cy", -size * 0.65)
          .attr("r", dotR)
          .attr("fill", tierColor)
          .attr("stroke", "#080C14")
          .attr("stroke-width", 1)
      }

      // Trend arrow (bottom)
      if (d.trend && !isCat) {
        const trendChar =
          d.trend === "up" ? "\u25B2" : d.trend === "down" ? "\u25BC" : "\u2014"
        const trendColor =
          d.trend === "up"
            ? "#10B981"
            : d.trend === "down"
            ? "#EF4444"
            : "#6B7280"
        nodeG
          .append("text")
          .attr("class", "trend-arrow")
          .attr("text-anchor", "middle")
          .attr("dy", size + 12)
          .attr("fill", trendColor)
          .attr("font-size", 8)
          .attr("font-family", "monospace")
          .text(trendChar)
      }

      // Label text
      const label = lang === "ms" ? d.labelBM : d.label
      nodeG
        .append("text")
        .attr("class", "node-label")
        .attr("text-anchor", "middle")
        .attr("dy", isCat ? size + 14 : size + 10)
        .attr("fill", isCat ? nodeColor : "#C0CDD8")
        .attr("font-size", isCat ? 9 : 8)
        .attr("font-family", "monospace")
        .attr("font-weight", isCat ? 600 : 400)
        .text(truncate(label))
    })

    // ── Drag behavior ─────────────────────────────────────────────────
    const drag = d3
      .drag<SVGGElement, OntologyNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on("drag", (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeElements.call(drag)

    // ── Click handler ─────────────────────────────────────────────────
    nodeElements.on("click", (_event, d) => {
      _event.stopPropagation()
      const newSelected = filters.selectedNode === d.id ? null : d.id
      setFilters((prev) => ({
        ...prev,
        selectedNode: newSelected,
        viewMode: newSelected ? "focus" : prev.viewMode === "focus" ? "full" : prev.viewMode,
      }))
      intelBus.selectObject(newSelected)
      if (d.datasetId) {
        intelBus.setContext(d.datasetId, "ontology")
      }
      onNodeClick?.(d)
    })

    // ── Hover handler ─────────────────────────────────────────────────
    nodeElements
      .on("mouseenter", (_event, d) => {
        // Highlight this node's edges
        const neighbourIds = new Set([d.id])
        edgeElements
          .attr("stroke-opacity", (e) => {
            const srcId = typeof e.source === "string" ? e.source : (e.source as OntologyNode).id
            const tgtId = typeof e.target === "string" ? e.target : (e.target as OntologyNode).id
            if (srcId === d.id || tgtId === d.id) {
              neighbourIds.add(srcId)
              neighbourIds.add(tgtId)
              return e.type === "CONTAINS" ? 0.5 : 0.6 + e.strength * 0.4
            }
            return e.type === "CONTAINS" ? 0.06 : 0.08
          })

        nodeElements.attr("opacity", (n) =>
          neighbourIds.has(n.id) ? 1 : 0.2
        )

        setTooltip({
          node: d,
          x: _event.offsetX,
          y: _event.offsetY,
        })
      })
      .on("mouseleave", () => {
        // Reset highlights
        edgeElements.attr("stroke-opacity", (d) => {
          if (d.type === "CONTAINS") return 0.15
          return 0.25 + d.strength * 0.35
        })
        nodeElements.attr("opacity", 1)
        setTooltip(null)
      })

    // ── Background click to deselect ──────────────────────────────────
    svgSel.on("click", () => {
      setFilters((prev) => ({
        ...prev,
        selectedNode: null,
        viewMode: prev.viewMode === "focus" ? "full" : prev.viewMode,
      }))
      intelBus.selectObject(null)
      setTooltip(null)
    })

    // ── Tick update ───────────────────────────────────────────────────
    simulation.on("tick", () => {
      edgeElements
        .attr("x1", (d) => (d.source as OntologyNode).x ?? 0)
        .attr("y1", (d) => (d.source as OntologyNode).y ?? 0)
        .attr("x2", (d) => (d.target as OntologyNode).x ?? 0)
        .attr("y2", (d) => (d.target as OntologyNode).y ?? 0)

      nodeElements.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Stop simulation after initial layout to save CPU
    simulation.on("end", () => {
      simulation.stop()
    })

    // If few enough nodes, let it settle quickly
    if (simNodes.length < 20) {
      simulation.alphaDecay(0.03)
    }

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      simulation.stop()
      simRef.current = null
    }
  }, [filteredGraph, containerWidth, height, lang, intelBus.highlightedIds, intelBus.selectedObjectId, filters.selectedNode])

  // ── Cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (simRef.current) {
        simRef.current.stop()
        simRef.current = null
      }
    }
  }, [])

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const dsCount = filteredGraph.nodes.filter((n) => n.type === "dataset").length
    return {
      nodeCount: filteredGraph.nodes.length,
      edgeCount: filteredGraph.edges.length,
      datasetCount: dsCount,
    }
  }, [filteredGraph])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height,
        background: "#080C14",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(6,182,212,0.1)",
      }}
    >
      {/* SVG canvas */}
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        aria-label="Enhanced data ontology graph showing relationships between Malaysia datasets"
        role="img"
      />

      {/* Toolbar */}
      <GraphToolbar filters={filters} onFiltersChange={setFilters} lang={lang} />

      {/* Stats bar */}
      <StatsBar
        nodeCount={stats.nodeCount}
        edgeCount={stats.edgeCount}
        datasetCount={stats.datasetCount}
        lang={lang}
      />

      {/* Tooltip */}
      {tooltip && (
        <NodeTooltip
          node={tooltip.node}
          x={tooltip.x}
          y={tooltip.y}
          lang={lang}
          containerWidth={containerWidth}
        />
      )}

      {/* Legend */}
      <GraphLegend lang={lang} />
    </div>
  )
}

export default EnhancedOntologyGraph
