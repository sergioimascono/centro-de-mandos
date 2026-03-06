# lessons.md

## How to Use

Review at session start. Update after ANY correction from user.

Format:
```
### Title
- Trigger: What situation causes this?
- Pattern: What went wrong?
- Rule: What to do instead?
```

---

## Lessons

### Search Before Implementing
- Trigger: Asked to implement a feature
- Pattern: Assumed it did not exist, created duplicate
- Rule: ALWAYS search codebase first

### Complete Backpressure Before Commit
- Trigger: Finished implementing, ready to commit
- Pattern: Committed without running all checks
- Rule: Run full backpressure chain before commit

### One Task at a Time
- Trigger: Multiple related tasks in plan
- Pattern: Tried to do several at once
- Rule: Pick ONE task, complete it fully, commit

### Read Full Error Message
- Trigger: Test or build fails
- Pattern: Read only first line
- Rule: Read ENTIRE stack trace

### Update Progress After Discovery
- Trigger: Found unexpected issue
- Pattern: Fixed but did not document
- Rule: Update progress.txt immediately

### No Placeholders
- Trigger: Running out of context
- Pattern: Left TODO placeholder
- Rule: Implement completely or document for next session

---

## Checklists

**Pre-Work:**
- [ ] Reviewed lessons.md?
- [ ] Searched if similar exists?
- [ ] Clear on what to do?

**Pre-Commit:**
- [ ] All backpressure levels pass?
- [ ] Updated progress.txt?
