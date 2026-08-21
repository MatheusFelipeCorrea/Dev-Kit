# Security Policy

## Supported versions

Security fixes are applied on the **`main`** branch of [Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion).

| Branch | Supported |
|--------|-----------|
| `main` | Yes |
| Other feature branches | No (merge to `main` first) |

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

1. Prefer [GitHub Private Vulnerability Reporting](https://github.com/MatheusFelipeCorrea/Hyperion/security/advisories/new) if enabled for this repository.
2. Otherwise contact the maintainer privately via GitHub: [@MatheusFelipeCorrea](https://github.com/MatheusFelipeCorrea).

Include:

- Description of the issue and impact
- Steps to reproduce (PoC if possible)
- Affected files/scripts (e.g. `scripts/cards-sync`, workflows)

You should receive an acknowledgment within a few days. We will coordinate a fix and public disclosure when appropriate.

## Scope

In scope: kit scripts (`scripts/hyperion`, `scripts/cards-sync`), GitHub Actions workflows shipped with the kit, and documented defaults that could leak secrets or weaken consumer repos.

Out of scope: vulnerabilities in third-party tools the kit *invokes* (e.g. `gh`, Docker, board APIs) unless Hyperion mishandles credentials or tokens.
