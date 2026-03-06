# Plan Command

Enter planning mode for a task.

## Usage
```
/plan <task description>
```

## Workflow

1. **Understand** - Parse task requirements
2. **Research** - Search codebase for related code
3. **Analyze** - Identify dependencies and impacts
4. **Design** - Create step-by-step implementation plan
5. **Verify** - Check plan with user before proceeding

## Output Format

```markdown
## Plan: [Task Name]

### Understanding
[What the task requires]

### Research Findings
- Found: [existing code that relates]
- Dependencies: [what this affects]

### Implementation Steps
1. [ ] Step 1
   - Files: [files to modify]
   - Changes: [what changes]
2. [ ] Step 2
   ...

### Risks
- [potential issues]

### Questions
- [clarifications needed]

Ready to proceed? (y/n)
```

## Rules

- Always search before assuming something doesn't exist
- Break into smallest possible steps
- Identify all files that will be touched
- Flag any architectural decisions
- Ask clarifying questions upfront
