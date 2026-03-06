# CLAUDE.md

---
## PROJECT CONFIGURATION
---

> **ASK USER**: Complete this section by asking the user at project start.

### Project Info

- **Name**: [ASK: What is the project name?]
- **Goal**: [ASK: Describe the project goal in one sentence]
- **Type**: [ASK: web app | mobile app | game | API | library | other]

### Tech Stack

> **ASK USER**: What technologies are you using? Document in `TECH_STACK.md`

- Framework: [ASK]
- Language: [ASK]
- Styling: [ASK if applicable]
- Database: [ASK if applicable]
- Auth: [ASK if applicable]
- Testing: [ASK - unit and e2e tools]

### Design System

> **ASK USER**: Do you have a design system? Document in `FRONTEND_GUIDELINES.md`

- Primary color: [ASK]
- Secondary color: [ASK]
- Font family: [ASK]
- Spacing scale: [ASK]

### Project-Specific Rules

> **ASK USER**: Any specific rules or constraints for this project?

- [ASK for forbidden patterns]
- [ASK for required patterns]
- [ASK for naming conventions]

---
## PROJECT STRUCTURE
---

```
project-root/
│
│   ═══════════════════════════════════════════════════════════
│   CLAUDE CODE CONFIG
│   ═══════════════════════════════════════════════════════════
│
├── CLAUDE.md                  # AI rules and context (read first every session)
├── .claude/
│   ├── settings.json          # Project configuration
│   ├── commands/              # Custom commands
│   │   ├── plan.md            # /plan - Enter planning mode
│   │   ├── review.md          # /review - Code review
│   │   ├── test.md            # /test - Run tests
│   │   ├── status.md          # /status - Project status
│   │   ├── wrap-up.md         # /wrap-up - End session ritual
│   │   └── learn.md           # /learn - Capture learnings
│   ├── agents/                # Specialized agents
│   │   ├── researcher.md      # Codebase research
│   │   ├── implementer.md     # Focused implementation
│   │   ├── reviewer.md        # Code review
│   │   └── planner.md         # Task decomposition
│   ├── contexts/              # Work modes
│   │   ├── dev.md             # Building mode
│   │   ├── review.md          # Review mode (read-only)
│   │   └── research.md        # Exploration mode
│   └── skills/                # Reusable skills
│       ├── code-review.md     # SOLID, security, perf checklist
│       └── pro-workflow.md    # Power user patterns
│
│   ═══════════════════════════════════════════════════════════
│   CANONICAL DOCS (Knowledge Base - Write BEFORE coding)
│   ═══════════════════════════════════════════════════════════
│
├── progress.txt               # Session tracking (external memory)
├── lessons.md                 # Self-improvement loop (update after corrections)
├── PRD.md                     # Product Requirements Document (the contract)
├── APP_FLOW.md                # User flows and navigation paths
├── TECH_STACK.md              # Locked dependencies with exact versions
├── FRONTEND_GUIDELINES.md     # Design system (colors, spacing, typography)
├── BACKEND_STRUCTURE.md       # Database schema and API spec
├── IMPLEMENTATION_PLAN.md     # Step-by-step build order
├── README.md                  # Project overview
│
│   ═══════════════════════════════════════════════════════════
│   BACKEND
│   ═══════════════════════════════════════════════════════════
│
├── backend/
│   ├── config/
│   │   ├── db.config.js           # Database configuration
│   │   └── env.config.js          # Environment variables configuration
│   │
│   ├── controllers/               # Request handlers
│   ├── middleware/                # Auth, error handling, validation
│   ├── models/                    # Database schemas
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic (email, payment, storage)
│   ├── utils/                     # Helpers, logger, constants
│   ├── views/                     # Email templates
│   ├── uploads/                   # Uploaded files
│   ├── tests/                     # Backend tests
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Server entry point
│   └── package.json               # Backend dependencies
│
│   ═══════════════════════════════════════════════════════════
│   FRONTEND
│   ═══════════════════════════════════════════════════════════
│
├── frontend/
│   ├── public/
│   │   ├── index.html             # Main HTML file
│   │   └── assets/                # Static assets
│   │
│   ├── src/
│   │   ├── app/                   # Pages and routes
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI components
│   │   │   ├── layout/            # Layout components
│   │   │   └── forms/             # Form components
│   │   ├── pages/                 # Page components
│   │   ├── routes/                # Routing configuration
│   │   ├── services/              # API services
│   │   ├── hooks/                 # Custom hooks
│   │   ├── context/               # Global state
│   │   ├── store/                 # Redux/Zustand store
│   │   ├── lib/                   # Utilities
│   │   ├── styles/                # Global styles
│   │   ├── App.jsx                # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Base CSS
│   │
│   ├── .env                       # Frontend environment variables
│   └── package.json               # Frontend dependencies
│
│   ═══════════════════════════════════════════════════════════
│   SHARED
│   ═══════════════════════════════════════════════════════════
│
├── shared/
│   ├── types/                     # Shared TypeScript types/interfaces
│   ├── constants/                 # Shared constants
│   └── utils/                     # Shared utilities
│
│   ═══════════════════════════════════════════════════════════
│   CONFIG & META
│   ═══════════════════════════════════════════════════════════
│
├── docs/                          # Project documentation
├── .env                           # Root secrets (NEVER COMMIT)
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Prettier configuration
├── docker-compose.yml             # Docker services
└── package.json                   # Root scripts
```

---
## CANONICAL DOCUMENTATION
---

> **IMPORTANT**: The documentation files (PRD.md, APP_FLOW.md, etc.) are TEMPLATES.
> At project start, ask the user to fill them or help them complete each one.
> Do NOT use placeholder content in production. Each file must contain real project data.

### How to Use Templates

1. **First session**: Ask user about each document, help fill with real data
2. **If a file has `[placeholder]` content**: Ask user for the real information
3. **If a file is empty or missing**: Create it by asking user relevant questions
4. **Once filled**: Treat as source of truth, reference during development

| File | Purpose | When to Reference |
|------|---------|-------------------|
| `CLAUDE.md` | AI operating manual | Every session start |
| `progress.txt` | External memory between sessions | Every session start/end |
| `lessons.md` | Self-improvement rules | After every mistake |
| `PRD.md` | What you're building (scope) | When scope creeps |
| `APP_FLOW.md` | User navigation paths | Building page transitions |
| `TECH_STACK.md` | Locked dependencies | Project init, adding packages |
| `FRONTEND_GUIDELINES.md` | Design system tokens | Every component creation |
| `BACKEND_STRUCTURE.md` | Database & API contracts | Building data layer |
| `IMPLEMENTATION_PLAN.md` | Step-by-step build sequence | Every coding session |
| `.claude/skills/code-review.md` | Code review checklist (SOLID, security, perf) | Before marking task complete |

### Template Usage Instructions

The documentation files (PRD.md, APP_FLOW.md, TECH_STACK.md, etc.) are **templates**.

**At project start:**
1. Read each template to understand its purpose
2. ASK the user for the information needed to complete each section
3. Replace placeholder text `[brackets]` with actual project information
4. Delete example content and replace with real content
5. Keep the structure, change the content

**Rules:**
- Do NOT use templates as-is with placeholder text
- Do NOT start coding until templates are filled with real project data
- Do NOT invent information - ASK the user if unclear
- Documentation FIRST, code SECOND

---
## SESSION WORKFLOW
---

```
┌─────────────────────────────────────────────────────────────┐
│  START SESSION                                              │
│  1. AI reads CLAUDE.md (automatically)                      │
│  2. AI reads progress.txt (where we left off)               │
│  3. AI reads lessons.md (avoid past mistakes)               │
│  4. AI reads IMPLEMENTATION_PLAN.md (current step)          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BUILD                                                      │
│  "Build step X.X from IMPLEMENTATION_PLAN.md"               │
│  Reference: APP_FLOW.md, FRONTEND_GUIDELINES.md, etc.       │
│  Apply backpressure at each step                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  END SESSION                                                │
│  1. git commit -m "description"                             │
│  2. Update progress.txt                                     │
│  3. If corrections made → Update lessons.md                 │
└─────────────────────────────────────────────────────────────┘
```

---
## COMMANDS, AGENTS, CONTEXTS & SKILLS
---

### Commands (/.claude/commands/)

| Command | Description |
|---------|-------------|
| `/plan <task>` | Enter planning mode, create step-by-step plan |
| `/review [scope]` | Run code review (staged, branch, file, last) |
| `/test [scope]` | Run tests (all, unit, e2e, file, changed) |
| `/status` | Show project status and progress |
| `/wrap-up` | End-of-session ritual (quality checks, learnings, progress) |
| `/learn <desc>` | Capture a learning from correction or discovery |

### Agents (/.claude/agents/)

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| **Researcher** | Codebase exploration | Before implementing, finding existing code |
| **Implementer** | Focused implementation | One task at a time, with tests |
| **Reviewer** | Code review | Before merge, after implementation |
| **Planner** | Task decomposition | Complex tasks with 3+ steps |

### Contexts (/.claude/contexts/)

| Context | Mode | Behavior |
|---------|------|----------|
| **dev** | Building | Code first, iterate fast, commit often |
| **review** | Reviewing | Read-only, security focus, document findings |
| **research** | Exploring | Gather info, summarize, plan before acting |

### Skills (/.claude/skills/)

| Skill | Purpose |
|-------|---------|
| **code-review** | SOLID, security, performance, error handling checklist |
| **pro-workflow** | Power user patterns (80/20, self-correction, wrap-up) |

### Using Subagents

```
Main Agent (Orchestrator)
    │
    ├── spawn Researcher → "Find how auth is implemented"
    │   └── returns context
    │
    ├── spawn Planner → "Break down user profile feature"
    │   └── returns step-by-step plan
    │
    ├── spawn Implementer → "Add password reset feature"
    │   └── returns implementation
    │
    └── spawn Reviewer → "Review changes"
        └── returns findings
```

**Rules:**
- Use subagents for focused tasks
- One task per subagent
- Main agent coordinates and decides
- Subagents keep main context window clean

---

---

## PRO WORKFLOW PATTERNS
---

> "80% of code is written by AI, 20% is spent reviewing and correcting." — Karpathy

### Self-Correction Loop

When user corrects you:
1. Acknowledge the correction
2. Propose a rule to prevent recurrence
3. After approval, add to `lessons.md`
4. Apply immediately and in future sessions

### 80/20 Review

- Let AI do 80% of the work
- Review at checkpoints, not every line
- Batch corrections instead of interrupting
- Trust but verify at milestones

### Context Discipline

200k token budget management:
- Keep `lessons.md` concise (<100 lines)
- Use subagents for exploration
- Clear context when switching tasks
- Summarize long discussions

### Wrap-Up Ritual

End every session with `/wrap-up`:
1. Run quality checks
2. Capture learnings
3. Update progress.txt
4. Prepare next session context

### Planning Before Doing

For tasks with 3+ steps:
1. Enter plan mode (`/plan`)
2. Research codebase
3. Write step-by-step plan
4. Get approval
5. Then implement

---

## WORKFLOW ORCHESTRATION
---

### 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - do not keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update `lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - do not over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Do not ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---
## TASK MANAGEMENT
---

1. **Plan First**: Write plan to `IMPLEMENTATION_PLAN.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `IMPLEMENTATION_PLAN.md`
6. **Capture Lessons**: Update `lessons.md` after corrections

---
## BACKPRESSURE SYSTEM
---

Backpressure signals reject invalid code and force correction.

### Levels

**Level 1 - Static Analysis**
- TypeScript/type checking
- Linting (ESLint, Prettier)

**Level 2 - Unit Tests**
- Run unit test suite
- Check coverage

**Level 3 - E2E Tests**
- Use Playwright MCP if available
- Test complete user flows
- Verify UI in real browser

**Level 4 - Build**
- Production build must pass
- No errors or warnings

**Level 5 - Code Review (self)**
- Run through `CODE_REVIEW.md` checklist
- Check SOLID principles
- Security scan
- Performance review
- Boundary conditions

### Rule

Before marking ANY task complete:
1. Static analysis passes
2. Unit tests pass
3. E2E tests pass (if applicable)
4. Build passes
5. Self code review passes (no P0/P1 issues)

If ANY level fails, fix before continuing.

---
## PLAYWRIGHT MCP INTEGRATION
---

### When to Use

- Validate new features end-to-end
- Verify critical user flows
- Test integrations (auth, payments, etc.)
- Regression testing after changes

### Flow

1. Implement feature
2. Use Playwright MCP to navigate, interact, verify
3. If test fails, fix and repeat
4. If test passes, mark task complete

---
## CORE PRINCIPLES
---

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what is necessary. Avoid introducing bugs.
- **Search First**: Before implementing, search if it already exists.
- **Prove It Works**: Demonstrate with tests that it works.

---
## CRITICAL RULES
---

- `.env` → NEVER commit, NEVER share, NEVER screenshot
- Documentation FIRST → Write all .md files BEFORE any code
- One feature at a time → Small pieces, tested independently
- Update `progress.txt` → After EVERY completed feature
- Update `lessons.md` → After EVERY AI correction

---
## FORBIDDEN
---

- Commit without tests passing
- Assume something does not exist (search first)
- Leave TODOs or placeholders
- Mark complete without backpressure verification
- Ignore type errors
- Skip tests because "it worked manually"

---
## NOTES
---

[Project-specific notes added during development]
