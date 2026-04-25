---
name: folder-structure-blueprint-generator
description: 'Comprehensive project folder structure blueprint generator that analyzes and documents code organization patterns. Auto-detects project types and architectural patterns, generates detailed blueprints with visualization options, naming conventions, file placement patterns, and extension templates. Supports monorepo detection with per-sub-project folder analysis and cross-project structure documentation. Covers .NET, Java, React, Angular, Vue.js, Svelte, Next.js, Nuxt.js, Node.js, Python, Go, Rust, Ruby on Rails, Flutter, Swift, Kotlin, and infrastructure-as-code projects. References architecture blueprints and code exemplars for consistent guidance.'
---

# Project Folder Structure Blueprint Generator

## Configuration Variables

${PROJECT_TYPE="Auto-detect|.NET|Java|React|Angular|Vue.js|Svelte|Next.js|Nuxt.js|Node.js|Python|Go|Rust|Ruby on Rails|Flutter|Swift|Kotlin|Other"}
<!-- Select primary technology -->

${INCLUDES_MICROSERVICES="Auto-detect|true|false"}
<!-- Is this a microservices architecture? -->

${INCLUDES_FRONTEND="Auto-detect|true|false"}
<!-- Does project include frontend components? -->

${MONOREPO_MODE="Auto-detect|single|per-project|holistic"}
<!-- Monorepo detection and analysis mode -->

${VISUALIZATION_STYLE="ASCII|Markdown List|Table"}
<!-- How to visualize the structure -->

${DEPTH_LEVEL=1-5}
<!-- How many levels of folders to document in detail -->

${INCLUDE_FILE_COUNTS=true|false}
<!-- Include file count statistics -->

${INCLUDE_GENERATED_FOLDERS=true|false}
<!-- Include auto-generated folders -->

${INCLUDE_FILE_PATTERNS=true|false}
<!-- Document file naming/location patterns -->

${INCLUDE_TEMPLATES=true|false}
<!-- Include file/folder templates for new features -->

## Generated Prompt

"Analyze the project's folder structure and create a comprehensive '.github/docs/Project_Folders_Structure_Blueprint.md' document that serves as a definitive guide for maintaining consistent code organization. Use the following approach:

### 0. Repository Structure Detection

${MONOREPO_MODE == "Auto-detect" ? "Before analyzing folder structure, determine the repository structure by examining:
- Whether the root directory contains multiple sub-directories that are independent projects (each with their own package.json, go.mod, .csproj, Cargo.toml, requirements.txt, Gemfile, pubspec.yaml, or similar project manifest files)
- Whether a workspace configuration exists at the root (package.json with workspaces field, pnpm-workspace.yaml, turbo.json, nx.json, lerna.json, Cargo.toml with workspace members)
- Whether a root-level docker-compose.yml or similar orchestration file references multiple service directories
- Whether the root has no source code of its own but only contains sub-project directories

If multiple sub-projects are detected, treat this as a **monorepo** and:

**A. Document Root Structure:**
- Workspace tool in use (npm workspaces, pnpm workspaces, yarn workspaces, turborepo, nx, lerna, cargo workspaces, or none)
- Root-level files and their purposes (package.json, docker-compose.yml, README.md, .gitignore)
- Root-level scripts and how they orchestrate sub-projects
- Whether any root-level configuration applies to all sub-projects (ESLint, Prettier, TypeScript config)

**B. Map All Sub-Projects:**
For each sub-project directory detected, document:
- Directory name and path
- Detected technology stack
- Primary role in the system (backend API, frontend SPA, mobile app, shared library, worker, gateway, etc.)
- Entry point and how to run it

**C. Analyze Each Sub-Project Independently:**
Apply ALL subsequent sections to EACH sub-project as if it were its own project. Clearly separate the analysis under labeled headings:
- Use headings like '## Folder Structure: api/' and '## Folder Structure: web/' to separate each analysis
- Each sub-project gets its own visualization, directory analysis, naming conventions, and templates
- Skip sections that do not apply to a specific sub-project

**D. Cross-Project Structure Patterns:**
After analyzing each sub-project individually, document:
- **Shared Directories**: Any shared/, packages/, libs/, common/ directories and what they contain
- **Parallel Structure**: Whether sub-projects follow similar folder organization patterns (e.g., both have src/, tests/, config/)
- **Environment Alignment**: How .env files across sub-projects relate to each other (e.g., frontend VITE_API_URL must correspond to backend PORT)
- **Infrastructure Directories**: Root-level infra/, deploy/, .github/ directories and their organization
- **File Placement Rules**: When creating a new file, how to determine which sub-project it belongs in

**E. Reference Existing Documentation:**
If .github/docs/Project_Architecture_Blueprint.md exists, use it to understand the architectural context behind the folder organization.
If .github/docs/exemplars.md exists, reference specific exemplar files when documenting what each folder typically contains.

If the repository is NOT a monorepo, skip monorepo-specific sections and proceed with single-project analysis starting from Section 1." : MONOREPO_MODE == "holistic" ? "Treat this repository as a monorepo. Document root structure, map all sub-projects, analyze each independently, then document cross-project structure patterns. Reference Project_Architecture_Blueprint.md and exemplars.md if they exist." : MONOREPO_MODE == "per-project" ? "Analyze only the current directory's folder structure. Note if evidence suggests this project is part of a larger monorepo." : "Analyze the folder structure as a single, standalone project."}

### Initial Auto-detection Phase

${PROJECT_TYPE == "Auto-detect" ?
"Begin by scanning the folder structure for key files that identify the project type:
- Look for solution/project files (.sln, .csproj, .fsproj, .vbproj) to identify .NET projects
- Check for build files (pom.xml, build.gradle, settings.gradle) for Java projects
- Identify package.json with dependencies for JavaScript/TypeScript projects
- Look for specific framework files (angular.json, next.config.js, nuxt.config.ts, svelte.config.js, vite.config.js with react plugin)
- Check for Python project identifiers (requirements.txt, setup.py, pyproject.toml, manage.py for Django, main.py with fastapi imports)
- Look for Go identifiers (go.mod, go.sum, cmd/ directory)
- Look for Rust identifiers (Cargo.toml, src/main.rs or src/lib.rs)
- Look for Ruby on Rails identifiers (Gemfile, config/routes.rb, app/controllers/)
- Examine mobile app identifiers (pubspec.yaml for Flutter, .xcodeproj/.xcworkspace for Swift, build.gradle with android plugin for Kotlin)
- Note all technology signatures found and their versions" :
"Focus analysis on ${PROJECT_TYPE} project structure"}

${INCLUDES_MICROSERVICES == "Auto-detect" ?
"Determine if this is a microservices architecture by looking for:
- Multiple service directories with similar/repeated structures
- Service-specific Dockerfiles or deployment configurations
- Inter-service communication patterns (APIs, message brokers)
- Service registry or discovery configuration
- API gateway configuration files
- Shared libraries or utilities across services" : ""}

${INCLUDES_FRONTEND == "Auto-detect" ?
"Identify frontend components by looking for:
- Web asset directories (wwwroot, public, dist, static)
- UI framework files (components/, pages/, views/, screens/)
- Frontend build configuration (webpack, vite, rollup, metro, etc.)
- Style sheet organization (CSS, SCSS, styled-components, Tailwind)
- Static asset organization (images, fonts, icons)" : ""}

### 1. Structural Overview

Provide a high-level overview of the ${PROJECT_TYPE == "Auto-detect" ? "detected project type(s)" : PROJECT_TYPE} project's organization principles and folder structure:

- Document the overall organizational principle (by feature, by layer, by domain, hybrid)
- Identify the main structural patterns that repeat throughout the codebase
- Document the rationale behind the structure where it can be inferred
- Reference Project_Architecture_Blueprint.md if it exists for architectural context behind folder decisions

### 2. Directory Visualization

${VISUALIZATION_STYLE == "ASCII" ?
"Create an ASCII tree representation of the folder hierarchy to depth level ${DEPTH_LEVEL}. Use the format:
- 📁 for directories
- 📄 for key files
- Add a brief purpose comment after each directory" : ""}

${VISUALIZATION_STYLE == "Markdown List" ?
"Use nested markdown lists to represent the folder hierarchy to depth level ${DEPTH_LEVEL}. Add a brief purpose description after each item." : ""}

${VISUALIZATION_STYLE == "Table" ?
"Create a table with columns for Path, Purpose, Content Types, Key Files, and Conventions." : ""}

${INCLUDE_GENERATED_FOLDERS ?
"Include all folders including generated ones, but clearly mark generated folders (e.g., node_modules/, bin/, obj/, dist/, build/, .next/, .nuxt/, __pycache__, target/)." :
"Exclude auto-generated folders like bin/, obj/, node_modules/, dist/, build/, .next/, .nuxt/, __pycache__, target/, etc. Note their existence but do not detail their contents."}

### 3. Key Directory Analysis

Document each significant directory's purpose, contents, and patterns:

${PROJECT_TYPE == "Auto-detect" ?
"For each detected technology, analyze directory structures based on observed usage patterns:" : ""}

${(PROJECT_TYPE == ".NET" || PROJECT_TYPE == "Auto-detect") ?
"#### .NET Project Structure (if detected)

- **Solution Organization**:
- How projects are grouped and related within the .sln
- Solution folder organization patterns
- Multi-targeting project patterns

- **Project Organization**:
- Internal folder structure of each .csproj
- Source code organization approach (by layer, by feature)
- Resource and static file organization

- **Layer Organization**:
- Controllers/ or Endpoints/ — API surface
- Services/ — business logic
- Repositories/ or Data/ — data access
- Models/ or Domain/ or Entities/ — domain objects
- DTOs/ or ViewModels/ — data transfer objects
- Middleware/ — request pipeline components
- Extensions/ — extension method organization
- Configuration/ or Settings/ — app configuration

- **Test Project Organization**:
- Test project structure and naming (*.Tests, *.UnitTests, *.IntegrationTests)
- Test folder structure mirroring source structure
- Test data, fixtures, and mock locations" : ""}

${(PROJECT_TYPE == "Java" || PROJECT_TYPE == "Auto-detect") ?
"#### Java Project Structure (if detected)

- **Package Hierarchy**:
- Root package naming convention
- Package organization strategy (by layer, by feature, by domain)
- Package visibility and access patterns

- **Layer Organization**:
- controller/ or resource/ or api/ — REST endpoints
- service/ or usecase/ — business logic
- repository/ or dao/ — data access
- model/ or entity/ or domain/ — domain objects
- dto/ or request/ + response/ — transfer objects
- config/ or configuration/ — Spring/framework configuration
- exception/ — custom exception hierarchy
- mapper/ — object mapping (MapStruct, ModelMapper)
- filter/ or interceptor/ — request filters

- **Build Tool Organization**:
- Maven module structure (pom.xml hierarchy) or Gradle module structure
- Resource folder organization (src/main/resources/, application.yml, profiles)
- Test resource organization (src/test/resources/)

- **Test Organization**:
- Test class location mirroring source packages
- Test categories (unit/, integration/, e2e/)
- Test utilities, factories, fixtures location" : ""}

${(PROJECT_TYPE == "React" || PROJECT_TYPE == "Auto-detect") ?
"#### React Project Structure (if detected)

- **Source Organization** (src/ folder):
- Entry point files (main.jsx/tsx, App.jsx/tsx, index.html)
- Top-level folder organization strategy

- **Component Organization**:
- components/ folder structure:
  - Whether organized by ui/ (generic) vs shared/ (business) vs feature-specific
  - Whether each component has its own folder (Component/index.jsx, Component.test.jsx, Component.module.css)
  - Or flat file structure (Component.jsx alongside siblings)
- pages/ or views/ — page-level components
- layouts/ — layout wrapper components

- **State Management Organization** (detect which solution is in use):
- If Zustand: store/ or slices/ folder — document how slice files are organized
- If Redux/RTK: store/, slices/, selectors/, middleware/ — document the full Redux folder structure
- If RTK Query: where API slice definitions live
- If TanStack Query: queries/ or hooks/ folder — document how query hooks are organized
- If Context: contexts/ folder organization
- Document the separation between client state folders and server state folders

- **Data Layer Organization**:
- services/ — API call functions (one file per domain entity or one per feature)
- queries/ — TanStack Query / SWR hooks (if separate from services)
- hooks/ — custom hooks (separated from queries or mixed)

- **Routing Organization**:
- routes/ folder structure (index.jsx, PrivateRoute, PublicRoute, AdminRoute)
- How route definitions map to pages/ folder

- **Utility Organization**:
- utils/ — pure utility functions
- constants/ — static values
- schemas/ — Zod/Yup validation schemas (if in frontend)
- assets/ — images, icons, fonts
- styles/ — global CSS, variables, Tailwind config" : ""}

${(PROJECT_TYPE == "Angular" || PROJECT_TYPE == "Auto-detect") ?
"#### Angular Project Structure (if detected)

- **Module Organization**:
- Whether using NgModules or standalone components
- Feature module organization (each feature in its own folder with module, routing, components, services)
- Shared module structure (shared components, pipes, directives)
- Core module structure (singleton services, guards, interceptors)

- **Component Organization**:
- Smart (container) vs dumb (presentational) component separation
- Component folder structure (component.ts, component.html, component.scss, component.spec.ts)

- **Service Organization**:
- services/ folder — where injectable services live
- guards/ — route guards
- interceptors/ — HTTP interceptors
- resolvers/ — route resolvers
- pipes/ — custom pipes
- directives/ — custom directives

- **State Management Organization** (detect what is used):
- If NgRx: store/ with actions/, reducers/, effects/, selectors/ subfolders
- If NGXS: state/ folder organization
- If Akita: state/ folder organization
- If service-based: how BehaviorSubject services are organized

- **Asset and Style Organization**:
- assets/ folder structure
- environments/ folder (environment.ts, environment.prod.ts)
- styles/ folder (global styles, themes, variables)" : ""}

${(PROJECT_TYPE == "Vue.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Vue.js Project Structure (if detected)

- **Source Organization**:
- Entry point (main.js/ts, App.vue)
- Top-level src/ folder organization

- **Component Organization**:
- components/ — reusable components (potentially split by ui/ and shared/)
- views/ or pages/ — page-level components
- layouts/ — layout wrapper components

- **State Management Organization**:
- If Pinia: stores/ folder — one file per store or feature-grouped
- If Vuex: store/ with modules/ subfolder
- If neither: how reactive composables or provide/inject are organized

- **Composable Organization** (Vue 3):
- composables/ or hooks/ folder
- Naming conventions (use*.js/ts)
- How composables are grouped (by feature, by concern)

- **Data Layer Organization**:
- services/ or api/ — HTTP client wrappers
- How API modules map to backend resources

- **Routing**:
- router/ folder — route definitions, guards, middleware

- **Utility Organization**:
- utils/, constants/, assets/, styles/ folder patterns" : ""}

${(PROJECT_TYPE == "Svelte" || PROJECT_TYPE == "Auto-detect") ?
"#### Svelte / SvelteKit Project Structure (if detected)

- **Route Organization** (SvelteKit file-based routing):
- routes/ folder — +page.svelte, +layout.svelte, +page.js, +page.server.js, +server.js, +error.svelte organization
- Route group folders and naming patterns
- How nested layouts are organized

- **Component Organization**:
- lib/components/ — reusable components
- lib/server/ — server-only utilities
- Component naming and folder conventions

- **State Organization**:
- lib/stores/ — Svelte store files (writable, readable, derived)
- How stores are grouped and named

- **Data Layer**:
- Where load functions fetch data
- lib/services/ or lib/api/ — if a service layer exists
- How form actions are organized

- **Static Assets**:
- static/ folder organization" : ""}

${(PROJECT_TYPE == "Next.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Next.js Project Structure (if detected)

- **Router Detection** (App Router vs Pages Router):
- If App Router (app/ directory):
  - Route segment organization (folders = routes)
  - layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx placement per route
  - Route groups ((group)/) for organization without URL impact
  - API route handlers (app/api/**/route.ts) organization
  - Server actions file organization
- If Pages Router (pages/ directory):
  - Page file organization
  - pages/api/ folder structure
  - _app.tsx, _document.tsx, _error.tsx placement

- **Component Organization**:
- components/ — where reusable components live (separate from routes)
- Whether components are organized by ui/, shared/, feature-specific/
- Server Components vs Client Components folder separation (if any)

- **Data and State Organization**:
- lib/ or utils/ — shared utilities, server functions, database clients
- hooks/ — custom client-side hooks
- services/ — API client functions (if client-side fetching is used)
- Apply React state management folder patterns (Zustand, Redux, TanStack Query)

- **Configuration and Assets**:
- public/ folder organization
- middleware.ts placement
- next.config.js and environment files" : ""}

${(PROJECT_TYPE == "Nuxt.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Nuxt.js Project Structure (if detected)

- **Convention-Based Directories** (Nuxt auto-scans these):
- pages/ — file-based routing organization
- components/ — auto-imported component organization
- composables/ — auto-imported composable organization
- layouts/ — layout component organization
- middleware/ — route middleware organization
- plugins/ — plugin file organization
- server/ — server-side code:
  - server/api/ — API route organization
  - server/routes/ — non-API server routes
  - server/middleware/ — server middleware
  - server/utils/ — server utilities
  - server/plugins/ — Nitro plugins

- **State Organization**:
- stores/ — Pinia store files (if @pinia/nuxt is used)
- How useState composables are organized

- **Asset Organization**:
- assets/ — processed assets (images, styles, fonts)
- public/ — static assets served as-is

- **Configuration**:
- nuxt.config.ts organization
- app.config.ts for runtime config
- Environment files" : ""}

${(PROJECT_TYPE == "Node.js" || PROJECT_TYPE == "Auto-detect") ?
"#### Node.js Backend Project Structure (if detected)

- **Entry Point Organization**:
- server.js / app.js separation pattern
- How the application bootstraps (middleware registration, route mounting, error handler registration)

- **Layer Folder Organization** (document each folder's purpose and file patterns):
- **routes/** — Route definition files
  - File naming pattern (auth.routes.js, fazenda.routes.js)
  - index.js aggregation pattern (if routes are collected in one place)
  - How middleware is applied per-route
- **controllers/** — Request handlers
  - File naming pattern (auth.controller.js)
  - One controller per domain entity or per feature
- **services/** — Business logic
  - File naming pattern (auth.service.js)
  - What lives here vs what lives in controllers or repositories
- **repositories/** — Data access
  - File naming pattern (auth.repository.js)
  - How they wrap ORM calls (Prisma, Sequelize, Mongoose, etc.)
- **models/** — Data structure definitions
  - Whether models are separate from ORM schema or the ORM schema IS the model
  - File naming pattern
- **views/** or **presenters/** or **serializers/** (if response formatting layer exists):
  - File naming pattern (fazenda.view.js)
  - render/renderMany convention
- **middlewares/** — Express/Fastify middleware
  - auth.middleware.js, error.middleware.js, validator.middleware.js patterns
  - Middleware registration order documentation
- **schemas/** — Input validation schemas
  - File naming pattern (auth.schema.js)
  - Validation library used (Zod, Joi, Yup)
- **jobs/** or **workers/** or **queues/** — Background tasks
  - File naming pattern (lembretes.job.js)
  - How jobs are registered and scheduled

- **Supporting Folder Organization**:
- **config/** — Application configuration (env validation, CORS, database config)
- **database/** — Database client, seeds, migrations
  - prisma/ folder (schema.prisma, migrations/)
  - Or sequelize/, mongoose/ equivalent
- **shared/** or **common/** — Cross-cutting utilities
  - errors/ — Custom error classes (AppError)
  - utils/ — Logger, JWT, bcrypt, and other utilities

- **Test Organization**:
- tests/ or __tests__/ or src/tests/
- unit/ vs integration/ vs e2e/ subfolder separation
- Test file naming (*.spec.js, *.test.js)
- Test setup files (setup.js, globalSetup.js)
- How test file location maps to source file location" : ""}

${(PROJECT_TYPE == "Python" || PROJECT_TYPE == "Auto-detect") ?
"#### Python Project Structure (if detected)

- **Framework-Specific Structure**:
- If Django:
  - Project folder (settings.py, urls.py, wsgi.py, asgi.py)
  - App folder pattern (models.py, views.py, serializers.py, urls.py, admin.py, signals.py, tests.py per app)
  - manage.py placement
  - templates/ and static/ organization
  - migrations/ per app
- If FastAPI:
  - Main application file (main.py) and router mounting
  - routers/ or api/ folder — endpoint organization
  - models/ or schemas/ — Pydantic model organization
  - services/ — business logic
  - repositories/ or crud/ — data access
  - core/ or config/ — settings, dependencies, security
  - dependencies/ — Depends injection functions
- If Flask:
  - Application factory (create_app) location
  - blueprints/ folder organization
  - models/, views/, forms/, templates/ per blueprint or centralized

- **Package Organization**:
- __init__.py patterns and what they export
- How packages are nested (by feature, by layer)
- Import conventions within packages

- **Supporting Directories**:
- tests/ — test organization (mirrors source structure or flat)
- migrations/ or alembic/ — database migrations
- scripts/ — utility scripts
- config/ or settings/ — configuration files
- requirements/ — split requirements (base.txt, dev.txt, prod.txt) or single requirements.txt
- pyproject.toml organization (if using Poetry/modern tools)" : ""}

${(PROJECT_TYPE == "Go" || PROJECT_TYPE == "Auto-detect") ?
"#### Go Project Structure (if detected)

- **Standard Layout Detection**:
- Whether following golang-standards/project-layout or a custom structure
- cmd/ — main applications (one folder per binary)
- internal/ — private application code not importable by other projects
- pkg/ — public library code importable by external projects (if used)
- Or flat structure with main.go at root

- **Internal Organization** (within internal/ or root):
- Organization strategy (by feature, by layer, by domain)
- handler/ or api/ — HTTP handlers
- service/ — business logic
- repository/ or store/ — data access
- model/ or entity/ or domain/ — data structures
- middleware/ — HTTP middleware
- config/ — configuration structs and loading
- pkg/ or util/ — shared utilities

- **Supporting Directories**:
- migrations/ — database migrations (golang-migrate, goose, atlas)
- scripts/ — build and utility scripts
- deploy/ or infra/ — deployment configurations
- docs/ — documentation
- testdata/ — test fixtures and data files
- vendor/ — vendored dependencies (if used)

- **Test Organization**:
- *_test.go files co-located with source (Go convention)
- testdata/ folders for test fixtures
- integration/ or e2e/ for non-unit tests (if separated)" : ""}

${(PROJECT_TYPE == "Rust" || PROJECT_TYPE == "Auto-detect") ?
"#### Rust Project Structure (if detected)

- **Workspace Organization** (if multi-crate):
- Cargo.toml workspace members
- How crates are organized (by service, by library, by feature)
- Shared crates (common/, shared/)

- **Crate Internal Structure**:
- src/main.rs (binary) vs src/lib.rs (library) entry points
- Module organization (mod.rs vs file-per-module)
- How modules map to architectural layers:
  - handlers/ or routes/ or api/ — request handlers
  - services/ — business logic
  - repositories/ or db/ — data access
  - models/ or domain/ — data structures
  - middleware/ or layers/ — tower/actix middleware
  - config/ — configuration
  - error/ or errors/ — custom error types

- **Supporting Directories**:
- migrations/ — database migrations
- tests/ — integration tests (separate from unit tests in src/)
- benches/ — benchmarks
- examples/ — usage examples" : ""}

${(PROJECT_TYPE == "Ruby on Rails" || PROJECT_TYPE == "Auto-detect") ?
"#### Ruby on Rails Project Structure (if detected)

- **Standard Rails Directory Organization**:
- app/ — main application code:
  - app/controllers/ — controller organization (one per resource, concerns/ subfolder)
  - app/models/ — ActiveRecord model organization (concerns/ subfolder)
  - app/views/ — view templates per controller (if not API-only)
  - app/services/ or app/interactors/ — service objects (if present beyond standard MVC)
  - app/serializers/ or app/blueprints/ or app/presenters/ — API response formatting
  - app/jobs/ — background job classes
  - app/mailers/ — email classes
  - app/channels/ — Action Cable channels (if real-time)
  - app/helpers/ — view helpers
  - app/assets/ or app/javascript/ — frontend assets
- config/ — application configuration (routes.rb, database.yml, initializers/)
- db/ — database schema, migrations, seeds
- lib/ — custom libraries, tasks, extensions
- spec/ or test/ — test organization mirroring app/ structure

- **Non-Standard Additions** (detect if present):
- app/queries/ — query objects
- app/forms/ — form objects
- app/policies/ — authorization policies (Pundit)
- app/decorators/ — object decorators
- app/validators/ — custom validators" : ""}

${(PROJECT_TYPE == "Flutter" || PROJECT_TYPE == "Auto-detect") ?
"#### Flutter / Dart Project Structure (if detected)

- **Organization Strategy Detection**:
- Feature-first: lib/features/feature_name/ (with data/, domain/, presentation/ per feature)
- Layer-first: lib/data/, lib/domain/, lib/presentation/
- Simple: lib/models/, lib/services/, lib/screens/, lib/widgets/

- **Common Folder Patterns**:
- lib/core/ or lib/common/ — shared utilities, constants, theme, extensions
- lib/models/ or lib/entities/ — data structures
- lib/services/ or lib/repositories/ — data access and business logic
- lib/screens/ or lib/pages/ or lib/views/ — page-level widgets
- lib/widgets/ or lib/components/ — reusable widgets
- lib/providers/ or lib/blocs/ or lib/controllers/ — state management (depends on solution)
- lib/routes/ or lib/navigation/ — route definitions
- lib/di/ or lib/injection/ — dependency injection setup
- lib/l10n/ — localization files

- **Supporting Directories**:
- test/ — test files mirroring lib/ structure
- assets/ — images, fonts, icons
- android/, ios/, web/, macos/, linux/, windows/ — platform-specific code
- integration_test/ — integration/E2E tests" : ""}

${(PROJECT_TYPE == "Swift" || PROJECT_TYPE == "Auto-detect") ?
"#### Swift / iOS Project Structure (if detected)

- **Xcode Organization**:
- How Xcode groups map to file system folders
- Target organization (main app, extensions, frameworks, test targets)
- SPM package organization (if local packages are used)

- **Source Organization** (detect pattern):
- Feature-based: Features/FeatureName/ (View, ViewModel, Model per feature)
- Layer-based: Views/, ViewModels/, Models/, Services/
- Common patterns:
  - Core/ or Common/ — shared utilities, extensions, protocols
  - Models/ — data models, Codable structs
  - Services/ or Networking/ — API clients, network layer
  - Views/ or Screens/ — SwiftUI views or UIKit view controllers
  - ViewModels/ — ObservableObject classes (if MVVM)
  - Resources/ — assets, localization, Info.plist
  - Navigation/ or Coordinators/ — navigation logic
  - DI/ or Dependencies/ — dependency injection setup
  - TCA pattern: Features/ with Reducer, State, Action per feature

- **Supporting Directories**:
- Tests/ or ProjectTests/ — unit tests
- UITests/ or ProjectUITests/ — UI tests
- Preview Content/ — SwiftUI preview assets" : ""}

${(PROJECT_TYPE == "Kotlin" || PROJECT_TYPE == "Auto-detect") ?
"#### Kotlin / Android Project Structure (if detected)

- **Module Organization**:
- Single module vs multi-module project
- If multi-module: feature modules, data modules, domain modules, core modules, app module
- build.gradle.kts or build.gradle per module
- buildSrc/ or build-logic/ for convention plugins (if used)
- Version catalog (libs.versions.toml) placement

- **Source Organization** (within each module):
- Package hierarchy under src/main/java/ or src/main/kotlin/
- Organization by feature or by layer:
  - ui/ or presentation/ — screens, components, ViewModels
  - data/ — repositories, data sources (local + remote), models, mappers
  - domain/ — use cases, domain models, repository interfaces
  - di/ — Hilt modules or Koin modules
  - navigation/ — navigation graph, route definitions
  - util/ or common/ or core/ — extensions, constants, utilities

- **Resource Organization**:
- res/layout/ — XML layouts (if not Compose-only)
- res/values/ — strings, dimensions, colors, themes, styles
- res/drawable/ and res/mipmap/ — images and icons
- res/navigation/ — navigation graphs (if Navigation Component)

- **Test Organization**:
- src/test/ — unit tests
- src/androidTest/ — instrumented tests
- Test file naming mirroring source files" : ""}

### 4. File Placement Patterns

${INCLUDE_FILE_PATTERNS ?
"Document the patterns that determine where different types of files should be placed. For each file type, provide the EXACT path pattern based on observed codebase conventions:

- **Configuration Files**:
- Root-level configs (.env, .gitignore, eslint, prettier, tsconfig, etc.) — list actual files found
- Framework-specific config file locations
- Environment-specific configuration patterns

- **Model/Entity Definitions**:
- Where domain models are defined (exact folder path)
- Data transfer object (DTO) locations (if separate from models)
- Schema definition locations (ORM schemas, validation schemas)

- **Business Logic**:
- Service implementation locations (exact folder path and naming pattern)
- Where business rules are enforced
- Utility and helper function placement

- **API Layer**:
- Controller or handler file locations
- Route definition locations
- API documentation file placement

- **Response Formatting** (if a formatting layer exists):
- View/serializer/presenter file locations
- How formatter files map to model/entity names

- **Middleware / Interceptors / Guards**:
- Where middleware files are placed
- Naming conventions for different middleware types

- **Validation Schemas**:
- Where input validation schemas are defined
- How schema files map to routes or models

- **Background Tasks**:
- Where cron jobs, workers, or queue consumers are placed
- Job file naming patterns

- **External Integration Wrappers**:
- Where external API wrapper services are placed
- How they are named and organized

- **Test Files**:
- Unit test location patterns (relative to source files)
- Integration test placement
- Test utility, mock, and fixture locations
- Test setup and configuration file locations

- **Documentation Files**:
- API documentation placement
- Internal documentation organization
- README file distribution across folders" :
"Document where key file types are located in the project, providing exact folder paths observed in the codebase."}

### 5. Naming and Organization Conventions

Document the naming and organizational conventions observed across the project:

- **File Naming Patterns**:
- Case conventions (PascalCase, camelCase, kebab-case, snake_case) — document per file type
- Suffix patterns (*.controller.js, *.service.js, *.spec.js, *.test.ts, *_test.go, etc.)
- Prefix patterns if any (use*.js for hooks, I*.cs for interfaces, etc.)
- Index file conventions (index.js barrel exports, mod.rs, __init__.py)

- **Folder Naming Patterns**:
- Case conventions for folders
- Singular vs plural conventions (model/ vs models/, service/ vs services/)
- Hierarchical naming patterns

- **Namespace/Module/Package Patterns**:
- How namespaces/modules/packages map to folder structure
- Import/using/require statement organization conventions (import order, grouping)
- Internal vs public API separation patterns

- **Organizational Patterns**:
- Co-location strategies (tests next to source, styles next to components, or separated)
- Feature encapsulation (all feature files in one folder vs spread across layer folders)
- Cross-cutting concern organization (where shared errors, utils, types, constants live)

### 6. Navigation and Development Workflow

Provide guidance for navigating and working with the codebase structure:

- **Entry Points**:
- Main application entry points (server.js, main.jsx, main.py, main.go, main.rs, etc.)
- Key configuration starting points
- Initial files for understanding the project

- **Common Development Tasks** — for each task, provide the exact path:
- Adding a new feature: which folders need new files and in what order
- Adding a new API endpoint: route file → controller → service → repository → model → test
- Adding a new UI page: page component → route registration → data fetching → state (if needed)
- Adding a new background job: job file → registration → shared service access
- Adding a new external integration: wrapper service → config → error mapping
- Adding tests: where to place unit tests, integration tests, and what to name them

- **Dependency Flow**:
- How dependencies flow between folders (routes → controllers → services → repositories)
- Import/reference patterns (what can import from what)
- Circular dependency prevention patterns
- Dependency injection registration locations

${INCLUDE_FILE_COUNTS ?
"- **Content Statistics**:
- Number of files per directory
- Code distribution across main directories
- Largest directories and complexity concentration areas" : ""}

### 7. Build and Output Organization

Document the build process and output organization:

- **Build Configuration**:
- Build script locations and purposes (package.json scripts, Makefile, build.gradle tasks)
- Build tool configuration files (vite.config, webpack.config, tsconfig, Cargo.toml build config)

- **Output Structure**:
- Compiled/built output locations (dist/, build/, out/, bin/, target/)
- How output structure maps to source structure
- Distribution package structure

- **Environment-Specific Builds**:
- Development vs production build differences
- Environment variable files (.env, .env.development, .env.production)
- Build variant organization

### 8. Infrastructure and Deployment Structure

Document infrastructure-related folder organization if present:

- **Docker**:
- Dockerfile locations (root, per service, per sub-project)
- docker-compose.yml organization
- .dockerignore patterns

- **CI/CD**:
- .github/workflows/ — GitHub Actions organization
- .gitlab-ci.yml, Jenkinsfile, .circleci/ — other CI tool configurations
- Pipeline script organization

- **Infrastructure as Code** (if present):
- terraform/, infra/, deploy/ folder organization
- Kubernetes manifests (k8s/, manifests/) organization
- Helm chart structure (Chart.yaml, templates/, values/)

- **Database**:
- Migration file locations and naming patterns
- Seed data file locations
- Database configuration and schema file locations

### 9. Extension and Evolution

Document how the project structure is designed to be extended:

- **Adding New Modules/Features**:
- Step-by-step folder creation guide for a new feature
- Which existing feature's structure to use as a reference (reference exemplars.md if available)
- Checklist of folders/files that need to be created or modified

- **Scalability Patterns**:
- How the structure scales for larger features
- When to split a folder into subfolders
- When to extract shared code into a separate package/module

- **Refactoring Patterns**:
- Common refactoring approaches observed in the codebase
- How to move files between folders safely (update imports, tests)

${INCLUDE_TEMPLATES ?
"### 10. Structure Templates

Provide copy-paste templates for creating new components that follow project conventions. For each template, show the exact folder/file structure to create:

- **New Feature Template**:
- Complete folder structure for adding a new feature
- All required files with their naming patterns
- Registration/integration points (where to add routes, where to register in DI, etc.)

- **New API Endpoint Template** (for backend projects):
- Route file addition
- Controller file creation
- Service file creation
- Repository file creation (if needed)
- Schema/validation file creation
- View/serializer file creation (if formatting layer exists)
- Test file creation (unit + integration)

- **New UI Page Template** (for frontend projects):
- Page component file creation
- Route registration
- Data fetching hook/service creation
- State additions (if needed)
- Test file creation

- **New Background Job Template** (if jobs exist):
- Job file creation
- Registration in scheduler
- Shared service access pattern

- **New External Integration Template** (if integrations exist):
- Wrapper service file creation
- Environment variable addition
- Error mapping setup

- **New Test Structure Template**:
- Unit test file creation (with proper naming and location)
- Integration test file creation
- Test setup and mock file creation" : ""}

### ${INCLUDE_TEMPLATES ? "11" : "10"}. Structure Enforcement

Document how the project structure is maintained and enforced:

- **Automated Enforcement**:
- ESLint/linting rules related to import paths and file organization
- Build checks that validate structure
- Pre-commit hooks that enforce conventions
- CI checks for structural compliance

- **Manual Enforcement**:
- Code review checklist items related to file placement
- Documentation requirements for new folders
- Team conventions not enforced by tooling

- **Reference Documents**:
- This document (Project_Folders_Structure_Blueprint.md)
- .github/docs/Project_Architecture_Blueprint.md for architectural context
- .github/docs/exemplars.md for code quality reference per folder

Include a section at the end noting when this blueprint was generated and recommendations for keeping it updated as the structure evolves."