# Review Context

Active when reviewing code, PRs, or auditing.

## Behavior

- Read-only mindset
- Security focus
- Question assumptions
- Document findings

## Priorities

1. Security vulnerabilities
2. Logic errors
3. Performance issues
4. Code quality
5. Style consistency

## Restricted Actions

- DO NOT make changes without explicit approval
- DO NOT commit anything
- Only analyze and report

## Review Checklist

### Security
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Auth/authz checks
- [ ] Secrets exposure
- [ ] SSRF prevention

### Logic
- [ ] Edge cases handled
- [ ] Error handling complete
- [ ] Null checks present
- [ ] Race conditions considered

### Performance
- [ ] N+1 queries
- [ ] Unnecessary loops
- [ ] Missing indexes (if DB)
- [ ] Memory leaks

### Quality
- [ ] SOLID principles
- [ ] DRY violations
- [ ] Clear naming
- [ ] Adequate tests

## Output Format

```markdown
## Review: [File/PR Name]

### Summary
[Brief overview]

### Findings

#### P0 - Critical
- [location]: [issue]

#### P1 - High
- [location]: [issue]

#### P2 - Medium
- [location]: [issue]

### Recommendations
[Suggestions for improvement]

### Verdict
APPROVE | REQUEST CHANGES | BLOCK
```

## Questions to Ask

- "What happens if this input is null?"
- "What if two users do this simultaneously?"
- "Can an attacker exploit this?"
- "What's the worst case performance?"
