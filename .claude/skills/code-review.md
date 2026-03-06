# CODE_REVIEW.md - Code Review Checklist

> Based on [code-review-expert](https://github.com/sanyuan0704/code-review-expert)
> Run before marking any task complete or before merging.

---

## Severity Levels

| Level | Name | Action |
|-------|------|--------|
| P0 | Critical | Must block merge |
| P1 | High | Should fix before merge |
| P2 | Medium | Fix or create follow-up |
| P3 | Low | Optional improvement |

---

## Review Workflow

1. **Preflight** - Scope changes via `git diff`
2. **SOLID + Architecture** - Check design principles
3. **Removal Candidates** - Find dead/unused code
4. **Security Scan** - Vulnerability detection
5. **Code Quality** - Error handling, performance, boundaries
6. **Output** - Findings by severity (P0-P3)
7. **Confirmation** - Ask user before implementing fixes

---

## 1. SOLID Principles Checklist

### Single Responsibility Principle (SRP)
- [ ] Does this class/function do only one thing?
- [ ] Can you describe its purpose in one sentence without "and"?
- [ ] Would a change in one area require changes here?

**Smells:**
- Class with many unrelated methods
- Function longer than 30 lines
- Multiple reasons to change

### Open/Closed Principle (OCP)
- [ ] Can behavior be extended without modifying existing code?
- [ ] Are you using inheritance/composition for variations?
- [ ] Would adding a new type require changing switch statements?

**Smells:**
- Switch statements on type
- If-else chains for different behaviors
- Modifying existing code for new features

### Liskov Substitution Principle (LSP)
- [ ] Can subclasses replace parent classes without breaking behavior?
- [ ] Do subclasses honor the parent's contract?
- [ ] Are there overridden methods that throw "not implemented"?

**Smells:**
- Subclass that throws on inherited method
- Type checking before calling method
- Behavioral surprises in subclasses

### Interface Segregation Principle (ISP)
- [ ] Are interfaces focused and minimal?
- [ ] Do implementers use all interface methods?
- [ ] Would splitting the interface make sense?

**Smells:**
- Empty method implementations
- "Fat" interfaces with many methods
- Classes implementing unused methods

### Dependency Inversion Principle (DIP)
- [ ] Do high-level modules depend on abstractions?
- [ ] Are dependencies injected, not created internally?
- [ ] Can you swap implementations easily?

**Smells:**
- `new` keyword for dependencies inside classes
- Direct imports of concrete implementations
- Hard to test in isolation

---

## 2. Security Checklist

### Input Validation
- [ ] All user input validated and sanitized
- [ ] SQL queries use parameterized statements
- [ ] No string concatenation in queries
- [ ] File uploads validated (type, size, name)

### XSS Prevention
- [ ] Output properly encoded/escaped
- [ ] Content-Security-Policy headers set
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] User content rendered safely

### Authentication & Authorization
- [ ] Auth checks on all protected routes
- [ ] Session tokens properly managed
- [ ] Password hashing uses strong algorithm (bcrypt, argon2)
- [ ] No hardcoded credentials
- [ ] Rate limiting on auth endpoints

### Secrets Management
- [ ] No secrets in code or logs
- [ ] Environment variables for sensitive data
- [ ] `.env` files in `.gitignore`
- [ ] No API keys in client-side code

### SSRF Prevention
- [ ] URL inputs validated against allowlist
- [ ] No user-controlled redirects without validation
- [ ] Internal network addresses blocked

### Race Conditions
- [ ] Concurrent access handled properly
- [ ] Database transactions used where needed
- [ ] Optimistic/pessimistic locking considered
- [ ] Check-then-act patterns avoided

---

## 3. Performance Checklist

### Database
- [ ] No N+1 query problems
- [ ] Indexes on frequently queried columns
- [ ] Queries optimized (explain plan checked)
- [ ] Pagination for large datasets
- [ ] Connection pooling configured

### Caching
- [ ] Frequently accessed data cached
- [ ] Cache invalidation strategy defined
- [ ] Cache TTL appropriate
- [ ] No cache stampede risk

### Memory
- [ ] No memory leaks (event listeners cleaned up)
- [ ] Large objects disposed properly
- [ ] Streams used for large files
- [ ] No unbounded collections

### CPU
- [ ] No blocking operations in main thread
- [ ] Heavy computation offloaded (workers, queues)
- [ ] Algorithms appropriate complexity
- [ ] No unnecessary loops or iterations

---

## 4. Error Handling Checklist

### Exception Handling
- [ ] No swallowed exceptions (empty catch blocks)
- [ ] Errors logged with context
- [ ] User-friendly error messages
- [ ] Sensitive info not exposed in errors

### Async Errors
- [ ] All promises have `.catch()` or try/catch
- [ ] Async/await wrapped in try/catch
- [ ] Unhandled rejection handlers in place
- [ ] Error boundaries in React components

### Error Boundaries
- [ ] Graceful degradation on failure
- [ ] Fallback UI for component errors
- [ ] Circuit breakers for external services
- [ ] Retry logic with backoff

---

## 5. Boundary Conditions Checklist

### Null/Undefined Handling
- [ ] Null checks before accessing properties
- [ ] Optional chaining used (`?.`)
- [ ] Default values for missing data
- [ ] TypeScript strict null checks enabled

### Empty Collections
- [ ] Empty array/object cases handled
- [ ] UI shows empty states
- [ ] No `.map()` on potentially undefined
- [ ] Aggregations handle empty input

### Numeric Limits
- [ ] Integer overflow considered
- [ ] Division by zero prevented
- [ ] Floating point comparison handled
- [ ] Negative numbers handled

### Off-by-One
- [ ] Loop boundaries correct
- [ ] Array index bounds checked
- [ ] Pagination edge cases tested
- [ ] String slicing correct

### String Edge Cases
- [ ] Empty string handled
- [ ] Unicode/special characters handled
- [ ] Max length enforced
- [ ] Whitespace trimmed appropriately

---

## 6. Code Quality Checklist

### Readability
- [ ] Clear, descriptive names
- [ ] Comments explain "why", not "what"
- [ ] Consistent formatting
- [ ] No magic numbers (use constants)

### Maintainability
- [ ] DRY - no duplicated logic
- [ ] Functions are small and focused
- [ ] Dependencies minimal and explicit
- [ ] Easy to understand without author

### Testing
- [ ] Unit tests for new code
- [ ] Edge cases covered
- [ ] Mocks used appropriately
- [ ] Tests are readable and maintainable

### Documentation
- [ ] Public APIs documented
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] Breaking changes noted

---

## 7. Removal Candidates

### Safe to Remove
- [ ] Unused imports
- [ ] Dead code (unreachable)
- [ ] Commented-out code
- [ ] Unused variables/functions
- [ ] Deprecated features past sunset

### Needs Careful Review
- [ ] Code with no test coverage
- [ ] Features with unclear usage
- [ ] Old API versions
- [ ] Feature flags ready to remove

### Removal Plan Template
```
## Removal: [Component/Feature Name]

**What:** [What is being removed]
**Why:** [Reason for removal]
**Impact:** [What might break]
**Rollback:** [How to revert if needed]
**Verification:** [How to confirm safe removal]
```

---

## Review Output Template

```markdown
## Code Review Summary

**Files Reviewed:** [count]
**Overall Assessment:** PASS | NEEDS CHANGES | BLOCK

### P0 - Critical (Must Fix)
1. [File:line] - Description
   - Impact: [what could go wrong]
   - Fix: [specific suggestion]

### P1 - High (Should Fix)
1. [File:line] - Description
   - Suggestion: [how to fix]

### P2 - Medium (Fix or Follow-up)
1. [File:line] - Description

### P3 - Low (Optional)
1. [File:line] - Description

### Good Patterns Observed
1. [File:line] - Description of well-implemented code
```

---

## Quick Commands

```bash
# Scope changes
git diff --stat
git diff --name-only

# Security scan (if bandit installed)
bandit -r src/ -ll

# Find unused code (if vulture installed)
vulture src/

# Type check
npm run typecheck

# Lint
npm run lint
```
