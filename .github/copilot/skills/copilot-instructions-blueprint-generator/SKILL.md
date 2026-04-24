---
name: copilot-instructions-blueprint-generator
description: 'Comprehensive blueprint generator for creating copilot-instructions.md files that guide GitHub Copilot to produce code consistent with project standards, architecture patterns, and exact technology versions. Analyzes existing codebase patterns, references architecture blueprints and code exemplars, provides technology-specific instructions for .NET, Java, React, Angular, Vue.js, Svelte, Next.js, Nuxt.js, Node.js, Python, Go, Rust, Ruby on Rails, Flutter, Swift, and Kotlin. Supports monorepo detection with per-sub-project Copilot guidance, state management patterns, background task conventions, external integration patterns, and response formatting layers.'
---

# Copilot Instructions Blueprint Generator

## Configuration Variables
${PROJECT_TYPE="Auto-detect|.NET|Java|React|Angular|Vue.js|Svelte|Next.js|Nuxt.js|Node.js|Python|Go|Rust|Ruby on Rails|Flutter|Swift|Kotlin|Other"} <!-- Primary technology -->
${ARCHITECTURE_STYLE="Auto-detect|Layered|Microservices|Monolithic|Domain-Driven|Event-Driven|Serverless|Clean Architecture|Hexagonal|MVC|MVVM|CQRS|Mixed"} <!-- Architectural approach -->
${CODE_QUALITY_FOCUS="Maintainability|Performance|Security|Accessibility|Testability|All"} <!-- Quality priorities -->
${DOCUMENTATION_LEVEL="Minimal|Standard|Comprehensive"} <!-- Documentation requirements -->
${TESTING_REQUIREMENTS="Unit|Integration|E2E|TDD|BDD|All"} <!-- Testing approach -->
${VERSIONING="Semantic|CalVer|Custom"} <!-- Versioning approach -->
${MONOREPO_MODE="Auto-detect|single|per-project|holistic"} <!-- Monorepo detection mode -->

## Generated Prompt

"Generate a comprehensive copilot-instructions.md file that will guide GitHub Copilot to produce code consistent with our project's standards, architecture, and technology versions. The instructions must be strictly based on actual code patterns in our codebase and avoid making any assumptions. Follow this approach:

### 0. Repository Structure Detection

${MONOREPO_MODE == "Auto-detect" ? "Before generating instructions, determine the repository structure by examining:
- Whether the root directory contains multiple sub-directories that are independent projects (each with their own package.json, go.mod, .csproj, Cargo.toml, requirements.txt, Gemfile, pubspec.yaml, or similar project manifest files)
- Whether a workspace configuration exists at the root (package.json with workspaces field, pnpm-workspace.yaml, turbo.json, nx.json, lerna.json, Cargo.toml with workspace members)
- Whether the root has no source code of its own but only contains sub-project directories

If multiple sub-projects are detected, treat this as a **monorepo** and generate instructions that include:

**A. Monorepo-Aware Context:**
Instruct Copilot to always be aware of which sub-project it is currently editing:
- When editing files in a backend sub-project, follow backend patterns and conventions
- When editing files in a frontend sub-project, follow frontend patterns and conventions
- Never mix patterns between sub-projects (e.g., do not use frontend state management patterns in backend code)

**B. Per-Sub-Project Instructions:**
Generate a clearly labeled section for each sub-project detected:
- Use headings like '### When editing files in api/' and '### When editing files in web/'
- Each section contains the technology-specific guidelines, layer conventions, naming patterns, and architectural rules for that sub-project only
- Apply ALL subsequent technology-specific sections to the relevant sub-project

**C. Cross-Project Awareness:**
Instruct Copilot about relationships between sub-projects:
- When modifying an API endpoint in the backend, note that frontend service files may consume it — do not change the response shape without considering the contract
- When modifying a frontend service call, verify the endpoint and expected response shape match the backend implementation
- When authentication patterns exist across sub-projects (e.g., backend issues JWT, frontend sends it), maintain consistency in token handling
- When shared types, schemas, or contracts exist (shared/ or packages/ directories), respect them and do not create duplicate definitions
- Document the environment variable alignment (e.g., frontend VITE_API_URL must correspond to backend PORT and routes)

**D. Reference Existing Documentation:**
Instruct Copilot to check for and prioritize these project documents if they exist:
- .github/docs/Project_Architecture_Blueprint.md — for understanding the full system architecture, layer boundaries, and component relationships
- .github/docs/exemplars.md — for seeing the best code examples that define our standards
- These documents take priority over pattern inference from scanning code

If the repository is NOT a monorepo, skip monorepo-specific sections and generate standard single-project instructions." : MONOREPO_MODE == "holistic" ? "Treat this repository as a monorepo. Generate per-sub-project instruction sections and cross-project awareness rules. Reference Project_Architecture_Blueprint.md and exemplars.md if they exist." : MONOREPO_MODE == "per-project" ? "Generate instructions for the current directory only. Note if evidence suggests this is part of a monorepo and instruct Copilot to be aware of sibling projects." : "Generate instructions for a single standalone project."}

### 1. Core Instruction Structure

Generate the following structure in the copilot-instructions.md file:

# GitHub Copilot Instructions

## Priority Guidelines

When generating code for this repository:

1. **Reference Documents First**: Check for Project_Architecture_Blueprint.md and exemplars.md — these define our architecture and coding standards authoritatively
2. **Version Compatibility**: Always detect and respect the exact versions of languages, frameworks, and libraries used in this project — never use features from newer versions
3. **Context Files**: Prioritize patterns and standards defined in the .github/copilot directory
4. **Codebase Patterns**: When context files and reference documents don't provide specific guidance, scan the codebase for established patterns
5. **Architectural Consistency**: Maintain our ${ARCHITECTURE_STYLE == "Auto-detect" ? "detected" : ARCHITECTURE_STYLE} architectural style and established layer boundaries without exception
6. **Code Quality**: Prioritize ${CODE_QUALITY_FOCUS == "All" ? "maintainability, performance, security, accessibility, and testability" : CODE_QUALITY_FOCUS} in all generated code
7. **Consistency Over Novelty**: When in doubt, prioritize consistency with existing code over external best practices or newer language features

## Technology Version Detection

Before generating code, scan the codebase to identify:

1. **Language Versions**: Detect the exact versions of programming languages in use
 - Examine project files, configuration files, and package managers
 - Look for language-specific version indicators (e.g., LangVersion in .csproj, engines in package.json, python_requires in setup.py, go directive in go.mod, edition in Cargo.toml, .ruby-version, .swift-version)
 - Never use language features beyond the detected version

2. **Framework Versions**: Identify the exact versions of all frameworks
 - Check package.json, .csproj, pom.xml, build.gradle, requirements.txt, Gemfile, pubspec.yaml, Cargo.toml, Package.swift
 - Respect version constraints (^, ~, >=, exact) when generating code
 - Never suggest features not available in the detected framework versions

3. **Library Versions**: Note the exact versions of key libraries and dependencies
 - Generate code compatible with these specific versions
 - Never use APIs or features not available in the detected versions
 - Pay special attention to libraries with breaking changes between versions (e.g., React Router v5 vs v6, TanStack Query v4 vs v5, Pinia vs Vuex, Prisma major versions)

## Context Files

Prioritize the following files (if they exist):

- **.github/docs/Project_Architecture_Blueprint.md**: Complete system architecture — layer boundaries, component relationships, data flow, technology decisions. This is the authoritative source for architectural decisions.
- **.github/docs/exemplars.md**: The best code examples in our codebase — when creating new files, find the relevant exemplar and follow its exact patterns.
- **.github/copilot/architecture.md**: Additional architecture guidelines
- **.github/copilot/tech-stack.md**: Technology versions and framework details
- **.github/copilot/coding-standards.md**: Code style and formatting standards
- **.github/copilot/folder-structure.md**: Project organization guidelines

## Codebase Scanning Instructions

When reference documents and context files don't provide specific guidance:

1. Identify the MOST SIMILAR existing file to the one being modified or created
2. Analyze that file and its siblings for:
 - Naming conventions (variables, functions, files, folders)
 - Code organization (import order, section grouping, export patterns)
 - Error handling (error types, try/catch patterns, error propagation)
 - Logging approaches (logger usage, log levels, what gets logged)
 - Documentation style (JSDoc, docstrings, inline comments)
 - Testing patterns (test file location, naming, structure, assertions)

3. Follow the most consistent patterns found in the codebase
4. When conflicting patterns exist, prioritize patterns in newer files or files referenced in exemplars.md
5. Never introduce patterns, libraries, or architectural approaches not found in the existing codebase

## Code Quality Standards

${CODE_QUALITY_FOCUS.includes("Maintainability") || CODE_QUALITY_FOCUS == "All" ? `### Maintainability
- Write self-documenting code with clear naming that matches the conventions in the codebase
- Keep functions focused on single responsibilities — match the granularity of existing functions
- Limit function complexity and length to match existing patterns in the same layer
- When extracting logic, follow the same extraction patterns used in the codebase (e.g., if the codebase extracts to hooks, extract to hooks — not to utility classes)` : ""}

${CODE_QUALITY_FOCUS.includes("Performance") || CODE_QUALITY_FOCUS == "All" ? `### Performance
- Follow existing patterns for async operations — if the codebase uses async/await, do not introduce callback patterns
- Apply caching consistently with existing patterns — if a caching layer exists, use it rather than implementing ad-hoc caching
- Match existing patterns for database query optimization (eager loading, pagination, field selection)
- Follow established patterns for memoization, debouncing, and throttling in frontend code` : ""}

${CODE_QUALITY_FOCUS.includes("Security") || CODE_QUALITY_FOCUS == "All" ? `### Security
- Follow the exact input validation approach used in the codebase (detect: Zod, Joi, Yup, class-validator, Pydantic, custom validators)
- Use parameterized queries — never construct SQL/query strings via concatenation
- Follow the established authentication middleware/guard patterns — do not create alternative auth flows
- Follow the established authorization/permission checking patterns
- Never log sensitive data (passwords, tokens, personal data) — match the logging sanitization patterns in existing code
- Handle sensitive data (passwords, tokens) using the same utilities found in the codebase (e.g., bcrypt wrapper, jwt utility)` : ""}

${CODE_QUALITY_FOCUS.includes("Accessibility") || CODE_QUALITY_FOCUS == "All" ? `### Accessibility
- Follow existing accessibility patterns in UI components (ARIA attributes, semantic HTML, roles)
- Match keyboard navigation support with existing interactive components
- Follow established patterns for focus management, color contrast, and text alternatives
- When creating new UI components, check if a similar accessible component already exists and extend it` : ""}

${CODE_QUALITY_FOCUS.includes("Testability") || CODE_QUALITY_FOCUS == "All" ? `### Testability
- Follow established dependency injection or module import patterns that enable testing
- Match mocking and test double patterns from existing tests (detect: Jest mocks, Vitest mocks, unittest.mock, mockgen, MockK, Mockito)
- When creating new code, ensure it can be tested following the same patterns as existing test files
- Match the test file organization (co-located vs tests/ folder vs __tests__/ folder)` : ""}

## Documentation Requirements

${DOCUMENTATION_LEVEL == "Minimal" ?
`- Match the level and style of comments found in existing code
- Document only non-obvious behavior and complex business rules
- Use the same format for parameter descriptions as existing code
- Do not over-document obvious code — follow the codebase's documentation density` : ""}

${DOCUMENTATION_LEVEL == "Standard" ?
`- Follow the exact documentation format found in the codebase (detect: JSDoc, docstrings, XML comments, rustdoc, godoc)
- Document parameters, return values, and exceptions/errors in the same style as existing documented functions
- Add file-level or class-level documentation matching the style of similar existing files
- Document business rules and non-obvious decisions inline` : ""}

${DOCUMENTATION_LEVEL == "Comprehensive" ?
`- Follow the most detailed documentation patterns found in the codebase
- Document every public function/method with parameters, return values, exceptions, and usage examples matching the best-documented files
- Add file-level documentation explaining purpose, responsibilities, and relationships
- Document architectural decisions and business rules inline
- Include cross-references to related files following existing patterns` : ""}

## Testing Approach

${TESTING_REQUIREMENTS.includes("Unit") || TESTING_REQUIREMENTS == "All" ?
`### Unit Testing
- Detect the testing framework in use (Jest, Vitest, pytest, JUnit, Go testing, RSpec, XCTest, Minitest, Rust test) and use ONLY that framework
- Match the exact file naming convention (*.spec.js, *.test.js, *_test.go, *_spec.rb, *Tests.swift, *Test.java, *Test.kt)
- Match the test file location pattern (co-located, tests/ folder, __tests__/ folder, test/ folder)
- Follow the same test structure: describe/it blocks, test functions, test classes — match what exists
- Use the same assertion patterns (expect, assert, should — match the codebase)
- Apply the same mocking approach (mock files, factory functions, DI overrides — do not introduce a different mocking library)
- Follow existing patterns for test setup and teardown (beforeEach, setUp, fixtures)` : ""}

${TESTING_REQUIREMENTS.includes("Integration") || TESTING_REQUIREMENTS == "All" ?
`### Integration Testing
- Follow the same integration test patterns found in the codebase (API tests, database tests, multi-layer tests)
- Match existing patterns for test database setup, seeding, and cleanup
- Use the same approach for making HTTP requests in tests (supertest, requests, httptest)
- Follow existing patterns for test data factories or fixtures` : ""}

${TESTING_REQUIREMENTS.includes("E2E") || TESTING_REQUIREMENTS == "All" ?
`### End-to-End Testing
- Detect the E2E framework (Cypress, Playwright, Selenium, Detox, XCUITest) and match its patterns
- Follow established patterns for page objects, selectors, and user journey flows
- Match existing patterns for test data setup and environment configuration` : ""}

${TESTING_REQUIREMENTS.includes("TDD") || TESTING_REQUIREMENTS == "All" ?
`### Test-Driven Development
- When TDD patterns are evident, write tests before implementation following the same red-green-refactor cycle
- Match the progression and granularity of test cases seen in existing code` : ""}

${TESTING_REQUIREMENTS.includes("BDD") || TESTING_REQUIREMENTS == "All" ?
`### Behavior-Driven Development
- Match the existing Given-When-Then structure (detect: Cucumber, SpecFlow, behave, RSpec describe/context)
- Follow the same patterns for feature files and step definitions` : ""}

## Technology-Specific Guidelines

${(PROJECT_TYPE == ".NET" || PROJECT_TYPE == "Auto-detect") ? `### .NET Guidelines (if detected)
- Detect and strictly adhere to the specific .NET version and C# language version in use
- Use only C# language features compatible with the detected version
- Follow the exact same LINQ style (method syntax vs query syntax) found in existing code
- Match async/await patterns — if the codebase uses ValueTask, use ValueTask; if Task, use Task
- Apply the exact same dependency injection registration patterns (AddScoped, AddTransient, AddSingleton) as existing code
- Match the middleware pipeline registration order and patterns
- Follow the same controller/minimal API patterns for request handling and response formatting
- Match Entity Framework / Dapper patterns for data access
- Follow the same DTO/AutoMapper/manual mapping patterns for response shaping
- Match the same configuration pattern (IOptions, IConfiguration) used in existing code` : ""}

${(PROJECT_TYPE == "Java" || PROJECT_TYPE == "Auto-detect") ? `### Java Guidelines (if detected)
- Detect and adhere to the specific Java version in use
- Follow the exact same Spring Boot / framework patterns found in the codebase
- Match the dependency injection approach (@Autowired, constructor injection — follow what the codebase uses)
- Follow the same exception handling hierarchy (@ControllerAdvice, custom exceptions)
- Match the ORM patterns (JPA repositories, custom queries, specifications, criteria API)
- Follow the same DTO mapping approach (MapStruct, ModelMapper, manual mapping)
- Match the same transaction boundary patterns (@Transactional placement and propagation)
- Follow the same AOP patterns if aspects are used (logging, auditing, security)
- Match the same validation approach (Jakarta validation annotations, custom validators)` : ""}

${(PROJECT_TYPE == "React" || PROJECT_TYPE == "Auto-detect") ? `### React Guidelines (if detected)
- Detect and adhere to the specific React version in use
- Match component structure: functional components with hooks (never class components unless the codebase uses them)
- Follow the exact same file organization for components (index.js exports, co-located styles, co-located tests)

- **State Management — detect and follow the exact approach used**:
- If Zustand is detected:
  - Create new stores/slices following the exact same pattern as existing slice files (check slices/ or store/ folder)
  - Match the same state shape, action naming, and selector patterns
  - Never put server data in Zustand if TanStack Query is also present — Zustand is for client-only state
- If Redux / Redux Toolkit is detected:
  - Create new slices using createSlice following the exact same pattern as existing slices
  - Match the same extraReducers pattern for async operations
  - If RTK Query is used, create new endpoints following the existing createApi pattern
  - Use the same selector patterns (createSelector, inline selectors — match what exists)
  - Dispatch actions using the same pattern (useDispatch direct, or custom hooks — match what exists)
- If TanStack Query (React Query) is detected:
  - Create new query hooks following the exact same pattern as existing hooks in queries/ or hooks/ folder
  - Match the same query key convention (string, array, factory — follow what exists)
  - Match the same mutation pattern (onSuccess with invalidateQueries or setQueryData — follow what exists)
  - Never manage server data loading/error states manually if TanStack Query is available
- If SWR is detected:
  - Follow the existing fetcher and key patterns
  - Match cache and revalidation configuration
- If Context API only:
  - Follow the existing provider/consumer patterns
  - Match memoization approach (useMemo on value, useCallback on functions)
- **Multi-solution rule**: If client state (Zustand/Redux) and server state (TanStack Query/SWR) coexist, ALWAYS use the server state library for API data and the client state library for UI-only state. Never duplicate.

- **Data Fetching**:
- Follow the exact service layer pattern (check services/ folder) — match how API calls are structured
- If axios interceptors exist, understand what they do (auth token injection, error handling) and never bypass them
- Match the same error handling approach in API calls

- **Routing**: Follow the same React Router patterns (loader, action, guard/protection — match the version in use)
- **Styling**: Follow the same styling approach (Tailwind classes, CSS modules, styled-components — match what exists)
- **Form Handling**: Follow the same form library patterns (React Hook Form, Formik, or manual — match what exists)` : ""}

${(PROJECT_TYPE == "Angular" || PROJECT_TYPE == "Auto-detect") ? `### Angular Guidelines (if detected)
- Detect and adhere to the specific Angular version in use
- Follow the same module organization (NgModules vs standalone components — match what the codebase uses)
- Match the same component patterns (smart/dumb separation, OnPush strategy if used)
- Follow the same service and DI patterns (providedIn root vs module-scoped — match existing)
- Match RxJS usage patterns exactly (pipe operators, subscription management, async pipe usage)
- Follow the same HTTP interceptor patterns for auth, logging, error handling
- Match the same state management approach (NgRx, NGXS, Akita, or service-based — follow what exists)
- Follow the same route guard patterns (canActivate, canDeactivate, resolve)
- Match the same form approach (Reactive Forms vs Template Forms — follow what the codebase uses)
- Follow the same lazy loading and code splitting patterns` : ""}

${(PROJECT_TYPE == "Vue.js" || PROJECT_TYPE == "Auto-detect") ? `### Vue.js Guidelines (if detected)
- Detect Vue version (Vue 2 Options API vs Vue 3 Composition API) and NEVER mix styles
- Match the same component file structure (SFC organization, script setup vs setup function)
- Follow the same component composition patterns (props, emits, slots — match what exists)

- **State Management — detect and follow**:
- If Pinia: create stores following the exact same defineStore pattern (options vs setup syntax — match existing stores)
- If Vuex: create modules following the existing namespaced module pattern
- If neither: follow the same provide/inject or reactive composable patterns

- **Composables**: Follow the exact same composable patterns in composables/ folder (naming, return shape, dependency injection)
- **Routing**: Match Vue Router patterns (guards, meta fields, lazy loading — follow existing)
- **Data Fetching**: Follow the same approach (TanStack Query for Vue, useFetch composable, or manual axios — match what exists)
- **Reactivity**: Match ref vs reactive usage (follow whichever the codebase consistently uses)` : ""}

${(PROJECT_TYPE == "Svelte" || PROJECT_TYPE == "Auto-detect") ? `### Svelte / SvelteKit Guidelines (if detected)
- Detect whether plain Svelte or SvelteKit is used
- Match component file structure and naming conventions
- Follow the same store patterns (writable, readable, derived — match existing stores)
- If SvelteKit: match load function patterns (+page.js vs +page.server.js — follow existing convention)
- Match form action patterns for mutations
- Follow the same API route (+server.js) patterns
- Match reactive declaration ($:) and store subscription ($store) patterns from existing code` : ""}

${(PROJECT_TYPE == "Next.js" || PROJECT_TYPE == "Auto-detect") ? `### Next.js Guidelines (if detected)
- Detect whether App Router or Pages Router is used — NEVER mix unless the codebase already does
- Match Server Component vs Client Component decisions — follow existing 'use client' boundary patterns
- Follow the same data fetching approach:
- App Router: match server action patterns, fetch with cache/revalidate config, or client-side TanStack Query/SWR
- Pages Router: match getServerSideProps/getStaticProps patterns
- Match layout nesting and route group patterns from existing code
- Follow the same middleware.ts patterns for auth and redirects
- Match loading.tsx, error.tsx, not-found.tsx boundary patterns
- Apply the same React state management rules from the React section above, respecting Server/Client Component boundaries` : ""}

${(PROJECT_TYPE == "Nuxt.js" || PROJECT_TYPE == "Auto-detect") ? `### Nuxt.js Guidelines (if detected)
- Detect Nuxt version (Nuxt 2 vs Nuxt 3) and follow version-appropriate patterns
- Match the same data fetching patterns (useFetch vs useAsyncData — follow what the codebase uses)
- Follow the same server route patterns in server/api/ and server/routes/
- Match composable patterns from composables/ folder
- Follow the same plugin patterns from plugins/ folder
- Match Pinia store or useState patterns for state management
- Follow the same auto-import conventions — do not manually import what Nuxt auto-imports` : ""}

${(PROJECT_TYPE == "Node.js" || PROJECT_TYPE == "Auto-detect") ? `### Node.js Backend Guidelines (if detected)
- Detect the HTTP framework (Express, Fastify, Koa, Hono, NestJS) and follow its specific patterns
- Detect the ORM (Prisma, Sequelize, TypeORM, Mongoose, Knex, Drizzle) and follow its specific patterns

- **Layer Conventions — detect and follow strictly**:
- **Routes**: Match the exact route definition pattern (router.get/post/put/delete, middleware application order, controller binding)
- **Controllers**: Match the exact pattern — how they receive req/res, call services, format responses, handle errors (try/catch with next(error) or framework-specific)
- **Services**: Match the exact pattern — how they receive dependencies, implement business logic, throw errors (detect custom error class like AppError), call repositories
- **Repositories**: Match the exact pattern — how they wrap ORM calls, what they return, how they handle queries
- **Models**: Match the exact pattern — whether models are separate from ORM schema or the ORM schema IS the model

- **Response Formatting — detect if a formatting layer exists**:
- Look for views/, presenters/, serializers/, formatters/ folders
- If found: ALWAYS use the formatting layer before returning responses — never return raw database objects from controllers
- Match the exact render(entity) / renderMany(entities) pattern or equivalent

- **Middleware Patterns**:
- Match auth middleware patterns (how token is extracted, validated, and attached to request)
- Match validation middleware patterns (how schemas are applied to req.body before reaching controller)
- Match error middleware patterns (centralized error handler — always forward errors to it via next(error))
- Match logging middleware patterns (what is logged, at what level, using which logger)

- **Schema Validation**: Detect the validation library (Zod, Joi, Yup, class-validator) and match the exact schema definition and middleware application pattern
- **Background Jobs**: If cron jobs or workers exist, match the exact pattern for job definition, scheduling, and error handling
- **External API Wrappers**: If service files wrap external APIs, match the exact pattern for credential management, error mapping, and response transformation` : ""}

${(PROJECT_TYPE == "Python" || PROJECT_TYPE == "Auto-detect") ? `### Python Guidelines (if detected)
- Detect and adhere to the specific Python version in use
- Detect the framework (Django, FastAPI, Flask, or other) and follow its specific patterns:
- If Django: match model, view/viewset, serializer, URL, admin, signal, and management command patterns exactly
- If FastAPI: match router, Depends injection, Pydantic model, async endpoint, exception handler patterns exactly
- If Flask: match blueprint, application factory, route handler, extension patterns exactly
- Follow the same import organization found in existing modules (stdlib, third-party, local — match grouping and ordering)
- Match type hinting style and completeness — if the codebase uses full type hints, use them; if not, match the level used
- Follow the same module and package organization patterns
- Match the same decorator usage patterns for cross-cutting concerns
- Follow the same configuration approach (django settings, pydantic Settings, environ, dotenv — match what exists)` : ""}

${(PROJECT_TYPE == "Go" || PROJECT_TYPE == "Auto-detect") ? `### Go Guidelines (if detected)
- Follow the exact project layout (cmd/, internal/, pkg/ — match what the codebase uses)
- Match the same package organization strategy (by feature, by layer, by domain)
- Follow the same interface patterns:
- Where interfaces are defined (consumer-side vs producer-side — match existing)
- Interface size and granularity (small interfaces — match existing)
- Match error handling exactly:
- Same wrapping pattern (fmt.Errorf with %w, custom error types, sentinel errors — match what exists)
- Same error checking pattern (errors.Is, errors.As, type assertions — match what exists)
- Same boundary logging pattern (log at boundary or propagate — match what exists)
- Follow the same HTTP handler patterns (request parsing, validation, service call, response writing)
- Match middleware patterns exactly (chi, gin, echo, net/http — follow the router in use)
- Follow the same struct patterns (constructors, options pattern, builder — match what exists)
- Match the same concurrency patterns (goroutine lifecycle, channel usage, context propagation)
- Follow the same table-driven test patterns with subtests
- Match the same configuration loading approach (viper, envconfig, flags — follow what exists)` : ""}

${(PROJECT_TYPE == "Rust" || PROJECT_TYPE == "Auto-detect") ? `### Rust Guidelines (if detected)
- Follow the exact crate and module organization (workspace members, pub visibility — match existing)
- Match the same error handling strategy:
- If thiserror: create error enums following the same derive and display patterns
- If anyhow: use context and bail following the same patterns
- Match From implementations for error conversion
- Follow the same trait patterns (trait definition location, default impls, async traits)
- Match ownership patterns — if the codebase avoids unnecessary cloning in certain contexts, do the same
- Follow the same web framework patterns (axum extractors, actix handlers, rocket routes — match what exists)
- Match the same async patterns (tokio spawn, channels, select — follow existing)
- Follow the same data access patterns (sqlx, diesel, sea-orm — match query and migration patterns)
- Match the same builder and configuration patterns from existing code` : ""}

${(PROJECT_TYPE == "Ruby on Rails" || PROJECT_TYPE == "Auto-detect") ? `### Ruby on Rails Guidelines (if detected)
- Follow Rails conventions as implemented in this specific codebase (the codebase may deviate from Rails defaults)
- Match the same model patterns (validations, scopes, callbacks, associations — follow existing models)
- Follow the same controller patterns (before_action chains, strong params, response rendering)
- If service objects exist: create new services following the exact same class structure and calling convention
- Match the same serializer/presenter approach for API responses (ActiveModelSerializers, Jbuilder, Blueprinter, Alba — follow what exists)
- Follow the same concern organization and extraction patterns
- Match the same job/worker patterns (Sidekiq, ActiveJob — follow existing job class structure)
- Follow the same migration conventions and naming patterns
- Match the same spec/test organization (factories, shared examples, contexts — follow existing test files)` : ""}

${(PROJECT_TYPE == "Flutter" || PROJECT_TYPE == "Auto-detect") ? `### Flutter / Dart Guidelines (if detected)
- Follow the exact project structure (feature-first vs layer-first — match what exists)
- **State Management — detect and follow strictly**:
- If Bloc: create new Blocs/Cubits following the exact same event, state, and bloc class patterns
- If Riverpod: create new providers following the exact same provider type and notation patterns
- If Provider: create new ChangeNotifiers following the exact same patterns
- If GetX: follow the same GetxController patterns
- Match the same repository and data source patterns for data access
- Follow the same model serialization approach (json_serializable, freezed, manual — match what exists)
- Match the same navigation approach (go_router, auto_route, Navigator — follow what exists)
- Follow the same DI setup patterns (get_it, injectable, riverpod — match what exists)
- Match the same widget composition and extraction patterns from existing code` : ""}

${(PROJECT_TYPE == "Swift" || PROJECT_TYPE == "Auto-detect") ? `### Swift / iOS Guidelines (if detected)
- Detect UI framework (SwiftUI vs UIKit) and NEVER mix unless the codebase already does
- **Architecture — detect and follow**:
- If MVVM: create ViewModels following the exact same ObservableObject, @Published, async loading patterns
- If TCA: create features following the exact same Reducer, State, Action, Effect, Dependency patterns
- If VIPER: create modules following the exact same View-Interactor-Presenter-Entity-Router patterns
- Match the same SwiftUI view composition patterns (view extraction, modifier patterns, property wrappers)
- Follow the same networking layer patterns (URLSession, Alamofire — match existing service/client classes)
- Match the same Codable model patterns (CodingKeys, custom decoding — follow existing models)
- Follow the same DI approach (constructor injection, Environment, @Dependency — match what exists)
- Match the same concurrency patterns (async/await, Combine, MainActor — follow what exists)
- Follow the same protocol/extension patterns for abstraction` : ""}

${(PROJECT_TYPE == "Kotlin" || PROJECT_TYPE == "Auto-detect") ? `### Kotlin / Android Guidelines (if detected)
- Detect UI framework (Jetpack Compose vs XML Views) and follow the same approach
- **Architecture — detect and follow**:
- If MVVM: create ViewModels following the exact same StateFlow/LiveData, UiState sealed class patterns
- If MVI: follow the exact same Intent/State/Effect cycle patterns
- Create Use Cases / Interactors only if the codebase already has them
- Match the same Compose patterns (state hoisting, side effects, navigation — follow existing screens)
- Follow the same data layer patterns:
- Room: match Entity, DAO, Database patterns from existing code
- Retrofit/Ktor: match API interface and suspend function patterns from existing code
- Repository: match the same local + remote data source abstraction pattern
- Follow the same DI approach:
- If Hilt: match @Module, @InstallIn, @Provides patterns exactly
- If Koin: match module definitions and inject patterns exactly
- Match the same coroutine patterns (scope usage, dispatcher conventions, Flow collection — follow existing ViewModels)
- Follow the same model mapping patterns between layers (data → domain → UI — match existing mappers)` : ""}

## Architectural Layer Rules

Scan the codebase and generate explicit rules for each architectural layer detected:

- **For each layer, document**:
- What this layer IS responsible for (based on existing code)
- What this layer is NOT responsible for (based on what other layers handle)
- Which layers it can depend on (based on actual import patterns)
- Which layers it must NEVER depend on (based on dependency direction)

- **Common violations to prevent**:
- Controllers/handlers must not contain business logic — delegate to services
- Services must not access HTTP request/response objects — receive plain data, return plain data
- Repositories must not contain business rules — only data access
- Frontend components must not make API calls directly — use the service/query layer
- State stores must not make API calls directly if a service layer exists

- **Response Flow**:
- Detect if a response formatting layer exists (views, serializers, DTOs, presenters)
- If yes: instruct Copilot to ALWAYS format responses through that layer — never return raw database objects

- **Error Flow**:
- Detect the error handling pattern (custom error classes, error middleware, error boundaries)
- Document the exact flow: where errors are created → how they propagate → where they are caught and formatted

## Background Task Conventions

Scan for background tasks (cron jobs, queue workers, scheduled tasks) and if found:
- Document the exact file location pattern for new jobs
- Document the exact class/function structure to follow
- Document how jobs access shared services and repositories
- Document error handling and retry conventions for jobs
- Instruct Copilot: when creating a new background task, follow the exact same pattern as existing jobs

## External Integration Conventions

Scan for external API wrappers/integrations and if found:
- Document the exact pattern for wrapping external APIs (dedicated service file, error mapping, credential access)
- Document how external errors are mapped to internal errors
- Document caching patterns for external API responses (if any)
- Instruct Copilot: when adding a new external integration, create a dedicated wrapper service following the exact same pattern

## Version Control Guidelines

${VERSIONING == "Semantic" ?
`- Follow Semantic Versioning patterns as applied in the codebase
- Match existing patterns for documenting breaking changes
- Follow the same approach for deprecation notices` : ""}

${VERSIONING == "CalVer" ?
`- Follow Calendar Versioning patterns as applied in the codebase
- Match existing patterns for documenting changes` : ""}

${VERSIONING == "Custom" ?
`- Match the exact versioning pattern observed in the codebase
- Follow the same changelog format and tagging conventions` : ""}

## General Rules — Never Break These

1. **Never introduce a new library** without it already being in the project's dependencies
2. **Never introduce a new pattern** that doesn't exist in the codebase — even if it is a best practice
3. **Never bypass the architectural layers** — always go through the proper chain (route → controller → service → repository)
4. **Never mix frontend and backend patterns** in a monorepo — each sub-project has its own rules
5. **Never return raw database objects** from API endpoints if a formatting/serialization layer exists
6. **Never manage server data manually** if a dedicated server-state library (TanStack Query, SWR, RTK Query) is in use
7. **Never use features from newer versions** of any language, framework, or library than what is installed
8. **Always check exemplars.md first** when creating a new file — find the most relevant exemplar and follow its exact pattern
9. **Always follow the existing error handling chain** — create errors, propagate errors, and handle errors exactly as existing code does
10. **Always validate input** using the same validation approach (Zod, Joi, Pydantic, etc.) and at the same layer as existing code

### 2. Codebase Analysis Instructions

To create the copilot-instructions.md file, first analyze the codebase to:

1. **Identify Exact Technology Versions**:
 - ${PROJECT_TYPE == "Auto-detect" ? "Detect all programming languages, frameworks, and libraries by scanning project manifest files, configuration files, and source code" : `Focus on ${PROJECT_TYPE} technologies`}
 - Extract precise version information from all project files
 - Document version constraints and compatibility requirements
 - Note specific library versions that have breaking changes between versions

2. **Understand Architecture**:
 - ${ARCHITECTURE_STYLE == "Auto-detect" ? "Detect the architectural pattern by analyzing folder structure, dependency flow, and component boundaries" : `Document how the ${ARCHITECTURE_STYLE} architecture is implemented`}
 - Map layer boundaries and dependency directions from actual import/require statements
 - Document which layers exist and what each is responsible for
 - Identify the error flow, response formatting flow, and data flow

3. **Document Concrete Code Patterns** (not generic — extract the ACTUAL patterns):
 - Naming conventions: extract real examples of variable, function, file, and folder naming
 - Error handling: extract the actual error class hierarchy and propagation pattern
 - Validation: extract the actual validation library and middleware application pattern
 - Logging: extract the actual logger and what gets logged at which level
 - Response formatting: extract the actual serialization/view/presenter pattern
 - State management: extract the actual state solution combination and rules
 - Data access: extract the actual ORM query patterns and repository conventions

4. **Note Quality Standards**:
 - Identify specific performance patterns actually used (caching, pagination, eager loading)
 - Document specific security practices implemented (input validation, auth, CORS, rate limiting)
 - Note accessibility patterns present in frontend code (ARIA, semantic HTML, keyboard nav)

5. **Check for Reference Documents**:
 - If .github/docs/Project_Architecture_Blueprint.md exists, extract architectural rules from it
 - If .github/docs/exemplars.md exists, reference specific exemplar files for each pattern category
 - These take priority over inferred patterns

### 3. Implementation Notes

The final copilot-instructions.md should:
- Be placed in the .github/instructions/ directory (or project root if that directory structure is not used)
- Reference only patterns and standards that actually exist in the codebase
- Include explicit version compatibility requirements with actual version numbers
- Reference specific exemplar files when available (e.g., For new services, follow the pattern in src/services/fazenda.service.js)
- Provide concrete rules, not vague guidance — replace every instance of follow existing patterns with the ACTUAL pattern detected
- Be comprehensive yet focused — Copilot works best with clear, specific instructions rather than lengthy generic advice
- Include the Never Break These rules section to prevent common violations

Important: Only include guidance based on patterns actually observed in the codebase. The goal is that Copilot reading this file will generate code indistinguishable from code written by the team."

## Expected Output

A comprehensive copilot-instructions.md file that will guide GitHub Copilot to produce code that is perfectly compatible with your existing technology versions, follows your established patterns and architecture, references your exemplar files, respects your monorepo boundaries, and never introduces foreign patterns or library features not present in the codebase.