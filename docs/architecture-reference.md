# 🏛️ Architecture Reference: 4-Layer Agentic Stack Migration

> ⚠️ **EXTERNAL REFERENCE & INSPIRATION BENCHMARK:**\
> This document specifies a 4-layer reference architecture inspired by an external third-party framework (derived from the video *"Essa é a stack perfeita de IA em 2026"*). It serves as a structural specification for AI agents (such as Codex) when analyzing, refactoring, or migrating pre-existing codebases to this agentic workflow model.

---

## 🎯 Migration Context & Objective

This repository is a **pre-existing project** being migrated to follow a modular, 4-layer agentic architecture. Agents consuming this specification must respect the strict separation between **Global Context Store** (cross-project memory & SOPs) and **Local Project Codebase** (repository-specific implementation and source code).

---

## 📌 Directory & Scope Convention

```text
~ (Home Directory)
├── ~/global-context-store/                <-- 🌍 Global / Cross-Project (Layers 1 & 2)
│   ├── index.md                           <-- Master Context Index & Routing Map
│   ├── skills/                            <-- Standard Operating Procedures (SOPs / skill.md)
│   ├── entities/                          <-- Profiles (Clients, Partners, Team)
│   ├── business/                          <-- Pricing, Offers & Commercial Scopes
│   └── brandings/                         <-- Brand Guidelines, Voice & Visual Specs
│
└── ~/projects/<project-repo>/             <-- 💻 Local Repository (This Pre-Existing Project)
    ├── AGENTS.md                          <-- Local Agent Entrypoint & Context Reader
    ├── architecture-reference.md          <-- This Specification File
    ├── src/                               <-- Application Source Code
    └── ... (Existing config & tools: Bun, Vite, Tailwind, etc.)
```

---

## 📐 The 4 Layers Specification

### Layer 1: Global Context Store & Grounding Layer
- **Core Concept:** Centralized persistent memory and structured knowledge base for AI grounding.
- **Mechanism:** Local Markdown store indexed by a master routing file (`index.md`).
- **Agent Instruction:** Read `index.md` at session initialization to locate relevant client/brand guidelines without polluting the active context window.
- **Global Structure:**
  - `brandings/`: Visual design systems, color palettes, typography, and tone of voice.
  - `entities/`: Technical sheets for clients, partners, and internal roles.
  - `business/`: Service packages, pricing tables, and commercial parameters.

### Layer 2: Standardized Skills & SOPs Layer
- **Core Concept:** Standard Operating Procedures (SOPs) encapsulated as executable markdown files (`skill.md`).
- **Rule of Thumb:** Any workflow performed manually >3 times must be codified into a `skill.md`.
- **Structure:** `skills/<skill-name>/skill.md` containing step-by-step instructions, constraints, validation gates, and pointers to Layer 1 context files.

### Layer 3: Multi-Agent Orchestration & Target Executors
- **Core Concept:** Workload distribution across specialized LLM models and code executors.
- **Target Stack & Topography:**
  - **Target Main Executor:** **Codex** (responsible for refactoring, component generation, and repository code maintenance).
  - **Orchestrator / Quality Gate (Judge):** High-reasoning model responsible for task breakdown, delegation, and code review validation.
  - *Reference Note:* The original third-party reference framework utilized Claude-based orchestration; this setup targets Codex as primary executor, with future Antigravity integration planned in a dedicated layer.

### Layer 4: External Tooling & Integration Layer (MCP / APIs / CLI)
- **Core Concept:** Connectors enabling agents to execute operations outside the chat interface via Model Context Protocol (MCP), REST APIs, CLI, or webhooks.
- **Reference Ecosystem Tools:**
  - **Communication:** Evolution API (WhatsApp bidirectional integration)
  - **Operational Database:** Supabase (relational & vector storage)
  - **Workflow Automation:** n8n / Make
  - **Audio/Meeting Ingestion:** Fathom, NotebookLM
  - **Deployment & Hosting:** Vercel

---

## 🚀 Migration & Execution Guidelines for Consuming Agents

When operating on this pre-existing codebase, consuming agents (e.g. Codex) MUST follow these rules:

1. **Preserve Existing Code Integrity:** Do not destroy or break existing working code during migration. Incrementally refactor modules to align with Layer 2 skills and Layer 1 context.
2. **Context Resolution Path:**
   - Look for local configuration in `AGENTS.md`.
   - Resolve global references via `~/global-context-store/index.md`.
3. **Incremental Skill Codification:** As new migration patterns or refactoring routines are established, document them as `skill.md` files in the global store.
4. **Code-First Target:** All code generation, component creation, and build script modifications must execute directly within the local project repository.
