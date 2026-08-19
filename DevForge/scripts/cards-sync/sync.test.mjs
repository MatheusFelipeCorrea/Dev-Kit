import test from "node:test";
import assert from "node:assert/strict";
import {
  parseFrontmatter,
  parseCardFile,
  parseSubIssueIds,
  buildEdges,
  resolveMappedOptionValue,
  buildOptionCandidates,
  pickSingleSelectOption,
  pickJiraTransition,
  buildJiraDescription,
  parseSyncMetadataFromDescription,
  parseIssueSummaryTypeTitle,
  jiraIssueToCardMarkdown,
  jiraRequest,
  graphql,
} from "./sync.mjs";

test("parseFrontmatter reads scalar and array values", () => {
  const content = `---
card_id: EXAMPLE-1
title: "Example"
story_points: 3
categories:
  - Backend
  - Frontend
---

# Body
`;
  const parsed = parseFrontmatter(content);
  assert.ok(parsed);
  assert.equal(parsed.meta.card_id, "EXAMPLE-1");
  assert.equal(parsed.meta.story_points, 3);
  assert.deepEqual(parsed.meta.categories, ["Backend", "Frontend"]);
});

test("parseCardFile extracts canonical card structure", () => {
  const content = `---
card_id: EXAMPLE-2
title: "Story title"
type: Story
priority: High
status: Backlog
story_points: 5
parent: EXAMPLE-1
---

# Story title
`;
  const card = parseCardFile(content, ".github/cards/stories/EXAMPLE-2.md");
  assert.ok(card);
  assert.equal(card.cardId, "EXAMPLE-2");
  assert.equal(card.storyPoints, 5);
  assert.equal(card.parent, "EXAMPLE-1");
});

test("parseSubIssueIds reads bullet IDs under Sub-issues section", () => {
  const body = `
## Sub-issues
- EXAMPLE-CHILD-1
- EXAMPLE-CHILD-2

## Another section
`;
  const ids = parseSubIssueIds(body);
  assert.deepEqual(ids, ["EXAMPLE-CHILD-1", "EXAMPLE-CHILD-2"]);
});

test("buildEdges merges parent field and body sub-issues without duplicates", () => {
  const cards = [
    { cardId: "PARENT", parent: null, body: "## Sub-issues\n- CHILD-2\n" },
    { cardId: "CHILD-1", parent: "PARENT", body: "" },
    { cardId: "CHILD-2", parent: "PARENT", body: "" },
  ];

  const edges = buildEdges(cards);
  assert.equal(edges.length, 2);
  assert.deepEqual(
    edges.map((e) => `${e.parentCardId}->${e.childCardId}`).sort(),
    ["PARENT->CHILD-1", "PARENT->CHILD-2"]
  );
});

test("resolveMappedOptionValue prefers optionMapByLocale then optionMap", () => {
  const repoConfig = {
    locale: "pt-BR",
    optionMapByLocale: {
      "pt-BR": {
        priority: { Highest: "Crítica" },
      },
    },
    optionMap: {
      priority: { Highest: "Critical" },
    },
  };

  assert.equal(resolveMappedOptionValue("priority", "Highest", repoConfig), "Crítica");
});

test("buildOptionCandidates includes aliases with accent-insensitive matching", () => {
  const repoConfig = {
    locale: "pt-BR",
    optionMapByLocale: {
      "pt-BR": {
        status: { "In Revision": "Em Revisão" },
      },
    },
  };

  const candidates = buildOptionCandidates("status", "In Revision", repoConfig);
  const normalized = candidates.map((value) =>
    String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  );
  assert.ok(normalized.includes("in revision"));
  assert.ok(normalized.includes("em revisao"));
});

test("pickSingleSelectOption matches mapped value on project options", () => {
  const field = {
    options: [
      { id: "1", name: "Backlog" },
      { id: "2", name: "Em Revisão" },
    ],
  };
  const repoConfig = {
    locale: "pt-BR",
    optionMapByLocale: { "pt-BR": { status: { "In Revision": "Em Revisão" } } },
  };

  const selected = pickSingleSelectOption(field, "In Revision", { fieldKey: "status", repoConfig });
  assert.equal(selected, "2");
});

test("buildJiraDescription encodes SYNC_METADATA block", () => {
  const card = {
    body: "Hello world",
    cardId: "PROJ-1",
    relativeFile: ".github/cards/epics/PROJ-1.md",
    parent: null,
    type: "Epic",
    status: "Backlog",
    priority: "Highest",
    sprint: null,
    storyPoints: 3,
    reporter: null,
    dueDate: null,
    categories: ["Backend", "Frontend"],
  };

  const desc = buildJiraDescription(card);
  assert.ok(desc.includes("<!-- SYNC_METADATA"));
  assert.ok(desc.includes("CARD_ID: PROJ-1"));
  assert.ok(desc.includes("CATEGORIES: Backend, Frontend"));
});

test("parseSyncMetadataFromDescription extracts meta and body", () => {
  const description = [
    "BODY TEXT",
    "",
    "---",
    "<!-- SYNC_METADATA — do not edit below this line -->",
    "CARD_ID: PROJ-1",
    "SOURCE_FILE: .github/cards/epics/PROJ-1.md",
    "TYPE: Epic",
    "STATUS: Backlog",
    "PRIORITY: Highest",
    "SPRINT: ",
    "STORY_POINTS: 3",
    "REPORTER: ",
    "PARENT_CARD_ID: ",
    "DUE_DATE: ",
    "CATEGORIES: Backend, Frontend",
    "<!-- /SYNC_METADATA -->",
  ].join("\n");

  const parsed = parseSyncMetadataFromDescription(description);
  assert.ok(parsed);
  assert.equal(parsed.meta.CARD_ID, "PROJ-1");
  assert.equal(parsed.bodyContent, "BODY TEXT");
});

test("parseIssueSummaryTypeTitle parses [Type] Title", () => {
  const parsed = parseIssueSummaryTypeTitle("[Epic] Login flow");
  assert.equal(parsed.type, "Epic");
  assert.equal(parsed.title, "Login flow");
});

test("jiraIssueToCardMarkdown converts issue fields into local card markdown", () => {
  const issue = {
    fields: {
      summary: "[Epic] Login flow",
      labels: ["Backend", "Frontend"],
      description: [
        "BODY TEXT",
        "",
        "---",
        "<!-- SYNC_METADATA — do not edit below this line -->",
        "CARD_ID: PROJ-EPIC-001",
        "SOURCE_FILE: .github/cards/epics/PROJ-EPIC-001.md",
        "TYPE: Epic",
        "STATUS: Backlog",
        "PRIORITY: Highest",
        "SPRINT: ",
        "STORY_POINTS: 5",
        "REPORTER: ",
        "PARENT_CARD_ID: ",
        "DUE_DATE: ",
        "CATEGORIES: Backend, Frontend",
        "<!-- /SYNC_METADATA -->",
      ].join("\n"),
    },
  };

  const converted = jiraIssueToCardMarkdown(issue);
  assert.ok(converted);
  assert.equal(converted.sourceFile, ".github/cards/epics/PROJ-EPIC-001.md");
  assert.ok(converted.markdown.includes("card_id: \"PROJ-EPIC-001\""));
  assert.ok(converted.markdown.includes("status: \"Backlog\""));
  assert.ok(converted.markdown.includes("type: \"Epic\""));
  assert.ok(converted.markdown.includes("story_points: 5"));
  assert.ok(converted.markdown.includes("# BODY TEXT") === false); // bodyContent is raw; markdown should include it at end
  assert.ok(converted.markdown.trimEnd().endsWith("BODY TEXT"));
});

test("jiraRequest attaches Basic auth and parses JSON", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url, options) => {
      const auth = options?.headers?.Authorization || "";
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        text: async () => JSON.stringify({ received: url, auth: auth }),
      };
    };

    const management = {
      jiraUrl: "https://example.atlassian.net",
      jiraEmail: "user@example.com",
      jiraApiToken: "API_TOKEN",
    };

    const payload = await jiraRequest(management, "/rest/api/2/project/PROJ");
    assert.ok(payload.received.includes("/rest/api/2/project/PROJ"));
    assert.ok(String(payload.auth).startsWith("Basic "));
  } finally {
    global.fetch = originalFetch;
  }
});

test("graphql sends headers and returns payload.data (mocked fetch)", async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url, options) => {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ data: { hello: "world" } }),
      };
    };

    const data = await graphql("query($x:Int!){ __typename }", { x: 1 });
    assert.deepEqual(data, { hello: "world" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("pickJiraTransition matches canonical and localized status names", () => {
  const transitions = [
    { id: "1", name: "Start Progress", to: { name: "In Progress" } },
    { id: "2", name: "Done", to: { name: "Done" } },
    { id: "3", name: "Concluir", to: { name: "Concluído" } },
  ];
  const repoConfig = {
    locale: "pt-BR",
    optionMapByLocale: {
      "pt-BR": {
        status: {
          Done: "Concluído",
          "In Progress": "Em Progresso",
        },
      },
    },
  };

  const inProgress = pickJiraTransition(transitions, "In Progress", repoConfig);
  assert.equal(inProgress?.id, "1");

  const donePt = pickJiraTransition(transitions, "Done", repoConfig);
  assert.equal(donePt?.id, "3");

  const missing = pickJiraTransition(transitions, "Backlog", repoConfig);
  assert.equal(missing, null);
});
