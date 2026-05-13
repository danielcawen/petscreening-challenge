# petscreening-challenge
PetScreening’s Challenge

## Requirements

- Node.js 24+ (required by pnpm v11)

## Installation

```bash
nvm use 24 # if using nvm
cp config/.env.example config/.env.local
pnpm install
pnpm exec playwright install chromium firefox webkit
```

## Running Tests

> The app under test must be running at `http://localhost:3000` before executing tests.

```bash
pnpm test          # all layers
pnpm test:ui       # UI only
pnpm test:api      # API only (no browser)
```

### Browser

Default is Chromium. Use the `BROWSER` env var or a dedicated script to switch:

```bash
pnpm test:ui:firefox
pnpm test:ui:safari
# or
BROWSER=firefox pnpm test:ui
BROWSER=webkit pnpm test:ui
```

### Headed mode

```bash
pnpm test:ui:headed
pnpm test:ui:firefox:headed
pnpm test:ui:safari:headed
# or
HEADED=true pnpm test:ui
```

### Viewport

Default is desktop (1280×720). Use `VIEWPORT=mobile` for 375×667:

```bash
pnpm test:ui:mobile
pnpm test:ui:mobile:headed
# or
VIEWPORT=mobile pnpm test:ui
```

Env vars compose freely:

```bash
BROWSER=webkit VIEWPORT=mobile HEADED=true pnpm test:ui
```

### Re-running failed scenarios

After any test run, failed scenario locations are written to `@rerun.txt`. To re-run only those:

```bash
pnpm test:rerun
```

Pass `--profile` to keep the correct step definitions in scope when re-running a specific layer:

```bash
pnpm cucumber-js @rerun.txt --profile ui
pnpm cucumber-js @rerun.txt --profile api
```

### Targeting specific tests

Run a single feature file:

```bash
pnpm cucumber-js e2e/features/ui/auth/login.feature
```

Run scenarios matching a name:

```bash
pnpm cucumber-js --name "Successful login"
```

### Reports

They are located at `/reports`
If a test fails a video and screenshot are attached to the report

### What to do next?

- Expand the API tests: validate contacts, verify other endpoints, etc
- Add a DB integration
- Expand UI tests: add missing sections: rewards program, tracking orders, etc

### Notes:
- TODO: verify if this is needed `git update-index --skip-worktree @rerun.tx`