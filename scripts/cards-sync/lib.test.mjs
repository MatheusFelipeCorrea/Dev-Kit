import test from "node:test";
import assert from "node:assert/strict";
import {
  pickBestGitHubProject,
  expandCardIdsWithParents,
  filterEdgesForCards,
  parseOnlyFilter,
  cardIdFromRelativePath,
  isExampleCardId,
  isKitSampleCardId,
  filterKitSampleCards,
  filterExampleSampleCards,
  shouldIncludeKitSamples,
} from "./lib.mjs";

test("pickBestGitHubProject prefers Dev-Kit title", () => {
  const projects = [
    { number: 1, title: "Random Board" },
    { number: 7, title: "myrepo Dev-Kit Project" },
  ];
  const picked = pickBestGitHubProject(projects, "myrepo");
  assert.equal(picked.number, 7);
});

test("pickBestGitHubProject uses single project when only one exists", () => {
  const projects = [{ number: 3, title: "Solo Project" }];
  assert.equal(pickBestGitHubProject(projects, "repo").number, 3);
});

test("pickBestGitHubProject returns null when ambiguous", () => {
  const projects = [
    { number: 1, title: "A" },
    { number: 2, title: "B" },
  ];
  assert.equal(pickBestGitHubProject(projects, "repo"), null);
});

test("expandCardIdsWithParents includes parent chain", () => {
  const cards = [
    { cardId: "EPIC-1", parent: null },
    { cardId: "STORY-1", parent: "EPIC-1" },
    { cardId: "TASK-1", parent: "STORY-1" },
  ];
  const expanded = expandCardIdsWithParents(cards, ["TASK-1"]);
  assert.deepEqual(expanded.map((c) => c.cardId).sort(), ["EPIC-1", "STORY-1", "TASK-1"]);
});

test("filterEdgesForCards keeps only internal edges", () => {
  const edges = [
    { parentCardId: "A", childCardId: "B" },
    { parentCardId: "B", childCardId: "C" },
  ];
  const filtered = filterEdgesForCards(edges, ["A", "B"]);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].childCardId, "B");
});

test("parseOnlyFilter reads --only argv", () => {
  const ids = parseOnlyFilter(["node", "sync.mjs", "--only", "A-1,B-2"]);
  assert.deepEqual(ids, ["A-1", "B-2"]);
});

test("cardIdFromRelativePath extracts basename", () => {
  assert.equal(cardIdFromRelativePath("stories/PROJ-STORY-001.md"), "PROJ-STORY-001");
});

test("filterKitSampleCards skips EXAMPLE/TEMPLATE/SAMPLE card IDs", () => {
  const cards = [
    { cardId: "EXAMPLE-EPIC-001" },
    { cardId: "TEMPLATE-DRAFT-001" },
    { cardId: "PROJ-STORY-001" },
  ];
  const result = filterKitSampleCards(cards, null, { includeSamples: false });
  assert.equal(result.skipped, 2);
  assert.deepEqual(result.cards.map((c) => c.cardId), ["PROJ-STORY-001"]);
});

test("filterKitSampleCards never syncs samples even with --only EXAMPLE", () => {
  const cards = [{ cardId: "EXAMPLE-STORY-001" }, { cardId: "PROJ-1" }];
  const result = filterKitSampleCards(cards, ["EXAMPLE-STORY-001"], { includeSamples: false });
  assert.equal(result.skipped, 1);
  assert.deepEqual(result.ignoredOnlyTargets, ["EXAMPLE-STORY-001"]);
  assert.deepEqual(result.cards.map((c) => c.cardId), ["PROJ-1"]);
});

test("shouldIncludeKitSamples respects maintainer flag", () => {
  assert.equal(shouldIncludeKitSamples(["node", "sync.mjs", "--include-samples"]), true);
  assert.equal(isKitSampleCardId("SAMPLE-001"), true);
  assert.equal(isKitSampleCardId("PROJ-EPIC-001"), false);
});
