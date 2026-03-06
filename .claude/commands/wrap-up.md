# Wrap-Up Command

End-of-session ritual to capture learnings and prepare for next session.

## Usage
```
/wrap-up
```

## Workflow

Run this command before ending any coding session.

### 1. Session Summary
```markdown
## Session Summary

**Duration:** [time]
**Branch:** [current branch]
**Commits:** [number of commits this session]

### Completed
- [x] Task 1
- [x] Task 2

### In Progress
- [ ] Task 3 (70% complete)

### Blocked
- [ ] Task 4 - Blocked by: [reason]
```

### 2. Quality Check
```bash
# Run all checks before wrap-up
npm run typecheck
npm run lint
npm test
npm run build
```

### 3. Capture Learnings

If any corrections were made during session:
```markdown
### New Learnings

**Trigger:** [What situation caused the mistake]
**Pattern:** [What went wrong]
**Rule:** [What to do instead]
```

### 4. Update Files
- [ ] Update `progress.txt` with current state
- [ ] Update `lessons.md` if corrections were made
- [ ] Update `IMPLEMENTATION_PLAN.md` progress
- [ ] Commit all changes

### 5. Prepare Next Session
```markdown
### Next Session Should

1. Start with: [specific task]
2. Watch out for: [potential issues]
3. Remember: [important context]
```

## Output Format

```markdown
## Wrap-Up Complete

### Session Stats
- Duration: 2h 15m
- Files changed: 12
- Commits: 3
- Tests added: 5

### Quality Gates
- [x] TypeScript: PASS
- [x] Lint: PASS
- [x] Tests: PASS
- [x] Build: PASS

### Learnings Captured
- 1 new rule added to lessons.md

### Progress Updated
- progress.txt: Updated
- IMPLEMENTATION_PLAN.md: 3 tasks marked complete

### Ready for Next Session
Next task: Implement user profile page
Context saved in progress.txt
```

## Rules

- Never skip wrap-up, even for short sessions
- Always run quality checks before wrapping up
- Capture learnings while fresh
- Leave clear trail for next session
