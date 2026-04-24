---
name: architecture-blueprint-generator
description: 'Comprehensive project architecture blueprint generator that analyzes codebases to create detailed architectural documentation. Automatically detects technology stacks and architectural patterns, generates visual diagrams, documents implementation patterns, detects background tasks and scheduled jobs, maps external service integrations, identifies response formatting layers, analyzes state management strategies (Zustand, Redux, TanStack Query, SWR), supports monorepo detection with holistic cross-project analysis, and provides extensible blueprints for maintaining architectural consistency and guiding new development. Supports .NET, Java, React, Angular, Vue.js, Svelte, Next.js, Nuxt.js, Node.js, Python, Go, Rust, Ruby on Rails, Flutter, Swift, Kotlin, and infrastructure-as-code projects.'
---

# Comprehensive Project Architecture Blueprint Generator

## Configuration Variables
${PROJECT_TYPE="Auto-detect|.NET|Java|React|Angular|Vue.js|Svelte|Next.js|Nuxt.js|Node.js|Python|Go|Rust|Ruby on Rails|Flutter|Swift|Kotlin|Other"} <!-- Primary technology -->
${ARCHITECTURE_PATTERN="Auto-detect|Clean Architecture|Microservices|Layered|MVVM|MVC|Hexagonal|Event-Driven|Serverless|Monolithic|Modular Monolith|CQRS|Pipeline|Other"} <!-- Primary architectural pattern -->
${DIAGRAM_TYPE="C4|UML|Flow|Component|None"} <!-- Architecture diagram type -->
${DETAIL_LEVEL="High-level|Detailed|Comprehensive|Implementation-Ready"} <!-- Level of detail to include -->
${INCLUDES_CODE_EXAMPLES=true|false} <!-- Include sample code to illustrate patterns -->
${INCLUDES_IMPLEMENTATION_PATTERNS=true|false} <!-- Include detailed implementation patterns -->
${INCLUDES_DECISION_RECORDS=true|false} <!-- Include architectural decision records -->
${FOCUS_ON_EXTENSIBILITY=true|false} <!-- Emphasize extension points and patterns -->
${HAS_BACKGROUND_TASKS="Auto-detect|true|false"} <!-- Detect and document cron jobs, workers, queues -->
${HAS_EXTERNAL_INTEGRATIONS="Auto-detect|true|false"} <!-- Detect and document third-party API integrations -->
${HAS_INFRASTRUCTURE_AS_CODE="Auto-detect|true|false"} <!-- Detect and document IaC (Terraform, Docker, K8s, Ansible, Pulumi) -->
${HAS_DATA_PIPELINE="Auto-detect|true|false"} <!-- Detect and document data pipelines, ETL, streaming -->
${MONOREPO_MODE="Auto-detect|single|per-project|holistic"} <!-- Monorepo detection and analysis mode -->

## Generated Prompt

"Create a comprehensive '.github/docs/Project_Architecture_Blueprint.md' document that thoroughly analyzes the architectural patterns in the codebase to serve as a definitive reference for maintaining architectural consistency. Use the following approach:

### 0. Repository Structure Detection
${MONOREPO_MODE == "Auto-detect" ? "Before analyzing architecture, determine the repository structure by examining:
- Whether the root directory contains multiple sub-directories that are independent projects (each with their own package.json, go.mod, .csproj, Cargo.toml, requirements.txt, Gemfile, pubspec.yaml, or similar project manifest files)
- Whether a workspace configuration exists at the root (package.json with workspaces field, pnpm-workspace.yaml, turbo.json, nx.json, lerna.json, Cargo.toml with workspace members)
- Whether a root-level docker-compose.yml or similar orchestration file references multiple service directories
- Whether the root has no source code of its own but only contains sub-project directories

If multiple sub-projects are detected, treat this as a **monorepo** and:

**A. Document Monorepo Strategy:**
- Workspace tool in use (npm workspaces, pnpm workspaces, yarn workspaces, turborepo, nx, lerna, cargo workspaces, or none — just co-located projects)
- Why it is a monorepo (shared team, coordinated deployment, shared code, unified CI/CD)
- Dependency hoisting and resolution strategy
- Root-level scripts and how they orchestrate sub-projects
- Whether sub-projects can be built/run/tested independently

**B. Map All Sub-Projects:**
For each sub-project directory detected, document:
- Directory name and path
- Detected technology stack (examine each sub-project's manifest and source files independently)
- Detected architectural pattern
- Primary role in the system (backend API, frontend SPA, mobile app, shared library, worker, gateway, etc.)
- Entry point and how to run it

**C. Analyze Each Sub-Project Independently:**
Apply ALL subsequent sections (1 through final) to EACH sub-project as if it were its own project. Clearly separate the analysis under labeled headings:
- Use headings like '## Sub-Project: api/' and '## Sub-Project: web/' to separate each analysis
- Each sub-project gets its own technology detection, layer mapping, component analysis, cross-cutting concerns, and all other applicable sections
- Skip sections that do not apply to a specific sub-project (e.g., State Management for a backend-only project)

**D. Cross-Project Architecture (Monorepo-Specific):**
After analyzing each sub-project individually, document the relationships between them:

- **Contract Surface**:
  - Map API endpoints exposed by backend sub-projects to the service methods that consume them in frontend sub-projects
  - Identify shared types, interfaces, or contracts between sub-projects (shared/ or packages/ directories, shared TypeScript types, OpenAPI specs, GraphQL schemas, protobuf definitions)
  - Document how API changes in one sub-project would impact others
  - Note whether contracts are enforced (generated clients, shared schemas) or informal (manual sync)

- **Shared Code and Packages**:
  - Identify any shared packages or libraries (packages/, libs/, shared/, common/ directories)
  - Document what each shared package provides (utilities, types, UI components, config)
  - How shared packages are consumed (workspace dependency, symlink, published package)
  - Version management of shared code

- **Authentication and Session Flow**:
  - How authentication tokens or sessions flow between sub-projects
  - Which sub-project issues credentials and which ones consume them
  - Token format and validation across sub-project boundaries

- **Environment and Configuration Alignment**:
  - How environment variables relate across sub-projects (e.g., frontend VITE_API_URL must match backend PORT)
  - Shared vs independent environment configuration
  - Secrets that are shared across sub-projects

- **Development Workflow**:
  - How to run the entire system locally (docker-compose, concurrent scripts, turbo dev, nx serve)
  - How to run sub-projects independently
  - Hot reload and cross-project development experience
  - Database setup and seeding from the monorepo root

- **CI/CD and Deployment**:
  - Whether sub-projects are built and deployed together or independently
  - Affected/changed detection for selective builds (turbo --filter, nx affected, custom scripts)
  - Deployment targets per sub-project (e.g., API on Render/Railway, Web on Vercel/Netlify)
  - Build order and dependency graph for deployment

- **Data Flow Across Sub-Projects**:
  - End-to-end data flow for key user journeys (e.g., user creates a resource: frontend form → service call → HTTP request → backend controller → service → repository → database → response → frontend cache update → UI re-render)
  - Where data is transformed between sub-projects (frontend formatters, backend views/serializers)
  - Error propagation across boundaries (backend AppError → HTTP status → frontend interceptor → toast/redirect)

If the repository is NOT a monorepo (single project detected), skip this section entirely and proceed with standard single-project analysis starting from Section 1." : MONOREPO_MODE == "holistic" ? "Treat this repository as a monorepo. Identify all sub-projects, analyze each one independently with all applicable sections, then document cross-project architecture including: contract surface, shared code, authentication flow, environment alignment, development workflow, CI/CD strategy, and end-to-end data flows." : MONOREPO_MODE == "per-project" ? "Analyze only the current directory as a single project. Note if evidence suggests this project is part of a larger monorepo (references to sibling directories, relative imports outside the project, parent workspace configuration) and mention this in the overview, but do not analyze other sub-projects." : "Analyze the codebase as a single, standalone project."}

### 1. Architecture Detection and Analysis
- ${PROJECT_TYPE == "Auto-detect" ? "Analyze the project structure to identify all technology stacks and frameworks in use by examining:
- Project and configuration files
- Package dependencies and import statements
- Framework-specific patterns and conventions
- Build and deployment configurations" : "Focus on ${PROJECT_TYPE} specific patterns and practices"}

- ${ARCHITECTURE_PATTERN == "Auto-detect" ? "Determine the architectural pattern(s) by analyzing:
- Folder organization and namespacing
- Dependency flow and component boundaries
- Interface segregation and abstraction patterns
- Communication mechanisms between components" : "Document how the ${ARCHITECTURE_PATTERN} architecture is implemented"}

### 2. Architectural Overview
- Provide a clear, concise explanation of the overall architectural approach
- Document the guiding principles evident in the architectural choices
- Identify architectural boundaries and how they're enforced
- Note any hybrid architectural patterns or adaptations of standard patterns

### 3. Architecture Visualization
${DIAGRAM_TYPE != "None" ? `Create ${DIAGRAM_TYPE} diagrams at multiple levels of abstraction:
- High-level architectural overview showing major subsystems
- Component interaction diagrams showing relationships and dependencies
- Data flow diagrams showing how information moves through the system
- If monorepo: include a top-level diagram showing sub-project relationships and communication paths
- Ensure diagrams accurately reflect the actual implementation, not theoretical patterns` : "Describe the component relationships based on actual code dependencies, providing clear textual explanations of:
- Subsystem organization and boundaries
- Dependency directions and component interactions
- Data flow and process sequences
- If monorepo: describe how sub-projects relate and communicate with each other"}

### 4. Core Architectural Components
For each architectural component discovered in the codebase:

- **Purpose and Responsibility**:
- Primary function within the architecture
- Business domains or technical concerns addressed
- Boundaries and scope limitations

- **Internal Structure**:
- Organization of classes/modules within the component
- Key abstractions and their implementations
- Design patterns utilized

- **Interaction Patterns**:
- How the component communicates with others
- Interfaces exposed and consumed
- Dependency injection patterns
- Event publishing/subscription mechanisms

- **Evolution Patterns**:
- How the component can be extended
- Variation points and plugin mechanisms
- Configuration and customization approaches

### 5. Architectural Layers and Dependencies
- Map the layer structure as implemented in the codebase
- Document the dependency rules between layers
- Identify abstraction mechanisms that enable layer separation
- Note any circular dependencies or layer violations
- Document dependency injection patterns used to maintain separation

### 6. Data Architecture
- Document domain model structure and organization
- Map entity relationships and aggregation patterns
- Identify data access patterns (repositories, data mappers, etc.)
- Document data transformation and mapping approaches
- Note caching strategies and implementations
- Document data validation patterns

### 7. Cross-Cutting Concerns Implementation
Document implementation patterns for cross-cutting concerns:

- **Authentication & Authorization**:
- Security model implementation
- Permission enforcement patterns
- Identity management approach
- Security boundary patterns

- **Error Handling & Resilience**:
- Exception handling patterns
- Retry and circuit breaker implementations
- Fallback and graceful degradation strategies
- Error reporting and monitoring approaches

- **Logging & Monitoring**:
- Instrumentation patterns
- Observability implementation
- Diagnostic information flow
- Performance monitoring approach

- **Validation**:
- Input validation strategies
- Business rule validation implementation
- Validation responsibility distribution
- Error reporting patterns

- **Configuration Management**:
- Configuration source patterns
- Environment-specific configuration strategies
- Secret management approach
- Feature flag implementation

### 8. Service Communication Patterns
- Document service boundary definitions
- Identify communication protocols and formats
- Map synchronous vs. asynchronous communication patterns
- Document API versioning strategies
- Identify service discovery mechanisms
- Note resilience patterns in service communication

### 8.5. Background Tasks and Scheduled Jobs
${HAS_BACKGROUND_TASKS == "Auto-detect" ? "Analyze the codebase for background processing patterns by examining:
- Cron job configurations and scheduled task definitions
- Job/worker/queue folders and files (jobs/, workers/, queues/, tasks/)
- Timer-based or interval-based execution patterns
- Libraries like node-cron, bull, bullmq, agenda, celery, quartz, hangfire, sidekiq, tokio tasks, goroutines with tickers

If background tasks are detected, document for each one:
- **Schedule**: When and how often it runs (cron expression, interval, trigger)
- **Trigger**: What initiates the task (time-based, event-based, manual)
- **Process**: What the job does step by step
- **Dependencies**: Which services/repositories it calls
- **Side Effects**: What external systems it affects (notifications, emails, status updates, database changes)
- **Error Handling**: What happens if the job fails mid-execution (retry, dead letter, alert)
- **Concurrency**: Whether multiple instances can run simultaneously and how conflicts are prevented
- **Monitoring**: How to know if the job ran successfully (logs, status flags, health checks)

Map how background tasks interact with the main request/response flow:
- Shared services and repositories between HTTP handlers and jobs
- Data consistency considerations between sync and async operations
- Resource contention patterns and mitigation strategies" : HAS_BACKGROUND_TASKS == "true" ? "Document all background tasks and scheduled jobs found in the codebase, including: schedule, trigger, process flow, dependencies, side effects, error handling, concurrency considerations, and monitoring approaches. Map how background tasks interact with the main request/response flow." : ""}

### 8.7. External Service Integrations
${HAS_EXTERNAL_INTEGRATIONS == "Auto-detect" ? "Scan the codebase for external service integrations by examining:
- HTTP client configurations (axios instances, fetch wrappers, HttpClient configs, reqwest, hyper, net/http)
- API keys and external URLs in environment variables
- SDK imports and third-party API client libraries
- Service files that communicate with non-project endpoints

For each external integration detected, document:

- **Service Identity**:
  - Name and purpose of the external service
  - API type (REST, GraphQL, WebSocket, gRPC, SDK)
  - Base URL pattern and authentication method (API key, OAuth, token, mTLS)

- **Integration Architecture**:
  - Which internal service wraps this integration
  - How credentials are managed (env vars, secret manager, vault)
  - Request/response transformation patterns
  - Error mapping (external errors → internal AppError/exceptions)

- **Resilience Patterns**:
  - Caching strategy (avoid repeated external calls? TTL-based cache?)
  - Timeout configuration
  - Retry logic and backoff strategy
  - Fallback behavior when the external service is unavailable
  - Circuit breaker implementation (if any)

- **Data Flow**:
  - What data is sent to the external service
  - What data is received and how it is used internally
  - Whether external data is persisted locally (cache table, materialized copy)

- **Coupling Assessment**:
  - How tightly coupled is the application to this specific provider
  - How difficult would it be to swap for an alternative provider
  - Whether an abstraction layer exists between business logic and external API
  - Anti-corruption layer patterns (if any)" : HAS_EXTERNAL_INTEGRATIONS == "true" ? "Document all external service integrations found in the codebase, including: service identity, integration architecture, resilience patterns, data flow, and coupling assessment for each integration." : ""}

### 8.8. Infrastructure as Code
${HAS_INFRASTRUCTURE_AS_CODE == "Auto-detect" ? "Scan the codebase for infrastructure-as-code definitions by examining:
- Terraform files (.tf, .tfvars, terraform/ directory)
- Docker configurations (Dockerfile, docker-compose.yml, .dockerignore)
- Kubernetes manifests (k8s/, manifests/, *.yaml with apiVersion)
- CI/CD pipeline definitions (.github/workflows/, .gitlab-ci.yml, Jenkinsfile, .circleci/)
- Ansible playbooks (playbooks/, roles/, inventory)
- Pulumi programs (Pulumi.yaml, __main__.py with pulumi imports)
- CloudFormation templates (template.yaml with AWSTemplateFormatVersion)
- Serverless framework configs (serverless.yml)
- Helm charts (Chart.yaml, templates/)

If infrastructure definitions are detected, document:

- **IaC Tool Inventory**:
  - Which IaC tools are used and for what purpose
  - Version constraints and provider configurations
  - Whether infrastructure is managed as a monorepo or separate repo

- **Environment Architecture**:
  - How environments are defined and separated (dev, staging, production)
  - Environment-specific variable/secret management
  - Promotion strategy between environments

- **Container Architecture** (if Docker/K8s detected):
  - Dockerfile patterns (multi-stage builds, base image choices, layer optimization)
  - Container orchestration approach (docker-compose for dev, K8s for prod, ECS, etc.)
  - Service mesh or networking configuration
  - Volume and persistence strategies
  - Health check and readiness probe definitions

- **CI/CD Pipeline Architecture**:
  - Pipeline stages and their purpose (lint, test, build, deploy)
  - Artifact management (container registry, package registry)
  - Deployment strategy (rolling, blue-green, canary)
  - Rollback mechanisms
  - Environment protection rules and approval gates

- **Cloud Resource Architecture** (if Terraform/Pulumi/CloudFormation detected):
  - Resource organization (modules, stacks, workspaces)
  - State management approach (remote state, locking)
  - Resource dependency graph
  - Tagging and naming conventions
  - Cost-relevant architectural decisions" : HAS_INFRASTRUCTURE_AS_CODE == "true" ? "Document all infrastructure-as-code definitions found in the codebase, including: IaC tools used, environment architecture, container architecture, CI/CD pipelines, and cloud resource organization." : ""}

### 8.9. Data Pipeline Architecture
${HAS_DATA_PIPELINE == "Auto-detect" ? "Scan the codebase for data pipeline patterns by examining:
- ETL/ELT script files and pipeline definitions
- Libraries like pandas, spark, dbt, airflow, prefect, dagster, kafka, flink, beam
- Data transformation folders (pipelines/, etl/, transformations/, dags/)
- Streaming configurations (kafka topics, event hubs, kinesis streams)
- Data warehouse/lake connection patterns
- Notebook files (.ipynb) that are part of automated pipelines

If data pipeline patterns are detected, document:

- **Pipeline Topology**:
  - Source systems and data ingestion points
  - Transformation stages and their dependencies (DAG structure)
  - Destination systems (data warehouse, lake, API, cache)
  - Batch vs streaming vs hybrid processing model

- **Orchestration**:
  - Pipeline scheduler/orchestrator (Airflow, Prefect, Dagster, cron, Step Functions)
  - DAG organization and naming conventions
  - Trigger mechanisms (schedule, event, manual)
  - Dependency management between pipeline steps
  - Retry and failure handling per stage

- **Data Quality**:
  - Validation and quality check implementations
  - Schema enforcement patterns
  - Data contract definitions
  - Monitoring and alerting on data anomalies

- **Performance Patterns**:
  - Partitioning and parallelization strategies
  - Incremental vs full load patterns
  - Backfill mechanisms
  - Resource scaling approach" : HAS_DATA_PIPELINE == "true" ? "Document all data pipeline patterns found in the codebase, including: pipeline topology, orchestration, data quality, and performance patterns." : ""}

### 9. Technology-Specific Architectural Patterns
${PROJECT_TYPE == "Auto-detect" ? "For each detected technology stack, document specific architectural patterns:" : `Document ${PROJECT_TYPE}-specific architectural patterns:`}

${(PROJECT_TYPE == ".NET" || PROJECT_TYPE == "Auto-detect") ?
"#### .NET Architectural Patterns (if detected)
- Host and application model implementation
- Middleware pipeline organization
- Framework service integration patterns
- ORM and data access approaches (Entity Framework, Dapper, etc.)
- API implementation patterns (controllers, minimal APIs, etc.)
- Dependency injection container configuration
- Response formatting layer detection (see Node.js section for full detection criteria — apply same analysis to .NET serializers, DTOs, AutoMapper profiles, JsonConverter implementations)" : ""}

${(PROJECT_TYPE == "Java" || PROJECT_TYPE == "Auto-detect") ?
"#### Java Architectural Patterns (if detected)
- Application container and bootstrap process
- Dependency injection framework usage (Spring, CDI, etc.)
- AOP implementation patterns
- Transaction boundary management
- ORM configuration and usage patterns (JPA, Hibernate, MyBatis)
- Service implementation patterns
- Response formatting layer detection (ModelMapper, MapStruct, DTO assemblers, JsonView annotations — document if a dedicated response shaping layer exists)" : ""}

${(PROJECT_TYPE == "React" || PROJECT_TYPE == "Auto-detect") ?
"#### React Architectural Patterns (if detected)
- Component composition and reuse strategies
- Side effect handling patterns
- Routing and navigation approach
- Data fetching and caching patterns
- Rendering optimization strategies

- **Response Formatting Layer Detection**:
Examine if the project implements a dedicated response formatting layer (sometimes called views, presenters, serializers, transformers, or formatters):

- Look for files/folders named: views/, presenters/, serializers/, transformers/, formatters/, mappers/ (in the response context)
- Look for patterns like: render(entity), renderMany(entities), toJSON(), serialize(), format(), present()

If detected, document:
- **Pattern Name**: How the project refers to this layer (views, presenters, serializers, etc.)
- **Purpose**: Controlling what data is exposed to the client (field selection, sensitive data removal, computed fields, field renaming)
- **Convention**: The consistent API each formatter exposes (e.g., render/renderMany, serialize/serializeMany)
- **Placement in Flow**: Where it sits in the request/response cycle (e.g., controller calls view before sending response)
- **Architectural Role**: If this is an adaptation of a traditional pattern (e.g., the V in MVC adapted for APIs — shaping JSON responses instead of rendering HTML templates), document this adaptation explicitly so it is not confused with traditional view rendering

- **State Management Strategy Detection**:
Analyze the codebase to identify ALL state management solutions in use by examining:
- Package dependencies (zustand, @reduxjs/toolkit, redux, @tanstack/react-query, swr, jotai, recoil, mobx)
- Store/slice folder structures and file naming conventions
- Provider components wrapping the app (QueryClientProvider, Provider with store, etc.)
- Import patterns across components and hooks

##### If Zustand is detected:
- **Store Organization**:
  - How stores are structured (single store vs multiple stores vs slices pattern)
  - Look for slice files: slices/, *Slice.js, *Store.js
  - Document each slice found: name, state shape, and actions exposed
  - Whether slices are combined into a single store or kept separate

- **Persistence**:
  - Whether zustand/middleware persist is used
  - What data survives page refresh vs what resets

- **Subscription Patterns**:
  - How components select state (full store vs selectors)
  - Whether selective subscriptions are used to avoid unnecessary re-renders

##### If Redux / Redux Toolkit is detected:
- **Store Architecture**:
  - Store configuration approach (configureStore vs legacy createStore)
  - Whether Redux Toolkit (RTK) is used or legacy Redux with manual boilerplate
  - Middleware chain: thunk, saga, listener, custom middlewares

- **Slice Organization**:
  - Document each slice found under slices/, features/, or store/ folders
  - For each slice: name, initialState shape, reducers (sync), and extraReducers (async)
  - Whether createSlice (RTK) or manual action types + action creators + reducers
  - Naming conventions: *Slice.js, *Reducer.js, *Actions.js

- **Async Patterns**:
  - createAsyncThunk usage and naming conventions
  - How pending/fulfilled/rejected states are handled in extraReducers
  - Whether RTK Query is used (and if so, document: createApi configuration, base query setup, endpoint definitions with query/mutation, cache tag types, tag invalidation strategy, and how it replaces or coexists with manual fetch logic)
  - OR whether thunks + manual loading/error state management is used
  - OR whether redux-saga is used (document saga organization and effect patterns)

- **Selector Patterns**:
  - Whether reselect / createSelector is used for memoized selectors
  - Selector file organization (co-located with slices vs centralized selectors/ folder)
  - Derived state computation patterns

- **Dispatch Patterns**:
  - How actions are dispatched (useDispatch directly vs custom hooks wrapping dispatch)
  - Whether action creators are exported and used or inline dispatch with action objects
  - Typed dispatch patterns (useAppDispatch in TypeScript projects)

- **Redux DevTools**:
  - Whether DevTools integration is configured
  - Any custom DevTools configuration or action sanitizers

##### If TanStack Query (React Query) is detected:
- **Query Organization**:
  - How query hooks are organized (queries/ folder, co-located with features, etc.)
  - Naming conventions: useGet*, useCreate*, useUpdate*, useDelete*
  - Whether custom hooks wrap useQuery/useMutation or if they are used directly in components

- **Cache Strategy**:
  - QueryClient default configuration (staleTime, gcTime/cacheTime, refetchOnWindowFocus, retry)
  - Per-query cache overrides for specific use cases
  - Query key conventions and structure (string vs array vs query key factory pattern)

- **Mutation Patterns**:
  - How mutations handle optimistic updates (if any)
  - Cache invalidation strategy after mutations (invalidateQueries, setQueryData, refetchQueries)
  - onSuccess/onError/onSettled callback patterns
  - Whether mutations trigger toast notifications or redirects

- **Query Dependencies**:
  - Dependent queries (enabled option based on other data)
  - How query parameters flow from component state, URL params, or global state

##### If SWR is detected:
- Fetcher configuration and global SWRConfig options
- Cache and revalidation strategy (revalidateOnFocus, revalidateOnReconnect, dedupingInterval)
- Mutation patterns (mutate, optimisticData, rollbackOnError)
- Key conventions and conditional fetching patterns

##### Multi-Solution Interaction (when 2+ state solutions coexist):
Identify the **state categorization rules** the project follows:

| State Type | Typical Owner | Examples |
|------------|---------------|----------|
| Server data (fetched from API) | TanStack Query / RTK Query / SWR | Lists, entities, external data |
| Client-only UI state | Zustand / Redux slices / Context | Sidebar open, theme, modal visibility |
| Cross-cutting client state | Zustand / Redux | Auth user, selected filters that affect queries |
| Form state | Local useState / React Hook Form / Formik | Input values during editing |

Document the **reactive chains** between state solutions:
- How client state changes trigger server state refetches (e.g., selected filter in Zustand/Redux changes → query key updates → TanStack Query/RTK Query refetches automatically)
- How server state updates might affect client state (e.g., login mutation response → store user in Zustand/Redux)
- Full chain example: user action → client state change → query key/enabled flag changes → automatic refetch → UI re-renders with updated data

Document the **boundary rules** (what goes where):
- What should NEVER be stored in client state (API data that the server-state library already caches)
- What should NEVER be a server-state query (UI preferences, ephemeral selections, modal open/close)
- Decision guide for developers: given a new piece of state, which solution should be used and why

If only ONE state solution exists (e.g., only Redux handling everything, or only Context + local state), document that as the chosen strategy and note whether server state caching is handled manually or delegated to a dedicated library." : ""}

${(PROJECT_TYPE == "Angular" || PROJECT_TYPE == "Auto-detect") ?
"#### Angular Architectural Patterns (if detected)
- Module organization strategy (NgModules vs standalone components)
- Component hierarchy design and smart/dumb component separation
- Service and dependency injection patterns (providedIn root vs module-scoped)
- State management approach (NgRx, NGXS, Akita, simple services with BehaviorSubject)
- Reactive programming patterns (RxJS usage, async pipe, Observable composition)
- Route guard implementation (canActivate, canDeactivate, resolve)
- Interceptor pipeline (HTTP interceptors for auth, logging, error handling)
- Lazy loading and code splitting strategy
- Response formatting layer detection (pipes, DTOs, mapper services — document if a dedicated response shaping layer exists)" : ""}

${(PROJECT_TYPE == "Vue.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Vue.js Architectural Patterns (if detected)
- **Application Structure**:
- Vue version in use (Vue 2 with Options API vs Vue 3 with Composition API vs mixed)
- Project scaffolding tool (Vue CLI, Vite, Nuxt — if not fullstack Nuxt, document Vue SPA patterns)
- Folder organization (views/, components/, composables/, stores/, services/)

- **Component Architecture**:
- Component composition strategy (props down, events up)
- Smart vs presentational component separation
- Slot usage patterns for flexible layouts
- Component naming and file organization conventions
- Multi-root component usage (Vue 3 fragments)

- **State Management**:
- Whether Pinia or Vuex is used
- If Pinia: store organization (defineStore, setup vs options syntax, store composition)
- If Vuex: module organization (namespaced modules, root state, getters, mutations, actions)
- If neither: whether provide/inject or reactive composables are used as state management
- Document each store/module: name, state shape, actions, getters

- **Composition Patterns** (Vue 3):
- Composable organization (composables/ or hooks/ folder)
- Naming conventions (use* prefix)
- Shared logic extraction patterns
- Composable dependency patterns (composables calling other composables)

- **Routing**:
- Vue Router configuration and route organization
- Navigation guards (beforeEach, beforeEnter, per-route guards)
- Route meta fields usage (auth, roles, layout)
- Lazy loading and route-level code splitting

- **Data Fetching**:
- Whether TanStack Query (Vue), SWR-like libraries, or manual fetch/axios patterns are used
- If using composables for data fetching, document the pattern
- Loading/error state management approach
- Cache strategy

- **Reactivity Patterns**:
- ref vs reactive usage conventions
- watch vs watchEffect usage patterns
- computed property patterns
- Template ref usage for DOM access" : ""}

${(PROJECT_TYPE == "Svelte" || PROJECT_TYPE == "Auto-detect") ?
"#### Svelte / SvelteKit Architectural Patterns (if detected)
- **Application Structure**:
- Whether plain Svelte or SvelteKit is used
- Routing approach (SvelteKit file-based routing with +page.svelte, +layout.svelte, +server.js)
- Folder organization (routes/, lib/, lib/components/, lib/server/)

- **Component Architecture**:
- Component composition patterns (props, slots, component events)
- Naming and file organization conventions
- Shared component library organization (lib/components/)

- **State Management**:
- Svelte stores usage (writable, readable, derived)
- Store file organization and naming conventions
- Whether external state libraries are used (svelte/store is usually sufficient)
- Context API usage (setContext/getContext) for component tree scoping
- Document each store: name, purpose, subscribers

- **Data Loading** (SvelteKit):
- Load functions (+page.js, +page.server.js, +layout.js)
- Server vs universal load functions and when each is used
- Form actions (+page.server.js actions) for mutations
- API routes (+server.js) organization and patterns
- Error and loading state handling

- **Reactivity Patterns**:
- Reactive declarations ($:) usage patterns
- Store auto-subscriptions ($store) patterns
- Reactive statement vs derived store decisions
- Event dispatching patterns (createEventDispatcher)" : ""}

${(PROJECT_TYPE == "Next.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Next.js Architectural Patterns (if detected)
- **Application Structure**:
- Router in use (App Router with app/ directory vs Pages Router with pages/ directory vs hybrid)
- Next.js version and key features enabled
- Folder organization alongside the router (components/, lib/, services/, hooks/)

- **Rendering Strategy**:
- Server Components vs Client Components boundary decisions
- Which components are marked with 'use client' and why
- Static generation (generateStaticParams) vs server-side rendering vs client-side patterns
- Streaming and Suspense boundary placement
- ISR (Incremental Static Regeneration) usage if any

- **Data Fetching**:
- Server-side data fetching patterns (fetch in Server Components, server actions)
- Client-side data fetching (TanStack Query, SWR, or manual)
- If using App Router: how server actions are organized and invoked
- If using Pages Router: getServerSideProps, getStaticProps patterns
- Cache and revalidation configuration (revalidate, tags, on-demand revalidation)

- **Routing and Layouts**:
- Layout nesting strategy (root layout, nested layouts, route groups)
- Route groups usage for organization without URL impact
- Parallel routes and intercepting routes (if any)
- Middleware usage (middleware.ts for auth, redirects, rewrites)
- Loading and error boundary placement (loading.js, error.js, not-found.js)

- **API Layer**:
- Route Handlers (app/api/) organization and patterns
- OR API Routes (pages/api/) organization
- Whether the API layer is thin (proxy to external) or contains business logic
- Server Actions vs Route Handlers decision patterns

- **State Management**:
- Apply the same State Management Strategy Detection as described in the React section above
- Additionally note: how server state and client state boundary aligns with Server Components vs Client Components boundary
- Whether URL state (searchParams) is used as a state management mechanism" : ""}

${(PROJECT_TYPE == "Nuxt.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Nuxt.js Architectural Patterns (if detected)
- **Application Structure**:
- Nuxt version (Nuxt 2 vs Nuxt 3) and key features enabled
- Auto-imports configuration and usage
- Folder organization (pages/, components/, composables/, server/, stores/, middleware/, plugins/, layouts/)

- **Rendering Strategy**:
- Rendering mode (universal SSR, SPA, static generation, hybrid per-route)
- Route rules for per-page rendering strategy (routeRules in nuxt.config)
- Island components usage (if Nuxt 3)

- **Data Fetching**:
- useFetch vs useAsyncData usage patterns and conventions
- Server-side vs client-side fetching decisions
- $fetch usage in server routes and composables
- Key/cache management for fetch composables
- Error handling in data fetching (createError, showError)

- **Server Engine (Nitro)**:
- Server routes organization (server/api/, server/routes/)
- Server middleware (server/middleware/)
- Server utilities (server/utils/)
- Database access patterns from server routes
- Whether server routes are thin proxies or contain business logic

- **State Management**:
- Whether Pinia is used (Nuxt module @pinia/nuxt)
- useState composable usage for SSR-safe shared state
- Apply same Pinia/Vuex patterns documented in Vue.js section
- How state hydration works between server and client

- **Composables and Auto-imports**:
- Custom composable organization (composables/ folder)
- How auto-imports affect code organization
- Naming conventions for auto-imported composables
- Plugin architecture (plugins/ folder, provide/inject via nuxtApp)" : ""}

${(PROJECT_TYPE == "Python" || PROJECT_TYPE == "Auto-detect") ?
"#### Python Architectural Patterns (if detected)
- **Module Organization**:
- Package structure and __init__.py patterns
- Module organization approach (by feature, by layer, hybrid)
- Import conventions and circular import prevention

- **Framework Detection**:
- If Django: project/app structure, settings organization, URL routing patterns, class-based vs function-based views, Django REST Framework serializer/viewset patterns, model/manager patterns, signal usage, middleware pipeline, template/static organization
- If FastAPI: router organization, dependency injection via Depends, Pydantic model patterns, async endpoint patterns, middleware and exception handlers, background tasks (BackgroundTasks), lifespan events
- If Flask: blueprint organization, application factory pattern, extension registration, decorator patterns, request/response handling
- If other framework: identify and document the framework-specific patterns

- **Dependency Management**:
- Package management tool (pip + requirements.txt, Poetry, Pipenv, uv, conda)
- Virtual environment approach
- Dependency grouping (dev, test, production)

- **OOP vs Functional Patterns**:
- Class-based vs function-based approach and when each is used
- Dataclass / Pydantic model usage for data structures
- Protocol / ABC usage for interface definitions
- Decorator patterns for cross-cutting concerns

- **Async Patterns**:
- Whether async/await is used and for what (endpoints, database, external calls)
- Event loop and async library (asyncio, uvloop)
- Sync vs async boundary management

- **Type Hinting**:
- Extent of type annotation usage
- Whether mypy/pyright is enforced
- Type alias and generic usage patterns" : ""}

${(PROJECT_TYPE == "Go" || PROJECT_TYPE == "Auto-detect") ?
"#### Go Architectural Patterns (if detected)
- **Project Layout**:
- Whether the project follows golang-standards/project-layout or a custom structure
- cmd/ vs single main.go entry point organization
- internal/ vs pkg/ separation for encapsulation
- Package organization strategy (by feature, by layer, by domain)

- **Dependency Management**:
- Go modules configuration (go.mod, go.sum)
- Dependency organization and version management
- Vendoring approach (if any)

- **Interface Patterns**:
- Implicit interface implementation patterns
- Interface definition placement (consumer-side vs producer-side)
- Small interface philosophy (io.Reader, io.Writer style)
- Mock generation approach (mockgen, counterfeiter, manual)

- **Concurrency Architecture**:
- Goroutine usage patterns and lifecycle management
- Channel patterns (fan-in, fan-out, pipeline, done channel)
- sync primitives usage (WaitGroup, Mutex, Once, Pool)
- Context propagation for cancellation and timeouts
- Worker pool implementations

- **Error Handling**:
- Error wrapping patterns (fmt.Errorf with %w, custom error types)
- Sentinel errors vs error type checking
- Error handling conventions across layers
- Whether errors are logged at boundaries or propagated

- **HTTP Layer**:
- HTTP framework/router (net/http, chi, gin, echo, fiber, gorilla/mux)
- Handler organization and middleware patterns
- Request/response struct patterns
- Middleware chaining approach

- **Data Access**:
- Database library (database/sql, sqlx, GORM, ent, sqlc)
- Repository or data access pattern implementation
- Connection pooling configuration
- Migration management (golang-migrate, goose, atlas)

- **Configuration**:
- Configuration loading approach (viper, envconfig, env parsing, flags)
- Struct-based configuration with tags
- Configuration validation patterns" : ""}

${(PROJECT_TYPE == "Rust" || PROJECT_TYPE == "Auto-detect") ?
"#### Rust Architectural Patterns (if detected)
- **Project Structure**:
- Workspace organization (Cargo.toml workspace members)
- Crate organization (binary crate vs library crates vs both)
- Module system usage (mod.rs vs file-per-module, pub/pub(crate) visibility)
- Feature flags in Cargo.toml for conditional compilation

- **Ownership and Architecture**:
- How ownership/borrowing rules influence architectural boundaries
- Arc/Rc usage patterns for shared state
- Where cloning is acceptable vs where references are preferred
- Interior mutability patterns (RefCell, Mutex, RwLock) and when they are used

- **Trait Patterns**:
- Trait definition and implementation organization
- Trait objects (dyn Trait) vs generics (impl Trait) decisions
- Default implementations and extension patterns
- Async traits (async-trait crate or native async fn in traits)

- **Error Handling**:
- Error type strategy (thiserror, anyhow, custom error enums)
- Result propagation patterns (? operator usage)
- Error conversion patterns (From implementations)
- Error handling at API boundaries vs internal propagation

- **Async Runtime**:
- Async runtime (tokio, async-std, or sync-only)
- Task spawning and lifecycle patterns
- Channel patterns for inter-task communication (tokio::sync, crossbeam)
- Structured concurrency approaches

- **Web Framework** (if applicable):
- Framework (actix-web, axum, rocket, warp)
- Handler/route organization patterns
- Middleware/layer patterns (tower middleware for axum, actix middleware)
- State sharing (app state, extensions, extractors)
- Request extraction and response building patterns

- **Data Access**:
- ORM/query builder (diesel, sqlx, sea-orm)
- Connection pool management (deadpool, bb8, r2d2)
- Migration approach
- Type-safe query patterns" : ""}

${(PROJECT_TYPE == "Ruby on Rails" || PROJECT_TYPE == "Auto-detect") ?
"#### Ruby on Rails Architectural Patterns (if detected)
- **Application Structure**:
- Rails version and key features enabled
- Whether following standard Rails conventions or custom structure
- Engine/mountable engine usage for modularization
- Gem organization and Bundler configuration

- **MVC Implementation**:
- Model patterns (ActiveRecord usage, validations, callbacks, scopes, associations)
- Controller patterns (before_action chains, strong parameters, response rendering)
- View patterns (ERB/Haml/Slim, partials, helpers, view components)
- Whether API-only mode (--api) is used

- **Service Layer** (if present beyond standard MVC):
- Service objects / interactors / form objects / query objects
- Where business logic lives (fat models vs service objects vs concerns)
- Command/operation patterns (dry-rb, interactor gem, custom)

- **Background Processing**:
- Job framework (Sidekiq, Resque, DelayedJob, GoodJob, SolidQueue)
- Job organization and naming conventions
- Queue configuration and priority management
- ActiveJob abstraction usage

- **Data Patterns**:
- ActiveRecord vs Data Mapper approach
- Migration organization and conventions
- Seed data strategy
- Database configuration (database.yml, multi-database support)
- N+1 query prevention patterns (includes, eager_load, strict_loading)

- **API Patterns** (if API mode or API endpoints):
- Serialization approach (ActiveModelSerializers, Jbuilder, Blueprinter, Alba, custom)
- API versioning strategy
- Authentication (Devise, JWT, custom)
- Rate limiting and throttling

- **Rails-Specific Patterns**:
- Concern usage and organization
- Initializer organization
- Rack middleware stack customization
- Asset pipeline or modern alternatives (importmap, jsbundling, cssbundling)
- Turbo/Hotwire patterns (if used)" : ""}

${(PROJECT_TYPE == "Flutter" || PROJECT_TYPE == "Auto-detect") ?
"#### Flutter / Dart Architectural Patterns (if detected)
- **Application Structure**:
- Flutter version and platform targets (iOS, Android, Web, Desktop)
- Folder organization (lib/ structure: features/, core/, shared/, models/, services/)
- Whether feature-first or layer-first organization is used

- **State Management**:
- State management solution (Provider, Riverpod, Bloc/Cubit, GetX, MobX, Redux, ValueNotifier)
- If Bloc: Bloc vs Cubit usage, event/state class organization, BlocProvider/MultiBlocProvider patterns
- If Riverpod: Provider types (Provider, StateProvider, StateNotifierProvider, FutureProvider, StreamProvider), provider scoping, ref usage patterns
- If Provider: ChangeNotifier organization, MultiProvider setup, ProxyProvider patterns
- State class design (sealed classes, freezed, equatable)

- **Navigation**:
- Navigation approach (Navigator 1.0, Navigator 2.0/Router, go_router, auto_route, beamer)
- Route organization and deep linking support
- Navigation guard/redirect patterns
- Nested navigation patterns

- **Data Layer**:
- Repository pattern implementation
- Data source abstraction (remote vs local)
- Model/entity separation (data models vs domain entities)
- Serialization approach (json_serializable, freezed, manual fromJson/toJson)
- Local storage (shared_preferences, hive, drift/moor, sqflite, isar)

- **Dependency Injection**:
- DI approach (get_it, injectable, riverpod, manual)
- Service locator vs constructor injection
- Scoping and lifecycle management

- **Platform Integration**:
- Platform channel usage patterns
- Plugin organization
- Platform-specific code organization (platform/ folders)" : ""}

${(PROJECT_TYPE == "Swift" || PROJECT_TYPE == "Auto-detect") ?
"#### Swift / iOS Architectural Patterns (if detected)
- **Application Structure**:
- Project type (UIKit, SwiftUI, or hybrid)
- Xcode project organization (groups, folders, targets)
- Module/framework organization (SPM packages, local frameworks)
- Folder structure (Features/, Core/, Services/, Models/, Views/, ViewModels/)

- **Architecture Pattern**:
- Primary pattern (MVC, MVVM, VIPER, TCA/Composable Architecture, Clean Swift, MVP)
- If MVVM: ViewModel implementation (ObservableObject, @Published, Combine publishers)
- If TCA: Store, Reducer, Effect, and Dependency organization
- If VIPER: Module organization (View, Interactor, Presenter, Entity, Router)
- How navigation is handled (Coordinator pattern, NavigationStack, Router)

- **SwiftUI Patterns** (if detected):
- View composition and extraction patterns
- Property wrapper usage (@State, @Binding, @StateObject, @ObservedObject, @EnvironmentObject, @Environment)
- View modifier patterns and custom modifiers
- Preview organization and usage

- **Data Layer**:
- Persistence (Core Data, SwiftData, Realm, UserDefaults, Keychain)
- Networking layer (URLSession, Alamofire, custom networking stack)
- Repository/DataSource pattern implementation
- Codable model organization

- **Dependency Injection**:
- DI approach (constructor injection, Environment, @Dependency from TCA, Swinject, Factory)
- Protocol-oriented programming for abstraction
- Mock/stub patterns for testing

- **Concurrency**:
- Swift Concurrency (async/await, structured concurrency, actors)
- Combine usage for reactive patterns
- MainActor and global actor usage
- Task management and cancellation patterns" : ""}

${(PROJECT_TYPE == "Kotlin" || PROJECT_TYPE == "Auto-detect") ?
"#### Kotlin / Android Architectural Patterns (if detected)
- **Application Structure**:
- UI framework (Jetpack Compose, XML Views, or hybrid)
- Project type (single module vs multi-module)
- Module organization strategy (by feature, by layer, convention plugins)
- Build system (Gradle Kotlin DSL, version catalogs, convention plugins)

- **Architecture Pattern**:
- Primary pattern (MVVM, MVI, MVP, Clean Architecture with use cases)
- If MVVM: ViewModel implementation (AndroidX ViewModel, StateFlow/SharedFlow, LiveData)
- If MVI: Intent/State/Effect cycle, state reducer pattern
- Repository pattern implementation and data source abstraction
- Use case / Interactor layer presence

- **Jetpack Compose Patterns** (if detected):
- Composable organization (screens/, components/, theme/)
- State hoisting patterns
- Side effect handling (LaunchedEffect, SideEffect, DisposableEffect)
- Navigation (Navigation Compose, route definitions, argument passing)
- Theming and design system organization (MaterialTheme, custom design tokens)

- **State Management**:
- StateFlow vs SharedFlow vs LiveData decisions
- UI state class design (sealed classes, data classes)
- One-time events handling (SharedFlow, Channels, Event wrapper)
- SavedStateHandle usage for process death survival

- **Data Layer**:
- Room database patterns (Entity, DAO, Database, migrations)
- Remote data source (Retrofit, Ktor, OkHttp interceptors)
- DataStore vs SharedPreferences
- Model mapping between layers (data model, domain model, UI model)
- Offline-first patterns (if any)

- **Dependency Injection**:
- DI framework (Hilt/Dagger, Koin, manual)
- Module organization (@Module, @InstallIn with Hilt, or Koin modules)
- Scope management (Singleton, ViewModelScoped, ActivityScoped)
- Assisted injection / factory patterns

- **Coroutines Architecture**:
- Coroutine scope management (viewModelScope, lifecycleScope, custom scopes)
- Dispatcher usage conventions
- Flow collection patterns (collectAsState, repeatOnLifecycle)
- Error handling in coroutine chains
- Structured concurrency patterns" : ""}

${(PROJECT_TYPE == "Node.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Node.js Architectural Patterns (if detected)
- Application entry point and bootstrap process (server.js, app.js separation)
- Express/Fastify/Koa/Hono/NestJS middleware pipeline organization
- Route registration and grouping strategy
- ORM and data access approaches (Prisma, Sequelize, TypeORM, Mongoose, Knex, Drizzle)
- API implementation patterns (controllers, route handlers)
- Dependency wiring approach (manual injection, awilix, tsyringe, NestJS DI, or module imports)

- **Response Formatting Layer Detection**:
Examine if the project implements a dedicated response formatting layer (sometimes called views, presenters, serializers, transformers, or formatters):

- Look for files/folders named: views/, presenters/, serializers/, transformers/, formatters/, mappers/ (in the response context)
- Look for patterns like: render(entity), renderMany(entities), toJSON(), serialize(), format(), present()

If detected, document:
- **Pattern Name**: How the project refers to this layer (views, presenters, serializers, etc.)
- **Purpose**: Controlling what data is exposed to the client (field selection, sensitive data removal, computed fields, field renaming)
- **Convention**: The consistent API each formatter exposes (e.g., render/renderMany, serialize/serializeMany)
- **Placement in Flow**: Where it sits in the request/response cycle (e.g., controller calls view before sending response)
- **Architectural Role**: If this is an adaptation of a traditional pattern (e.g., the V in MVC adapted for APIs — shaping JSON responses instead of rendering HTML templates), document this adaptation explicitly so it is not confused with traditional view rendering" : ""}

### 10. Implementation Patterns
${INCLUDES_IMPLEMENTATION_PATTERNS ?
"Document concrete implementation patterns for key architectural components:

- **Interface Design Patterns**:
- Interface segregation approaches
- Abstraction level decisions
- Generic vs. specific interface patterns
- Default implementation patterns

- **Service Implementation Patterns**:
- Service lifetime management
- Service composition patterns
- Operation implementation templates
- Error handling within services

- **Repository Implementation Patterns**:
- Query pattern implementations
- Transaction management
- Concurrency handling
- Bulk operation patterns

- **Controller/API Implementation Patterns**:
- Request handling patterns
- Response formatting approaches
- Parameter validation
- API versioning implementation

- **Domain Model Implementation**:
- Entity implementation patterns
- Value object patterns
- Domain event implementation
- Business rule enforcement" : "Mention that detailed implementation patterns vary across the codebase."}

### 11. Testing Architecture
- Document testing strategies aligned with the architecture
- Identify test boundary patterns (unit, integration, system)
- Map test doubles and mocking approaches
- Document test data strategies
- Note testing tools and frameworks integration

### 12. Deployment Architecture
- Document deployment topology derived from configuration
- Identify environment-specific architectural adaptations
- Map runtime dependency resolution patterns
- Document configuration management across environments
- Identify containerization and orchestration approaches
- Note cloud service integration patterns

### 13. Extension and Evolution Patterns
${FOCUS_ON_EXTENSIBILITY ?
"Provide detailed guidance for extending the architecture:

- **Feature Addition Patterns**:
- How to add new features while preserving architectural integrity
- Where to place new components by type
- Dependency introduction guidelines
- Configuration extension patterns

- **Modification Patterns**:
- How to safely modify existing components
- Strategies for maintaining backward compatibility
- Deprecation patterns
- Migration approaches

- **Integration Patterns**:
- How to integrate new external systems
- Adapter implementation patterns
- Anti-corruption layer patterns
- Service facade implementation" : "Document key extension points in the architecture."}

${INCLUDES_CODE_EXAMPLES ?
"### 14. Architectural Pattern Examples
Extract representative code examples that illustrate key architectural patterns:

- **Layer Separation Examples**:
- Interface definition and implementation separation
- Cross-layer communication patterns
- Dependency injection examples

- **Component Communication Examples**:
- Service invocation patterns
- Event publication and handling
- Message passing implementation

- **Extension Point Examples**:
- Plugin registration and discovery
- Extension interface implementations
- Configuration-driven extension patterns

Include enough context with each example to show the pattern clearly, but keep examples concise and focused on architectural concepts." : ""}

${INCLUDES_DECISION_RECORDS ?
"### 15. Architectural Decision Records
Document key architectural decisions evident in the codebase:

- **Architectural Style Decisions**:
- Why the current architectural pattern was chosen
- Alternatives considered (based on code evolution)
- Constraints that influenced the decision

- **Technology Selection Decisions**:
- Key technology choices and their architectural impact
- Framework selection rationales
- Custom vs. off-the-shelf component decisions

- **Implementation Approach Decisions**:
- Specific implementation patterns chosen
- Standard pattern adaptations
- Performance vs. maintainability tradeoffs

For each decision, note:
- Context that made the decision necessary
- Factors considered in making the decision
- Resulting consequences (positive and negative)
- Future flexibility or limitations introduced" : ""}

### ${INCLUDES_DECISION_RECORDS ? "16" : INCLUDES_CODE_EXAMPLES ? "15" : "14"}. Architecture Governance
- Document how architectural consistency is maintained
- Identify automated checks for architectural compliance
- Note architectural review processes evident in the codebase
- Document architectural documentation practices

### ${INCLUDES_DECISION_RECORDS ? "17" : INCLUDES_CODE_EXAMPLES ? "16" : "15"}. Blueprint for New Development
Create a clear architectural guide for implementing new features:

- **Development Workflow**:
- Starting points for different feature types
- Component creation sequence
- Integration steps with existing architecture
- Testing approach by architectural layer

- **Implementation Templates**:
- Base class/interface templates for key architectural components
- Standard file organization for new components
- Dependency declaration patterns
- Documentation requirements

- **Common Pitfalls**:
- Architecture violations to avoid
- Common architectural mistakes
- Performance considerations
- Testing blind spots

Include information about when this blueprint was generated and recommendations for keeping it updated as the architecture evolves."