# @miniwe/ns-platform-core

**Reusable NestJS platform core for backend services**
A collection of shared NestJS building blocks (guards, services, modules, decorators, transformers, etc.) that can be published as an npm package and consumed across multiple micro‑services.

---

## Table of Contents
- [@miniwe/ns-platform-core](#miniwens-platform-core)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)  
  - [Documentation](docs/)
  - [Usage](#usage)
  - [Development Scripts](#development-scripts)
  - [CI / CD](#ci--cd)
    - [Continuous Integration (`.github/workflows/ci.yml`)](#continuous-integration-githubworkflowsciyml)
    - [Automatic Publishing (`.github/workflows/publish.yml`)](#automatic-publishing-githubworkflowspublishyml)
    - [Husky Pre‑commit Hook (`.husky/pre-commit`)](#husky-precommit-hook-huskypre-commit)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features
- **Advanced caching** (`AdvancedCacheModule`, `AdvancedCacheService`) – see `src/services/advanced-cache/`
- **Rate‑limiting / throttling** (`AdvancedThrottleModule`, `AdvancedThrottleGuard`) – see `src/services/advanced-throttle/`
- **Centralised error handling** (`ErrorHandlingService`, `AllExceptionsFilter`) – see `src/services/error-handling/`
- **Authentication helpers** (decorators, guards, DTOs) – see `src/auth/`
- **Utility services** (config, context, queues, transformers, etc.) – see respective folders under `src/`
- **Typed documentation** generated with Typedoc (output in `docs/`)
- **Automatic version bump** on each commit via Husky pre‑commit hook (`.husky/pre-commit`)
- **CI workflow** runs lint, unit tests and builds on every push/PR to `main`/`.master` (`.github/workflows/ci.yml`)
- **Publish workflow** automatically publishes a new patch version to GitHub Packages after a successful CI run (`.github/workflows/publish.yml`)

---

## Installation
```bash
# Using npm (registry is set to GitHub Packages in publishConfig)
npm install @miniwe/ns-platform-core
```

> The package is published to `https://npm.pkg.github.com`; ensure your `.npmrc` or login token grants read access.

---

## Usage
Import the re‑exported API from the package’s entry point (`src/index.ts` → `dist/index.js`):

```typescript
// Example: using the AdvancedCacheModule
import { AdvancedCacheModule } from '@miniwe/ns-platform-core';

@Module({
  imports: [
    AdvancedCacheModule.registerAsync({
      useFactory: (cfg: ConfigService) => ({
        store: redisStore,
        host: cfg.get('REDIS_HOST'),
        ttl: 60,
      }),
      inject: [ConfigService],
    }),
    // Throttle module can be registered independently
    AdvancedThrottleModule.register({}),
  ],
})
export class AppModule {}
```

See the detailed examples in:
- `src/services/advanced-throttle/README.md` – shows correct registration in `app.module.ts`
- `docs/` folder – generated API reference (classes, variables, etc.)

---

## Development Scripts
Defined in `package.json`:

| Script | Description |
|--------|-------------|
| `npm run clean` | Removes `dist`, `coverage`, `allure-results`, `allure-report` |
| `npm run build` | Compiles TypeScript (`tsc -p tsconfig.build.json`) |
| `npm run build:watch` | Watch mode for the build |
| `npm run lint` | Runs ESLint over the source |
| `npm run lint:fix` | Auto‑fixes lint errors |
| `npm test` | Runs unit tests (`npm run test:unit`) |
| `npm run test:unit` | Executes Jest unit test configuration (`qa/jest.unit.config.cjs`) |
| `npm version patch --no-git-tag-version` | Bumps patch version (used by CI & Husky) |
| `npm run clean && npm run lint && npm run test && npm run build` | Full verification pipeline (mirrors CI) |

---

## CI / CD
### Continuous Integration (`.github/workflows/ci.yml`)
- Triggers on `push` and `pull_request` to `main`/`master`
- Checks out the repo, sets up Node.js, caches `npm`
- Installs dependencies (`npm ci`)
- Runs lint (`npm run lint`)
- Runs tests (`npm run test`)

### Automatic Publishing (`.github/workflows/publish.yml`)
- Triggered when the CI workflow completes successfully on `main`/`master`
- If the CI run succeeded (`if: ${{ github.event.workflow_run.conclusion == 'success' }}`):
  1. Checks out the repo
  2. Sets up Node.js with GitHub Packages registry (`registry-url: 'https://npm.pkg.github.com'`, scope `@miniwe`)
  3. Installs dependencies
  4. Runs a clean‑lint‑test‑version‑build sequence:
     ```bash
     npm run clean
     npm run lint
     npm run test:dependencies
     npm run test
     npm version patch --no-git-tag-version
     npm run build
     ```
  5. Publishes the package using `npm publish` with `NODE_AUTH_TOKEN` from `secrets.GITHUB_TOKEN`

> The workflow ensures that only a **successful** CI run can publish a new version.

### Husky Pre‑commit Hook (`.husky/pre-commit`)
- Skips execution inside GitHub Actions or during an npm publish
- Otherwise runs `npm version patch --no-git-tag-version` and stages `package.json` and `package-lock.json`
- Guarantees that every local commit bumps the version (unless overridden)

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make changes, ensuring lint passes (`npm run lint:fix`) and tests succeed (`npm test`).
4. Commit – the Husky hook will automatically bump the patch version.
5. Push and open a Pull Request against `main`/`master`.
6. After CI passes, the publish workflow will release the new version.

Please adhere to the existing code style and add unit tests for new functionality.

---

## License
ISC – see the `LICENSE` file (or the `license` field in `package.json`).

---

*Generated with ❤️ using the Miniwe NestJS platform core.*
