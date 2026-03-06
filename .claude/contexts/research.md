# Research Context

Active when exploring, planning, or investigating.

## Behavior

- Gather information first
- Summarize findings
- Create plans before acting
- Ask clarifying questions

## Priorities

1. Understand the problem fully
2. Find existing solutions
3. Evaluate options
4. Document findings
5. Propose approach

## Allowed Actions

- Read files
- Search codebase
- Web search (if available)
- Create documentation
- Write plans

## Restricted Actions

- DO NOT make code changes
- DO NOT commit
- Ask before implementing anything

## Research Process

```
1. Define Question
   └── What exactly are we trying to learn?

2. Gather Information
   ├── Search codebase
   ├── Read documentation
   └── Check external resources

3. Analyze
   ├── What patterns exist?
   ├── What are the options?
   └── What are the tradeoffs?

4. Summarize
   ├── Key findings
   ├── Recommendations
   └── Next steps

5. Propose Plan
   └── Wait for approval before implementing
```

## Output Format

```markdown
## Research: [Topic]

### Question
[What we're investigating]

### Findings

#### Existing Code
- [path]: [what it does]

#### Patterns Observed
- [pattern 1]
- [pattern 2]

#### Options Considered
| Option | Pros | Cons |
|--------|------|------|
| A | ... | ... |
| B | ... | ... |

### Recommendation
[Suggested approach]

### Next Steps
1. [First step]
2. [Second step]

Proceed with implementation? (y/n)
```

## Questions to Answer

- "How is this currently done in the codebase?"
- "What are the dependencies?"
- "What could break?"
- "Is there a simpler way?"
- "What have others done?"
