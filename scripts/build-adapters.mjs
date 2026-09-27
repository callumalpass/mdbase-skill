#!/usr/bin/env node
// Build the self-contained adapter files from SKILL.md and references/spec.md.
//
//   node scripts/build-adapters.mjs          write adapters/*.md
//   node scripts/build-adapters.mjs --check  fail if any adapter is out of date
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const tools = {
  aider: "Aider",
  amazonq: "Amazon Q",
  gemini: "Gemini Code Assist",
  windsurf: "Windsurf",
};

const skill = readFileSync(resolve(root, "SKILL.md"), "utf8")
  .replace(/^---\n[\s\S]*?\n---\n+/, "")
  .replace(
    /The mdbase v0\.3 reference is in \[references\/spec\.md\]\(references\/spec\.md\)\./,
    "The mdbase v0.3 reference follows these instructions.",
  )
  .trimEnd();
const reference = demoteHeadings(readFileSync(resolve(root, "references/spec.md"), "utf8")).trimEnd();

let stale = false;
for (const [file, tool] of Object.entries(tools)) {
  const content = [
    `# mdbase — Typed Markdown Collections (${tool})`,
    "",
    `> This is a self-contained adapter for ${tool}, generated from SKILL.md and references/spec.md. For native Agent Skills support in other tools, see the main repository.`,
    "",
    skill,
    "",
    "---",
    "",
    reference,
    "",
  ].join("\n");
  const path = resolve(root, "adapters", `${file}.md`);
  if (process.argv.includes("--check")) {
    if (readFileSync(path, "utf8") !== content) {
      console.error(`adapters/${file}.md is out of date; run node scripts/build-adapters.mjs`);
      stale = true;
    }
  } else {
    writeFileSync(path, content);
  }
}
process.exit(stale ? 1 : 0);

/** Nest the reference one heading level below the adapter title. */
function demoteHeadings(markdown) {
  let fenced = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^(```|~~~)/.test(line)) fenced = !fenced;
      return !fenced && /^#{1,5} /.test(line) ? `#${line}` : line;
    })
    .join("\n");
}
