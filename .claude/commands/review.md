# Review Command

Perform a code review on the current changes.

## Usage
```
/review [scope]
```

## Scopes
- `staged` - Review staged changes (default)
- `branch` - Review all changes in current branch vs main
- `file <path>` - Review specific file
- `last` - Review last commit

## Workflow

1. Get diff based on scope
2. Read `.claude/skills/code-review.md` checklist
3. Analyze against:
   - SOLID principles
   - Security vulnerabilities
   - Performance issues
   - Error handling
   - Boundary conditions
4. Output findings by severity (P0-P3)
5. Ask before implementing fixes

## Example Output

```markdown
## Code Review Summary

**Files Reviewed:** 3
**Overall Assessment:** NEEDS CHANGES

### P0 - Critical
- src/auth.ts:45 - SQL injection vulnerability
  - Fix: Use parameterized query

### P1 - High  
- src/api.ts:23 - Missing error handling on async call

### P2 - Medium
- src/utils.ts:12 - Potential null reference

### Good Patterns
- src/service.ts:78 - Clean separation of concerns
```
