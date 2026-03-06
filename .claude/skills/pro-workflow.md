# Pro Workflow Skill

> Battle-tested patterns from Claude Code power users.
> "80% of code is written by AI, 20% is spent reviewing and correcting." — Karpathy

## Core Patterns

### 1. Self-Correction Loop

When user corrects you:
1. Acknowledge the correction
2. Propose a rule to prevent recurrence
3. After user approval, add to `lessons.md`
4. Apply immediately and in future sessions

```
User: "Don't use inline styles, use Tailwind"
Claude: "Got it. Rule proposal: Never use inline styles, always use Tailwind classes. Add to lessons.md?"
User: "Yes"
Claude: [Adds rule, applies going forward]
```

### 2. 80/20 Review Ratio

- Let AI do 80% of the work
- Review at checkpoints, not every line
- Batch corrections instead of interrupting
- Trust but verify at milestones

**Checkpoints:**
- After completing a feature
- Before commit
- Before merge
- After tests pass

### 3. Parallel Worktrees

Zero dead time while AI thinks:
```bash
# Create parallel worktree
git worktree add ../project-feature feature-branch

# Work in one while Claude thinks in another
# Switch when Claude finishes
```

### 4. Context Discipline

200k token budget management:
- Keep `lessons.md` concise (<100 lines)
- Summarize long discussions
- Use subagents for exploration
- Clear context when switching tasks

### 5. Wrap-Up Ritual

End every session with `/wrap-up`:
1. Run quality checks
2. Capture learnings
3. Update progress
4. Prepare next session

### 6. Model Selection

| Task | Model | Why |
|------|-------|-----|
| Complex architecture | Opus + Thinking | One-shot accuracy |
| Standard coding | Sonnet | Good balance |
| Simple tasks | Haiku | Fast, cheap |
| Exploration | Subagents | Keep main context clean |

### 7. Planning Before Doing

For tasks with 3+ steps:
```
1. Enter plan mode
2. Research codebase
3. Write step-by-step plan
4. Get approval
5. Then implement
```

Never implement multi-step tasks without a plan.

### 8. Learning Log

Continuously improve:
- After every correction → update `lessons.md`
- Review lessons at session start
- Prune outdated lessons monthly
- Share patterns across projects

## Quick Reference

### Session Start
```
1. Read CLAUDE.md
2. Read progress.txt
3. Read lessons.md
4. Pick up where left off
```

### During Work
```
- One task at a time
- Run tests frequently
- Commit small and often
- Ask if uncertain
```

### Session End
```
1. /wrap-up
2. Quality checks
3. Update progress
4. Capture learnings
5. Commit everything
```

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Instead |
|--------------|---------|---------|
| Mega-commits | Hard to review/revert | Small, focused commits |
| Skipping tests | Bugs accumulate | Test as you go |
| Ignoring lint | Technical debt | Fix immediately |
| No plan for big tasks | Wasted effort | Plan first |
| Not capturing learnings | Same mistakes | Use `/learn` |
| No wrap-up | Lost context | Always `/wrap-up` |

## Metrics to Track

- Corrections per session (aim: decreasing)
- Tests added vs code added
- Commits per session
- Time to first working version
- Lessons learned this week

## Philosophy

1. **Compound improvements** - Small corrections → big gains over time
2. **Trust but verify** - Let AI work, review at checkpoints
3. **Zero dead time** - Parallel sessions keep momentum
4. **Memory is precious** - Both yours and Claude's
5. **Learnings are gold** - Capture them religiously
