# Changelog

## 1.0.0

Initial release. Implements RCGLA-034-A02 "Define Global Grid Alignment Rules":

- `Breakpoints` / `WindowSizeClass` — fluid, mobile-first breakpoints (compact/medium/expanded/large/extraLarge).
- `SpacingTokens` — 8dp baseline spacing scale.
- `GridTokens` — column count, gutter, margin, and max-width per size class (mobile fixed at 4 columns).
- `ResponsiveGrid` / `GridItem` — column-span based responsive grid widget.
- `GridContainer` — locks mobile max-width, caps content width on larger screens.
- `GridDebugOverlay` — visual QA overlay for grid alignment (Poka-Yoke aid).
