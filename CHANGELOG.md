# Changelog

All notable changes to the **Hyperion** kit are documented here.

Format inspired by [Keep a Changelog](https://keepachangelog.com/). Versioning follows [SemVer](https://semver.org/) for kit releases (tags on this repo).

## [Unreleased]

### Fixed
- Docs claimed Azure DevOps / GitLab were forward-only; reverse sync already exists in `sync.mjs` — aligned GETTING-STARTED, pitfalls PT/EN, choose-backend PT/EN, `integration-bridge`, and cards-sync README callout.
- Softened `project.example.yml` header so adopters are not told to “copy the pack and rewrite only this YAML”.

### Added
- README Actions badge for `hyperion-validate`.
- Empty `epics/` and `stories/` card folders (`.gitkeep`) to match documented layout.
- `SUPPORT.md` for adopter help routing.

## [0.1.0] — 2026-08-21

First public-adoption polish on `main`.

### Added
- Community health: Code of Conduct, Security policy, issue/PR templates, CONTRIBUTING updates, good-first issues.
- Brand assets (banner/logo) and navy/blue/amber diagram palette on the docs hub.
- Cards sync: skip EXAMPLE/TEMPLATE/SAMPLE remote issues on reverse sync and issue maps (`is:issue` only).

### Changed
- README as study hub (five areas, skills tables, copy / don’t-copy guidance).
- Skills catalog generator emits branded headers (CI `--check` stable).

[Unreleased]: https://github.com/MatheusFelipeCorrea/Hyperion/commits/main
[0.1.0]: https://github.com/MatheusFelipeCorrea/Hyperion/commits/main

<!-- Cut GitHub Release `v0.1.0` when you publish; then point these anchors at the tag/compare URLs. -->
