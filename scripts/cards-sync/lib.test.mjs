import test from "node:test";
import assert from "node:assert/strict";
import {
  pickBestGitHubProject,
  expandCardIdsWithParents,
  filterEdgesForCards,
  parseOnlyFilter,
  cardIdFromRelativePath,
  isExampleCardId,
  filterExampleSampleCards,
  shouldIncludeExampleCards,
} from "./lib.mjs";

test("pickBestGitHubProject prefers DevForge title", () => {
  const projects = [
    { number: 1, title: "Random Board" },
    { number: 7, title: "myrepo DevForge Project" },
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

test("filterExampleSampleCards skips EXAMPLE-* by default", () => {
  const cards = [
    { cardId: "EXAMPLE-EPIC-001" },
    { cardId: "PROJ-STORY-001" },
  ];
  const result = filterExampleSampleCards(cards, null, { includeExamples: false });
  assert.equal(result.skipped, 1);
  assert.deepEqual(result.cards.map((c) => c.cardId), ["PROJ-STORY-001"]);
});

test("filterExampleSampleCards honors --only EXAMPLE explicit target", () => {
  const cards = [{ cardId: "EXAMPLE-STORY-001" }, { cardId: "PROJ-1" }];
  const result = filterExampleSampleCards(cards, ["EXAMPLE-STORY-001"], { includeExamples: false });
  assert.equal(result.skipped, 0);
  assert.equal(result.cards.length, 2);
});

test("shouldIncludeExampleCards respects flag and env", () => {
  assert.equal(shouldIncludeExampleCards(["node", "sync.mjs", "--include-examples"]), true);
  assert.equal(isExampleCardId("EXAMPLE-EPIC-001"), true);
  assert.equal(isExampleCardId("PROJ-EPIC-001"), false);
});
