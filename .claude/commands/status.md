# Status Command

Show current project status.

## Usage
```
/status
```

## Workflow

1. Read `progress.txt` for current state
2. Read `IMPLEMENTATION_PLAN.md` for overall progress
3. Check git status for uncommitted changes
4. Run quick health checks

## Output Format

```markdown
## Project Status

### Current Task
[From progress.txt - what we're working on]

### Implementation Progress
- Phase 1: ████████░░ 80% (8/10 tasks)
- Phase 2: ░░░░░░░░░░ 0% (0/5 tasks)
- Overall: ████░░░░░░ 40%

### Git Status
- Branch: feature/xyz
- Uncommitted: 3 files
- Behind main: 2 commits

### Health Checks
- [ ] TypeScript: PASS
- [ ] Lint: 2 warnings
- [ ] Tests: PASS
- [ ] Build: PASS

### Next Steps
1. [Next task from plan]
2. [Following task]

### Blockers
- [Any issues noted in progress.txt]
```

## Quick Commands

After status, common follow-ups:
- `/plan` - Plan next task
- `/test` - Run tests
- `/review` - Review changes before commit
