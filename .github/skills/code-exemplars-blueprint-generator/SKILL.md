---
name: code-exemplars-blueprint-generator
description: 'Comprehensive code exemplars blueprint generator that scans codebases to identify high-quality, representative code examples for establishing coding standards. Automatically detects technology stacks and architectural patterns, identifies exemplars across all architectural layers including background tasks, external integrations, response formatters, and state management patterns. Supports monorepo detection with per-sub-project exemplar analysis. Covers .NET, Java, React, Angular, Vue.js, Svelte, Next.js, Nuxt.js, Node.js, Python, Go, Rust, Ruby on Rails, Flutter, Swift, Kotlin, and infrastructure-as-code projects.'
---

# Code Exemplars Blueprint Generator

## Configuration Variables
${PROJECT_TYPE="Auto-detect|.NET|Java|React|Angular|Vue.js|Svelte|Next.js|Nuxt.js|Node.js|Python|Go|Rust|Ruby on Rails|Flutter|Swift|Kotlin|Other"} <!-- Primary technology -->
${SCAN_DEPTH="Basic|Standard|Comprehensive"} <!-- How deeply to analyze the codebase -->
${INCLUDE_CODE_SNIPPETS=true|false} <!-- Include actual code snippets in addition to file references -->
${CATEGORIZATION="Pattern Type|Architecture Layer|File Type"} <!-- How to organize exemplars -->
${MAX_EXAMPLES_PER_CATEGORY=3} <!-- Maximum number of examples per category -->
${INCLUDE_COMMENTS=true|false} <!-- Include explanatory comments for each exemplar -->
${INCLUDE_ANTI_PATTERNS=true|false} <!-- Include anti-patterns and what to avoid -->
${MONOREPO_MODE="Auto-detect|single|per-project|holistic"} <!-- Monorepo detection and analysis mode -->

## Generated Prompt

"Scan this codebase and generate an exemplars.md file that identifies high-quality, representative code examples. The exemplars should demonstrate our coding standards and patterns to help maintain consistency. Use the following approach:

### 0. Repository Structure Detection
${MONOREPO_MODE == "Auto-detect" ? "Before scanning for exemplars, determine the repository structure by examining:
- Whether the root directory contains multiple sub-directories that are independent projects (each with their own package.json, go.mod, .csproj, Cargo.toml, requirements.txt, Gemfile, pubspec.yaml, or similar project manifest files)
- Whether a workspace configuration exists at the root (package.json with workspaces field, pnpm-workspace.yaml, turbo.json, nx.json, lerna.json, Cargo.toml with workspace members)
- Whether the root has no source code of its own but only contains sub-project directories

If multiple sub-projects are detected, treat this as a **monorepo** and:

**A. Map All Sub-Projects:**
For each sub-project directory detected, document:
- Directory name and path
- Detected technology stack
- Primary role in the system (backend API, frontend SPA, mobile app, shared library, worker, etc.)

**B. Scan Each Sub-Project Independently:**
Apply ALL subsequent sections to EACH sub-project as if it were its own project. Clearly separate exemplars under labeled headings:
- Use headings like '## Exemplars: api/' and '## Exemplars: web/' to separate each analysis
- Each sub-project gets its own technology detection and exemplar identification
- Skip categories that do not apply to a specific sub-project

**C. Cross-Project Exemplars (Monorepo-Specific):**
After scanning each sub-project individually, identify exemplars that demonstrate cross-project patterns:

- **Contract Exemplars**: Best examples of how sub-projects communicate (e.g., a backend endpoint and the frontend service that consumes it — show both sides as a pair)
- **Shared Code Exemplars**: Best examples from shared packages or libraries (if packages/, libs/, shared/, common/ directories exist)
- **Auth Flow Exemplars**: Best example of authentication token being issued in one sub-project and consumed/validated in another
- **Error Propagation Exemplars**: Best example of error flowing from backend (AppError → HTTP status) to frontend (interceptor → toast/redirect)
- **End-to-End Data Flow Exemplars**: Best example showing data flowing through the full stack (frontend form → service → HTTP → controller → service → repository → database → response → cache update → UI re-render) — reference one file from each layer

If the repository is NOT a monorepo (single project detected), skip this section entirely and proceed with single-project scanning starting from Section 1." : MONOREPO_MODE == "holistic" ? "Treat this repository as a monorepo. Identify all sub-projects, scan each one independently for exemplars, then identify cross-project exemplars including: contract pairs, shared code, auth flow, error propagation, and end-to-end data flow examples." : MONOREPO_MODE == "per-project" ? "Scan only the current directory as a single project. Note if evidence suggests this project is part of a larger monorepo and mention this in the introduction." : "Scan the codebase as a single, standalone project."}

### 1. Codebase Analysis Phase
- ${PROJECT_TYPE == "Auto-detect" ? "Automatically detect primary programming languages and frameworks by scanning:
- Project manifest files (package.json, go.mod, Cargo.toml, .csproj, requirements.txt, Gemfile, pubspec.yaml, build.gradle, Package.swift)
- Package dependencies and import statements
- Framework-specific configuration files and folder conventions
- File extensions and naming patterns" : `Focus on ${PROJECT_TYPE} code files`}
- Identify files with high-quality implementation, good documentation, and clear structure
- Look for commonly used patterns, architecture components, and well-structured implementations
- Prioritize files that demonstrate best practices for our technology stack
- Only reference actual files that exist in the codebase — no hypothetical examples

### 2. Exemplar Identification Criteria
Rate potential exemplars against these quality signals:

- **Readability**: Clear naming conventions, consistent formatting, self-documenting code
- **Documentation**: Meaningful comments explaining WHY (not what), JSDoc/docstrings where appropriate
- **Error Handling**: Proper error catching, custom error types, graceful degradation, informative error messages
- **Design Patterns**: Adherence to architectural principles evident in the codebase
- **Single Responsibility**: Each file/class/function does one thing well
- **Testability**: Code that is easy to test (injectable dependencies, pure functions, clear boundaries)
- **Reusability**: Patterns that can be copied and adapted for new features
- **No Code Smells**: No god objects, no deep nesting, no magic numbers, no dead code

When choosing between multiple candidates for the same category, prefer the file that best demonstrates the COMBINATION of these criteria, not just one.

### 3. Core Pattern Categories

${(PROJECT_TYPE == ".NET" || PROJECT_TYPE == "Auto-detect") ? `#### .NET Exemplars (if detected)
- **Domain Models**: Best entity implementing encapsulation, validation, and domain logic
- **Repository Implementations**: Best data access class showing query patterns, transaction handling
- **Service Layer Components**: Best service showing business logic, error handling, dependency usage
- **Controller Patterns**: Best API controller with proper validation, response formatting, error handling
- **Dependency Injection Configuration**: Best example of DI setup, service registration, lifetime management
- **Middleware Components**: Best custom middleware showing pipeline integration
- **DTOs and Mapping**: Best example of request/response shaping (AutoMapper, manual mapping)
- **Unit Test Patterns**: Best test with clear arrange/act/assert, meaningful assertions, proper mocking
- **Integration Test Patterns**: Best test hitting real layers with proper setup/teardown` : ""}

${(PROJECT_TYPE == "Java" || PROJECT_TYPE == "Auto-detect") ? `#### Java Exemplars (if detected)
- **Entity Classes**: Best JPA entity or domain model with proper annotations, relationships, validation
- **Service Implementations**: Best service showing business logic, transaction boundaries, error handling
- **Repository Patterns**: Best data access implementation (JpaRepository, custom queries, specifications)
- **Controller/Resource Classes**: Best REST endpoint with validation, error handling, response formatting
- **Configuration Classes**: Best @Configuration class showing bean definitions, profiles, conditional loading
- **DTO and Mapper Patterns**: Best example of MapStruct, ModelMapper, or manual DTO mapping
- **AOP Usage**: Best aspect implementation (logging, auditing, transaction management)
- **Unit Tests**: Best JUnit/Mockito test with clear structure and meaningful assertions
- **Exception Handling**: Best @ControllerAdvice or custom exception hierarchy` : ""}

${(PROJECT_TYPE == "React" || PROJECT_TYPE == "Auto-detect") ? `#### React Exemplars (if detected)
- **Smart Component (Page)**: Best page component showing data fetching, state management, layout composition
- **Presentational Component (UI)**: Best pure UI component receiving everything via props, fully reusable
- **Custom Hook**: Best extracted hook encapsulating reusable logic (not a query hook — logic hook)
- **Layout Component**: Best layout showing composition of header, sidebar, content, footer

- **State Management Exemplars** (detect which solutions are in use):
- If Zustand: Best store slice showing state shape, actions, and selectors
- If Redux/RTK: Best slice with reducers, extraReducers, and createAsyncThunk
- If Redux + RTK Query: Best API slice with endpoint definitions and cache invalidation
- If TanStack Query: Best query hook (useQuery wrapper with proper key, staleTime, error handling)
- If TanStack Query: Best mutation hook (useMutation with cache invalidation, onSuccess/onError)
- If SWR: Best useSWR hook with fetcher, revalidation config, error handling
- If Context API: Best context provider with value memoization
- If Zustand + TanStack Query coexist: Best example of client state triggering server state refetch

- **Service Layer Exemplars**:
- Best axios/fetch service file (clean API calls, proper return types)
- Best axios interceptor (auth token injection, error handling, retry logic)

- **Form Handling**: Best form with validation (Zod + React Hook Form, Formik, or manual)
- **Route Protection**: Best protected route / route guard implementation
- **Error Boundary**: Best error handling at component level (ErrorBoundary, try/catch in async)
- **Unit Test**: Best component or hook test (React Testing Library, Vitest/Jest)` : ""}

${(PROJECT_TYPE == "Angular" || PROJECT_TYPE == "Auto-detect") ? `#### Angular Exemplars (if detected)
- **Smart Component**: Best component with data loading, service injection, reactive patterns
- **Presentational Component**: Best component with @Input/@Output, OnPush change detection
- **Service Implementation**: Best injectable service with proper error handling and Observable patterns
- **HTTP Interceptor**: Best interceptor (auth, logging, error handling, retry)
- **Route Guard**: Best canActivate/canDeactivate implementation
- **Reactive Form**: Best FormGroup/FormArray implementation with custom validators
- **NgRx Patterns** (if detected): Best action/reducer/effect/selector set
- **NGXS Patterns** (if detected): Best state/action/selector implementation
- **Pipe**: Best custom pipe implementation
- **Directive**: Best custom directive implementation
- **Module Organization**: Best NgModule or standalone component configuration
- **Unit Test**: Best component/service test with TestBed configuration` : ""}

${(PROJECT_TYPE == "Vue.js" || PROJECT_TYPE == "Auto-detect") ? `#### Vue.js Exemplars (if detected)
- **Page Component**: Best view/page component with data loading and state management
- **Reusable Component**: Best component with proper props, emits, slots usage
- **Composable**: Best composable (use* function) encapsulating reusable logic

- **State Management Exemplars**:
- If Pinia: Best store with defineStore, state, getters, actions
- If Vuex: Best module with namespacing, mutations, actions, getters
- If neither: Best provide/inject or reactive composable pattern

- **Routing**: Best route configuration with guards, meta fields, lazy loading
- **Data Fetching**: Best data fetching pattern (TanStack Query for Vue, composable, or manual)
- **Reactivity Patterns**: Best use of ref/reactive, computed, watch/watchEffect
- **Form Handling**: Best form with validation (VeeValidate, FormKit, or manual)
- **Unit Test**: Best component test (Vitest, Vue Test Utils)` : ""}

${(PROJECT_TYPE == "Svelte" || PROJECT_TYPE == "Auto-detect") ? `#### Svelte / SvelteKit Exemplars (if detected)
- **Page Component**: Best +page.svelte with data loading and interactivity
- **Reusable Component**: Best component with proper props, slots, events
- **Svelte Store**: Best writable/readable/derived store implementation
- **Load Function**: Best +page.js or +page.server.js load function
- **Form Action**: Best +page.server.js form action with validation
- **API Route**: Best +server.js endpoint implementation
- **Layout**: Best +layout.svelte showing nested layout composition
- **Reactive Pattern**: Best use of $: declarations and $store subscriptions` : ""}

${(PROJECT_TYPE == "Next.js" || PROJECT_TYPE == "Auto-detect") ? `#### Next.js Exemplars (if detected)
- **Server Component**: Best React Server Component with server-side data fetching
- **Client Component**: Best 'use client' component with interactivity and client state
- **Server Action**: Best server action with form handling, validation, revalidation
- **Route Handler**: Best app/api/ route handler (GET, POST, error handling)
- **Layout**: Best layout.tsx showing composition, metadata, nested layouts
- **Loading/Error States**: Best loading.tsx and error.tsx boundary implementations
- **Middleware**: Best middleware.ts implementation (auth, redirects, rewrites)
- **Data Fetching**: Best fetch pattern with cache/revalidation configuration
- **State Management**: Apply same React state management exemplars above, noting Server vs Client Component boundaries` : ""}

${(PROJECT_TYPE == "Nuxt.js" || PROJECT_TYPE == "Auto-detect") ? `#### Nuxt.js Exemplars (if detected)
- **Page Component**: Best page with useFetch/useAsyncData data loading
- **Server Route**: Best server/api/ route with validation and error handling
- **Composable**: Best custom composable from composables/ folder
- **Server Middleware**: Best server/middleware/ implementation
- **Plugin**: Best plugin from plugins/ folder
- **Layout**: Best layout showing navigation, slots, conditional rendering
- **State Management**: Best Pinia store or useState composable
- **Error Handling**: Best createError/showError usage` : ""}

${(PROJECT_TYPE == "Node.js" || PROJECT_TYPE == "Auto-detect") ? `#### Node.js Backend Exemplars (if detected)
- **Application Bootstrap**: Best server.js/app.js showing initialization, middleware registration, graceful shutdown
- **Route Definition**: Best route file showing endpoint grouping, middleware application, controller binding
- **Controller**: Best controller showing request handling, service delegation, response formatting, error forwarding (next(error))
- **Service**: Best service showing business logic, validation, error throwing (AppError or equivalent), repository usage
- **Repository**: Best repository showing database queries, parameterized operations, query composition

- **Response Formatting Exemplars** (detect if views/, presenters/, serializers/, formatters/ exist):
- Best render(entity) / renderMany(entities) implementation
- Best example of sensitive field removal or field transformation

- **Middleware Exemplars**:
- Best authentication middleware (token validation, req.user attachment)
- Best validation middleware (schema validation before controller)
- Best error handling middleware (centralized error formatting and logging)
- Best rate limiting or security middleware

- **Schema/Validation**: Best Zod/Joi/Yup schema showing input validation with clear error messages
- **Background Job**: Best cron job or queue worker showing schedule, process, error handling, side effects
- **External Integration**: Best service wrapping an external API (axios/fetch call, error mapping, credential management)
- **Database Configuration**: Best Prisma/Sequelize/TypeORM/Mongoose setup and client configuration
- **Utility Function**: Best shared utility (jwt helper, bcrypt wrapper, logger config)
- **Unit Test**: Best service test with mocked dependencies
- **Integration Test**: Best API test hitting real routes with setup/teardown` : ""}

${(PROJECT_TYPE == "Python" || PROJECT_TYPE == "Auto-detect") ? `#### Python Exemplars (if detected)
- **Module Organization**: Best __init__.py and package structure example

- **Framework-Specific** (detect which framework is in use):
- If Django: Best model, best view/viewset, best serializer, best URL config, best admin customization, best signal handler, best management command
- If FastAPI: Best router, best Depends injection, best Pydantic model, best async endpoint, best exception handler, best background task
- If Flask: Best blueprint, best route handler, best application factory, best extension setup

- **Data Model**: Best ORM model (Django Model, SQLAlchemy, Pydantic, dataclass)
- **Service/Business Logic**: Best service function or class with clear inputs/outputs and error handling
- **Repository/Data Access**: Best data access pattern (if separated from framework ORM)
- **Utility Module**: Best helper module with pure functions and proper docstrings
- **Type Hinting**: Best example of comprehensive type annotations
- **Decorator Pattern**: Best custom decorator for cross-cutting concerns
- **Test Case**: Best pytest/unittest test with fixtures, parametrize, clear assertions
- **Configuration**: Best settings/config module with environment-based configuration` : ""}

${(PROJECT_TYPE == "Go" || PROJECT_TYPE == "Auto-detect") ? `#### Go Exemplars (if detected)
- **Package Organization**: Best package showing clean internal structure and exported API
- **Interface Definition**: Best interface showing consumer-side definition, small surface area
- **Interface Implementation**: Best struct implementing an interface with proper method receivers
- **HTTP Handler**: Best handler showing request parsing, validation, service call, response writing
- **Middleware**: Best middleware showing chain composition (chi, gin, echo, or net/http patterns)
- **Service**: Best service struct with injected dependencies and business logic
- **Repository**: Best data access implementation (sqlx, GORM, ent, database/sql)
- **Error Handling**: Best error wrapping chain (fmt.Errorf %w, custom error types, sentinel errors)
- **Concurrency Pattern**: Best goroutine usage with proper context cancellation, WaitGroup, or channel patterns
- **Configuration**: Best config struct with tags (viper, envconfig) and validation
- **Table-Driven Test**: Best _test.go with table-driven test pattern and subtests
- **Mock Implementation**: Best mock/fake for testing (manual or generated)` : ""}

${(PROJECT_TYPE == "Rust" || PROJECT_TYPE == "Auto-detect") ? `#### Rust Exemplars (if detected)
- **Module Organization**: Best mod.rs or module file showing pub/pub(crate) visibility decisions
- **Trait Definition**: Best trait showing clean abstraction with default methods
- **Trait Implementation**: Best impl block showing the trait pattern in practice
- **Error Type**: Best custom error enum (thiserror) or error handling (anyhow) with From conversions
- **Handler/Route**: Best request handler (axum, actix-web, rocket) with extractors and error handling
- **Service/Business Logic**: Best business logic struct with injected dependencies
- **Repository**: Best data access implementation (sqlx, diesel, sea-orm) with type-safe queries
- **Async Pattern**: Best async function showing tokio task management, cancellation, error propagation
- **Ownership Pattern**: Best example demonstrating clean ownership/borrowing without unnecessary cloning
- **Builder Pattern**: Best builder implementation for complex struct construction
- **Unit Test**: Best #[cfg(test)] module with clear test organization` : ""}

${(PROJECT_TYPE == "Ruby on Rails" || PROJECT_TYPE == "Auto-detect") ? `#### Ruby on Rails Exemplars (if detected)
- **Model**: Best ActiveRecord model with validations, scopes, associations, callbacks
- **Controller**: Best controller with before_action, strong params, proper responses
- **Service Object**: Best PORO service (if service layer exists beyond standard MVC)
- **Serializer**: Best serializer/jbuilder/blueprinter for API response formatting
- **Background Job**: Best Sidekiq/ActiveJob worker with error handling and retry config
- **Migration**: Best migration showing clean schema changes
- **Concern**: Best concern showing reusable module extraction
- **Spec/Test**: Best RSpec/Minitest with factories, contexts, shared examples
- **Initializer**: Best initializer showing library configuration
- **Route Configuration**: Best routes.rb section showing RESTful resource definition` : ""}

${(PROJECT_TYPE == "Flutter" || PROJECT_TYPE == "Auto-detect") ? `#### Flutter / Dart Exemplars (if detected)
- **Screen/Page Widget**: Best page widget showing data loading, state management, navigation
- **Reusable Widget**: Best extracted widget with proper constructor, parameters, composition

- **State Management Exemplars** (detect which solution is in use):
- If Bloc: Best Bloc/Cubit with events, states, and clear state transitions
- If Riverpod: Best provider (StateNotifierProvider, FutureProvider) with proper scoping
- If Provider: Best ChangeNotifier with efficient notifyListeners usage
- If GetX: Best GetxController with reactive state

- **Repository**: Best repository abstracting remote and local data sources
- **Data Model**: Best model class with fromJson/toJson (json_serializable, freezed, or manual)
- **Service/Use Case**: Best business logic class with clear input/output
- **Navigation**: Best route configuration (go_router, auto_route, or Navigator patterns)
- **Dependency Injection**: Best DI setup (get_it, injectable, or riverpod)
- **Widget Test**: Best widget test with pumpWidget, finder, expect patterns` : ""}

${(PROJECT_TYPE == "Swift" || PROJECT_TYPE == "Auto-detect") ? `#### Swift / iOS Exemplars (if detected)
- **View (SwiftUI)**: Best SwiftUI view showing composition, state management, modifiers
- **ViewModel**: Best ObservableObject with @Published properties, async data loading, error handling
- **View (UIKit)**: Best UIViewController showing lifecycle, delegation, layout patterns (if UIKit is used)

- **Architecture Exemplars** (detect which pattern is in use):
- If MVVM: Best ViewModel with clean data binding
- If TCA: Best Reducer with State, Action, Effect, Dependency
- If VIPER: Best module showing View-Interactor-Presenter-Entity-Router

- **Networking**: Best URLSession/Alamofire service with async/await, error handling, Codable parsing
- **Data Model**: Best Codable struct with CodingKeys, custom decoding
- **Repository**: Best repository abstracting data sources (Core Data, SwiftData, network)
- **Dependency Injection**: Best DI pattern (constructor injection, Environment, @Dependency)
- **Concurrency**: Best async/await usage with structured concurrency, MainActor, cancellation
- **Protocol Pattern**: Best protocol definition with default extension implementation
- **Unit Test**: Best XCTestCase with async tests, proper mocking` : ""}

${(PROJECT_TYPE == "Kotlin" || PROJECT_TYPE == "Auto-detect") ? `#### Kotlin / Android Exemplars (if detected)
- **Screen (Compose)**: Best @Composable screen with state hoisting, side effects, navigation
- **UI Component (Compose)**: Best reusable @Composable with parameters, preview, theming
- **ViewModel**: Best AndroidX ViewModel with StateFlow, async data loading, error handling
- **XML Layout + Activity/Fragment**: Best traditional View implementation (if XML Views are used)

- **Architecture Exemplars**:
- If MVVM: Best ViewModel with UiState sealed class
- If MVI: Best Intent/State/Effect cycle with state reducer
- Best Use Case / Interactor class (if Clean Architecture layer exists)

- **Repository**: Best repository with remote + local data source abstraction
- **Data Model**: Best data class with model mapping between layers (data → domain → UI)
- **Room Patterns**: Best Entity + DAO + migration (if Room is used)
- **Retrofit/Ktor**: Best API service interface with suspend functions and error handling
- **Dependency Injection**: Best Hilt module or Koin module setup
- **Coroutines**: Best coroutine usage with proper scope, dispatcher, error handling, Flow collection
- **Unit Test**: Best test with MockK/Mockito, Turbine (for Flow), coroutine test dispatcher` : ""}

### 4. Architecture Layer Exemplars

For each architectural layer detected in the codebase, identify the single best file that represents how that layer should be implemented:

- **Presentation Layer**:
- Best user interface component (page, screen, view)
- Best controller or API endpoint handler
- Best response formatter / view / serializer / DTO
- Best form or user input handling

- **Business Logic Layer**:
- Best service implementation with clear business rules
- Best validation or business rule enforcement
- Best workflow or orchestration logic
- Best use case or interactor (if pattern exists)

- **Data Access Layer**:
- Best repository implementation
- Best database model or entity definition
- Best query pattern (complex query, aggregation, pagination)
- Best database migration or schema definition

- **Cross-Cutting Concerns**:
- Best logging implementation or configuration
- Best error handling (custom error class, error middleware, error boundary)
- Best authentication implementation (token generation, validation, middleware)
- Best authorization implementation (role check, permission guard, route protection)
- Best input validation (schema definition, validator middleware/decorator)
- Best configuration management (env loading, validation, typed config)

- **Background Processing** (if detected):
- Best cron job or scheduled task implementation
- Best queue worker or message consumer
- Best job with error handling and retry logic

- **External Integrations** (if detected):
- Best external API wrapper service
- Best implementation showing credential management and error mapping
- Best integration with caching or resilience patterns (TTL cache, retry, fallback)

- **Infrastructure** (if detected):
- Best Dockerfile showing multi-stage build or optimization
- Best CI/CD pipeline configuration
- Best IaC module (Terraform module, K8s manifest, docker-compose service)

### 5. Exemplar Documentation Format

For each identified exemplar, document:
- **File path** (relative to repository root — must be a real file)
- **Category** (which pattern category it belongs to)
- **Why it is exemplary** (2-3 sentences explaining what makes this file a good reference)
- **Key patterns demonstrated** (list the specific principles: SRP, error handling, DI, etc.)
${INCLUDE_COMMENTS ? "- **Implementation notes**: Key implementation details, non-obvious decisions, and coding principles that developers should understand and replicate" : ""}
${INCLUDE_CODE_SNIPPETS ? "- **Representative snippet**: A small, focused code snippet (10-30 lines) showing the most instructive part of the file. Include enough context to understand the pattern but keep it concise. Add inline comments pointing out the exemplary aspects." : ""}

### 6. Anti-Patterns and Guidance
${INCLUDE_ANTI_PATTERNS ? `Identify patterns that should be AVOIDED based on what the codebase does well:

- **Common Mistakes**: Based on the good patterns found, note what the opposite (bad) implementation would look like — without referencing specific bad files
- **Boundary Violations**: Note if any files violate the architectural boundaries that the exemplars establish (e.g., a controller that accesses the database directly instead of going through a service)
- **Inconsistencies**: Note areas where the codebase deviates from its own established patterns
- **Improvement Opportunities**: Suggest areas where existing code could be elevated to match the quality of the identified exemplars

Format each anti-pattern as:
- ❌ **What to avoid**: Description of the anti-pattern
- ✅ **What to do instead**: Reference to the exemplar that shows the correct approach
- 📄 **See exemplar**: Link to the relevant exemplar in this document` : "Note: Enable INCLUDE_ANTI_PATTERNS for detailed anti-pattern documentation."}

${SCAN_DEPTH == "Comprehensive" ? `### 7. Codebase Quality Observations

- **Consistency Patterns**: Note consistent patterns observed across the codebase (naming conventions, file structure, import ordering, comment style)
- **Architecture Adherence**: Rate how consistently the codebase follows its own architectural patterns (High / Medium / Low for each layer)
- **Implementation Conventions**: Document implicit conventions that developers should follow (even if not formally documented)
- **Test Coverage Patterns**: Note which areas have the best test coverage and what testing patterns are most mature
- **Documentation Quality**: Assess the overall documentation quality (inline comments, README, API docs)` : ""}

### ${SCAN_DEPTH == "Comprehensive" ? "8" : "7"}. Output Format

Create .github/docs/exemplars.md with:
1. **Introduction**: Explain the purpose of the document — this is the team's reference for how to write code in this project
2. **Quick Reference Table**: A table with columns: Category | File Path | One-Line Description — for fast lookup
3. **Table of Contents**: Links to all category sections
4. **Organized Sections**: Based on ${CATEGORIZATION}, with up to ${MAX_EXAMPLES_PER_CATEGORY} exemplars per category
5. **Per-Exemplar Documentation**: Following the format defined in Section 5
${INCLUDE_ANTI_PATTERNS ? "6. **Anti-Patterns Section**: What to avoid, with references back to exemplars" : ""}
${SCAN_DEPTH == "Comprehensive" ? "7. **Codebase Quality Observations**: Overall patterns and conventions" : ""}
8. **New Feature Checklist**: A short checklist developers can follow when implementing a new feature:
 - [ ] Check exemplars for the relevant pattern category
 - [ ] Follow the same file structure and naming conventions
 - [ ] Implement error handling consistent with the exemplar
 - [ ] Add validation following the same approach
 - [ ] Write tests following the test exemplar patterns
 - [ ] Run existing tests to verify no regressions

The document should be actionable for developers needing guidance on implementing new features consistent with existing patterns.

Important: Only include actual files from the codebase. Verify all file paths exist. Do not include placeholder or hypothetical examples. If a category has no qualifying exemplar, skip it rather than forcing a poor example."

## Expected Output
Upon running this prompt, the AI will scan your codebase and generate a .github/docs/exemplars.md file containing real references to high-quality code examples in your repository, organized according to your selected parameters. In monorepo mode, each sub-project gets its own exemplar section plus cross-project exemplars showing how sub-projects interact.