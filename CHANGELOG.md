# Changelog

All notable changes to this project will be documented in this file.

## [0.1.4] - 2026-04-04

### Added

- Added `skills/qimao-publisher/` as a reusable Qimao chapter publishing skill package.
- Added `skills/baidu-publisher/` as a reusable Baidu author platform chapter publishing skill package.
- Added `skills/fanqie-publisher/README.md` with usage guidance for the Fanqie publisher skill.
- Added README entries for the Qimao and Baidu reusable publisher skill packages.

### Notes

- The repository now contains reusable publisher skill packages for Fanqie, Qimao, and Baidu author workflows.
- `qimao-publisher` and `baidu-publisher` mirror the Fanqie skill structure to keep cross-platform task generation consistent.

## [0.1.3] - 2026-04-04

### Added

- Added `examples/playwright-fanqie-publish-example.js` as a Playwright-based Fanqie publishing flow example.
- Added `skills/fanqie-publisher/` as a reusable Fanqie chapter publishing skill package.
- Added `skills/fanqie-publisher/SKILL.md` for task definition and execution rules.
- Added `skills/fanqie-publisher/templates/task-template.txt` for parameterized browser task generation.
- Added `skills/fanqie-publisher/scripts/prepare-task.js` for rendering task files from environment variables.
- Added README entries for the Playwright example and the reusable Fanqie publisher skill.

### Notes

- This release turns the Fanqie browser workflow into a reusable skill structure instead of keeping it only as ad hoc prompt guidance.
- The example script and skill template are intended to support both draft-saving and optional publish flows.

## [0.1.2] - 2026-04-04

### Added

- Added persistent browser profile login guidance to `fanqie-author-publish/README.md`.
- Added login-state handling policy to `fanqie-author-publish/execution-policy.md`.
- Added matching persistent profile login guidance to `qimao-author-publish` and `baidu-author-publish` README files.
- Added matching login-state handling policy to `qimao-author-publish` and `baidu-author-publish` execution policy files.

### Notes

- The project now consistently recommends persistent browser profiles instead of extracting or reusing site cookies.
- Manual login remains the expected workflow for all supported platforms.
- This guidance is aligned across Fanqie, Qimao, and Baidu author platform skill packages.

## [0.1.1] - 2026-04-04

### Added

- Added `qimao-author-publish` as a Fanqie-derived skill skeleton for Qimao author workflows.
- Added `baidu-author-publish` as a Fanqie-derived skill skeleton for Baidu author workflows.
- Added Linux/OpenClaw-aligned manifests, schemas, workflow files, setup scripts, and validation scripts for both new platform packages.
- Expanded `qimao-author-publish/real-site-calibration-checklist.md` into a full first-time calibration checklist.
- Expanded `baidu-author-publish/real-site-calibration-checklist.md` into a full first-time calibration checklist.
- Added multi-platform navigation and derived-skill notes to the main `README.md`.

### Notes

- `fanqie-author-publish` remains the primary template and the most complete reference package.
- `qimao-author-publish` and `baidu-author-publish` are intentionally derived from the Fanqie package structure to accelerate cross-platform expansion.
- Both derived packages still require real-site calibration before production use.

## [0.1.0] - 2026-04-04

### Added

- Initial `fanqie-author-publish` OpenClaw skill package structure for Linux deployments.
- Core skill documentation in `SKILL.md`.
- End-to-end browser execution guide in `browser-workflow.md`.
- Linux-oriented execution rules in `execution-policy.md`.
- Page targeting and selector strategy in `selectors.md`.
- Input validation schema in `input.schema.json`.
- Output result schema in `output.schema.json`.
- Skill metadata manifest in `manifest.json`.
- Single chapter input template in `chapter.template.json`.
- Single chapter example input in `chapter.example.json`.
- Batch chapter input template in `chapters.batch.template.json`.
- Batch chapter example input in `chapters.batch.example.json`.
- Publish log template in `publish-log.template.md`.
- Example log entry in `logs/example-log.md`.
- Real-site calibration checklist in `real-site-calibration-checklist.md`.
- Test coverage plan in `test-cases.md`.
- Linux setup helper script in `setup-linux.sh`.
- Input validation helper script in `validate-input.sh`.
- Persistent placeholder directories for `logs/` and `screenshots/`.
- Project README covering Linux/OpenClaw deployment and workflow.

### Notes

- The package is designed for a human-in-the-loop workflow.
- Manual login is expected in the target browser profile.
- Final publish actions require explicit confirmation.
- Real-site calibration is still required before production use against the Fanqie author backend.
