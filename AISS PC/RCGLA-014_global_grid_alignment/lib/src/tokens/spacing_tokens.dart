/// Spacing tokens built on an 8dp baseline grid.
///
/// Traceability: RCGLA-034-A02 — "Define standard 8px gutters" substep.
/// Every value here is a multiple of [SpacingTokens.baseUnit] so spacing
/// stays predictable across every screen (see "Predictable rhythm for
/// high-speed mobile data entry" in the ticket's rationale).
library;

class SpacingTokens {
  const SpacingTokens._();

  /// The single source of truth for the grid rhythm. Do not hardcode
  /// raw pixel values elsewhere — multiply this instead.
  static const double baseUnit = 8.0;

  /// 4dp — half-step, reserved for icon-to-label gaps and dense rows.
  static const double xs = baseUnit * 0.5;

  /// 8dp — the standard gutter between grid columns/cards.
  static const double sm = baseUnit;

  /// 16dp — default screen margin / section padding.
  static const double md = baseUnit * 2;

  /// 24dp — spacing between distinct content groups.
  static const double lg = baseUnit * 3;

  /// 32dp — spacing above/below major sections.
  static const double xl = baseUnit * 4;

  /// 48dp — spacing around page-level headers.
  static const double xxl = baseUnit * 6;
}
