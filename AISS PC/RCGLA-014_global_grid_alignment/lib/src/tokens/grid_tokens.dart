/// Grid structure tokens: column counts and content max-width per
/// [WindowSizeClass].
///
/// Traceability: RCGLA-034-A02 — "Set mobile 4-column constraints" and
/// "Lock mobile max-width" substeps.
library;

import 'breakpoints.dart';
import 'spacing_tokens.dart';

class GridTokens {
  const GridTokens._();

  /// Column count per size class. Mobile (compact) is fixed at 4 columns
  /// per the ticket's baseline requirement; wider classes scale up so the
  /// same grid math keeps working as the app grows beyond phones.
  static const Map<WindowSizeClass, int> columnsByClass = {
    WindowSizeClass.compact: 4,
    WindowSizeClass.medium: 8,
    WindowSizeClass.expanded: 12,
    WindowSizeClass.large: 12,
    WindowSizeClass.extraLarge: 12,
  };

  /// Content max-width per size class, in logical pixels. On compact
  /// (mobile) this locks content to the viewport itself — i.e. mobile
  /// content is never artificially widened — while larger classes cap
  /// line length for readability.
  static const Map<WindowSizeClass, double?> maxWidthByClass = {
    WindowSizeClass.compact: null, // null = fill the viewport width
    WindowSizeClass.medium: 720,
    WindowSizeClass.expanded: 960,
    WindowSizeClass.large: 1140,
    WindowSizeClass.extraLarge: 1320,
  };

  /// Gutter (space between columns) per size class. Mobile uses the
  /// standard 8dp baseline gutter from [SpacingTokens.sm].
  static const Map<WindowSizeClass, double> gutterByClass = {
    WindowSizeClass.compact: SpacingTokens.sm, // 8dp
    WindowSizeClass.medium: SpacingTokens.md, // 16dp
    WindowSizeClass.expanded: SpacingTokens.md,
    WindowSizeClass.large: SpacingTokens.md,
    WindowSizeClass.extraLarge: SpacingTokens.md,
  };

  /// Outer screen margin per size class.
  static const Map<WindowSizeClass, double> marginByClass = {
    WindowSizeClass.compact: SpacingTokens.md, // 16dp
    WindowSizeClass.medium: SpacingTokens.lg,
    WindowSizeClass.expanded: SpacingTokens.xl,
    WindowSizeClass.large: SpacingTokens.xl,
    WindowSizeClass.extraLarge: SpacingTokens.xl,
  };

  static int columnsFor(WindowSizeClass sizeClass) => columnsByClass[sizeClass]!;

  static double? maxWidthFor(WindowSizeClass sizeClass) => maxWidthByClass[sizeClass];

  static double gutterFor(WindowSizeClass sizeClass) => gutterByClass[sizeClass]!;

  static double marginFor(WindowSizeClass sizeClass) => marginByClass[sizeClass]!;
}
