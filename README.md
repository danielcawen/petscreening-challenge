# petscreening-challenge
PetScreening’s Challenge

## Installation

```bash
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

Default is desktop (1280×720). Use `VIEWPORT=mobile` for 390×844:

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

### Targeting specific tests

Run a single feature file:

```bash
pnpm cucumber-js e2e/features/ui/auth/login.feature
```

Run scenarios matching a name:

```bash
pnpm cucumber-js --name "Successful login"
```
