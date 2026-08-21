FROM node:22-bookworm-slim

# Hyperion CLI runtime — kit scripts come from the mounted host repo (/workspace).
# Native Node on the host is preferred; this image is parity when Node is missing.

RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Optional GitHub CLI (cards sync / upgrade tip). Soft-fail if install changes.
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      > /etc/apt/sources.list.d/github-cli.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends gh \
  && rm -rf /var/lib/apt/lists/* \
  || true

WORKDIR /workspace
ENTRYPOINT ["node", "scripts/hyperion/cli.mjs"]
CMD ["help"]
