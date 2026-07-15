# Tienda de Puntos - Claude Code Instructions

## Autonomous Agent Configuration

**Agent Skill:** `tienda-puntos-agent`  
**Project:** House of Panchos Loyalty Platform  
**Location:** ~/tienda-puntos (git repo)

### Model Selection Criteria

**HAIKU** (simple tasks):
- Documentation (README, API specs, comments)
- Minor fixes (typos, formatting, small logic bugs)
- Planning (roadmap, checklists, notes)

**SONNET** (medium complexity):
- Single-file fixes requiring context
- Unit tests (non-E2E)
- Component refactors (1-2 files)
- Schema updates (non-breaking)

**OPUS** (complex tasks):
- Features (new endpoints, pages, major components)
- Multi-file fixes (root cause analysis)
- E2E tests (Playwright)
- Architecture decisions, major refactors
- Integrations (WhatsApp, notifications)
- Database migrations

### Autonomous Permissions

Agent has full permissions to:
- ✅ Make commits (conventional format)
- ✅ Create branches (feature/, fix/, hotfix/)
- ✅ Push to GitHub
- ✅ Modify code (files, schemas, routes)
- ✅ Run servers for testing
- ✅ Write tests

Agent blocks and asks for manual input when:
- ❌ Git merge conflicts
- ❌ Test suite fails (root cause unclear)
- ❌ Design decision needed
- ❌ Deleting files/branches (confirmation required)
- ❌ Budget/quota exceeded

### Auto-Sync Configuration

**Drive:** `balesalejo@gmail.com` → "House of panchos tienda de puntos" folder
**Obsidian:** `~/Documents/Obsidian Vault/Tienda de Puntos - Club House of Panchos.md`
**GitHub:** Push to main (features) or develop (WIP)

**Trigger:** After every git commit or significant change

### Workflows

#### Quick Start
```bash
# In Claude Code terminal:
tienda-puntos-agent: [task description]

# Examples:
tienda-puntos-agent: add error logging to premio endpoint
tienda-puntos-agent: implement WhatsApp notifications for canjes
tienda-puntos-agent: fix cliente search with accented names
```

#### Manual Fallback
If agent is BLOCKED:
- Check Obsidian note for context
- Check Desktop shortcut "Tienda de Puntos - Agent" for status
- Review git log for recent changes
- Provide clarification, then re-invoke agent

### Project Context

**Tech Stack:**
- Backend: Node.js + Express + Prisma
- Admin UI: React 18 + Vite + Tailwind
- Mobile: React Native + Expo
- E2E: Playwright
- Deploy: Docker + Render

**Key Folders:**
- `/backend` — API, services, database
- `/web-admin` — React admin dashboard
- `/mobile` — React Native app
- `/e2e` — Playwright tests
- `/docs` — API + setup documentation

**Important Files:**
- `backend/src/routes/` — API endpoints
- `backend/src/services/` — Business logic
- `backend/prisma/schema.prisma` — Database schema
- `web-admin/src/pages/Dashboard.tsx` — Main admin page
- `web-admin/src/components/` — Admin UI components

### Testing

Before committing:
- Unit tests: `npm test` (backend)
- E2E tests: `npx playwright test` (web-admin)
- Manual testing: `npm run dev` (both servers)

Agent will run tests automatically and block if failures occur.

### Deployment

- **Dev:** `npm run dev` (ports 3000/3001)
- **Build:** `npm run build`
- **Deploy:** Render (configured in render.yaml)

Agent will not deploy to production without explicit user request.

---

## Session Logging

After each session, agent appends to Obsidian note:

```markdown
## Session YYYY-MM-DD (HH:MM)
**Status:** [In progress / Completed]
**Model used:** [Haiku / Sonnet / Opus]
**Changes:** [list of commits]
**Blockers:** [if any]
**Next:** [planned work]
```

---

**Last updated:** 2026-07-15  
**Maintained by:** tienda-puntos-agent + user oversight
