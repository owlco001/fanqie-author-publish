# Changelog

All notable changes to this project will be documented in this file.

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
