# Traceability — RCGLA-034-A02

Source: `RCGLA-034_-_PC_-060826.xlsx`, Setup Step "Define Global Grid Alignment Rules."

| Substep (from ticket) | Implementation |
|---|---|
| 1. Set mobile 4-column constraints | `lib/src/tokens/grid_tokens.dart` — `GridTokens.columnsByClass[WindowSizeClass.compact] == 4` |
| 2. Define standard 8px gutters | `lib/src/tokens/spacing_tokens.dart` (`SpacingTokens.sm == 8.0`), consumed by `GridTokens.gutterByClass` |
| 3. Lock mobile max-width | `lib/src/widgets/grid_container.dart` — `GridContainer` (no cap on compact, capped on medium+) |
| 4. Determine fluid breakpoints | `lib/src/tokens/breakpoints.dart` — `Breakpoints` / `WindowSizeClass` |

## Microstep mapping (M1–M4)

| Microstep | Where it lands in this repo |
|---|---|
| M1 — Clone/pull frontend repo on design-system branch | N/A (repo operation, not code) — see `README.md` "Getting the code into your repo" |
| M2 — Locate config file(s) defining grid/spacing tokens | This package *is* the config: `lib/src/tokens/` |
| M3 — Open file(s), confirm branch/write access | N/A (repo operation) |
| M4 — Cross-check against the 4 required items, ≥90% coverage | `test/grid_tokens_test.dart` codifies all 4 items as automated checks (100% coverage of the 4 items) |

## Decision log

- **Breakpoints** follow Material Design 3 window-size classes (compact/medium/expanded/large/extra-large) per the ticket's "Google Material Design Decision" columns, rather than inventing a bespoke scale.
- **Mobile max-width** resolves to `null` (no cap) at compact width, matching the ticket's UX translation: "Prioritizes limited screen real estate by stacking elements vertically" — mobile content should never be shrunk to an arbitrary cap.
- **Column spans** on `GridItem` are always expressed against the 4-column mobile baseline and scaled up for wider classes, so screen authors keep thinking mobile-first even when the app later runs on tablet/desktop.
