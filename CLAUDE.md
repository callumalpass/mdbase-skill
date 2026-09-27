# mdbase-skill development

This repository contains the **mdbase** Agent Skill. The skill itself is defined in `SKILL.md` with its specification in `references/spec.md`.

When making changes to this repo:

- `SKILL.md` — Agent Skills entry point; keep under 500 lines
- `references/spec.md` — Condensed mdbase v0.3 reference; the normative spec lives in the mdbase-spec repository
- `adapters/` — Self-contained files for tools without Agent Skills support, generated from `SKILL.md` and `references/spec.md`
- After changing `SKILL.md` or `references/spec.md`, run `node scripts/build-adapters.mjs`; `--check` verifies the adapters are current
