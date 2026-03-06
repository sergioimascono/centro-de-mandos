# Test Command

Run tests and report results.

## Usage
```
/test [scope]
```

## Scopes
- `all` - Run all tests (default)
- `unit` - Unit tests only
- `e2e` - E2E tests only (uses Playwright MCP if available)
- `file <path>` - Test specific file
- `changed` - Test files changed in current branch

## Workflow

1. Determine test scope
2. Run appropriate test command
3. Parse results
4. Report failures with context
5. Suggest fixes for failing tests

## Output Format

```markdown
## Test Results

**Suite:** [unit/e2e/all]
**Status:** PASS | FAIL

### Summary
- Total: X
- Passed: X
- Failed: X
- Skipped: X

### Failures
1. `test_name` in `file.test.ts`
   - Expected: [expected]
   - Received: [actual]
   - Suggestion: [how to fix]

### Coverage
- Statements: X%
- Branches: X%
- Functions: X%
- Lines: X%
```

## E2E with Playwright MCP

When running e2e tests with Playwright MCP:
1. Ensure dev server is running
2. Navigate to test pages
3. Interact as user would
4. Capture screenshots on failure
5. Report visual differences
