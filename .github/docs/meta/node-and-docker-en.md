# Native Node + Docker (parity)

Hyperion scripts (`doctor`, `sync`, `upgrade`, `*-verify`…) are the kit’s differentiator. Behavior is identical on both runtimes.

| Environment | How to run |
|-------------|------------|
| **Node.js ≥ 20** (preferred) | `npm run hyperion:doctor` or `node scripts/hyperion/cli.mjs doctor` or `./bin/hyperion doctor` |
| **No Node, Docker available** | `./bin/hyperion doctor` (builds `hyperion-cli` once) |

**Português:** [node-and-docker.md](./node-and-docker.md)

---

## Wrapper

```bash
chmod +x bin/hyperion   # once
./bin/hyperion doctor
./bin/hyperion project-verify
./bin/hyperion upgrade -- --yes
./bin/hyperion cards sync
./bin/hyperion --docker doctor
```

Windows: `bin\hyperion doctor`

The image does **not** bake the kit — it mounts your repo and runs `scripts/hyperion/cli.mjs` from the copy you already have.

```bash
npm run hyperion:docker-build
# or: docker build -t hyperion-cli -f Dockerfile .
```

Optional: `HYPERION_DOCKER_IMAGE=my-registry/hyperion-cli`.

---

## CLI (`hyperion <cmd>`)

Same as `npm run hyperion:*` without the prefix:

| Command | npm equivalent |
|---------|----------------|
| `hyperion doctor` | `hyperion:doctor` |
| `hyperion sync` | `hyperion:sync` |
| `hyperion upgrade` | `hyperion:upgrade` |
| `hyperion phase-verify` | `hyperion:phase-verify` |
| `hyperion project-verify` | `hyperion:project-verify` |
| `hyperion review-verify` | `hyperion:review-verify` |
| `hyperion cards sync` | `cards:sync` |
| `npm run hyperion:cli -- doctor` | same as `./bin/hyperion doctor` (when Node present) |

---

## See also

- [definition-of-done.md](./definition-of-done.md)
- [https://github.com/MatheusFelipeCorrea/Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion)
