# Learn Command

Capture a learning from a correction or discovery.

## Usage
```
/learn <description>
```

## When to Use

- After user corrects a mistake
- After discovering a better approach
- After finding an anti-pattern
- After solving a tricky problem

## Workflow

1. Identify the pattern (what went wrong or was discovered)
2. Extract the rule (what to do instead)
3. Add to `lessons.md`
4. Confirm with user

## Learning Format

```markdown
### [Short Title]
- Trigger: [What situation causes this?]
- Pattern: [What went wrong / was discovered?]
- Rule: [What to do instead / remember?]
```

## Examples

**User says:** "Don't use any here, be more specific with types"
```
/learn Always use specific TypeScript types instead of any
```

**Adds to lessons.md:**
```markdown
### Avoid TypeScript any
- Trigger: Declaring variables or function parameters
- Pattern: Used `any` type for convenience
- Rule: Always use specific types, create interfaces if needed
```

---

**User says:** "You need to check if the array is empty first"
```
/learn Check array length before accessing elements
```

**Adds to lessons.md:**
```markdown
### Check Array Before Access
- Trigger: Accessing array elements
- Pattern: Assumed array had elements, caused runtime error
- Rule: Always check `array.length > 0` or use optional chaining `array[0]?.property`
```

## Output

```markdown
## Learning Captured

**Title:** [Short title]
**Category:** [Navigation|Editing|Testing|Git|Quality|Context|Architecture|Performance]

Added to lessons.md:
> ### [Title]
> - Trigger: ...
> - Pattern: ...
> - Rule: ...

Review lessons at next session start.
```

## Categories

| Category | Examples |
|----------|----------|
| Navigation | File paths, finding code |
| Editing | Code changes, patterns |
| Testing | Test approaches |
| Git | Commits, branches |
| Quality | Lint, types, style |
| Context | When to clarify |
| Architecture | Design decisions |
| Performance | Optimization |
