/// Fluid, mobile-first breakpoint tokens.
///
/// Traceability: RCGLA-034-A02 — "Determine fluid breakpoints" substep.
/// Values follow Google Material Design 3 window-size classes so the grid
/// stays aligned with the rest of the Material component set used across
/// this app.
library;

import 'package:flutter/widgets.dart';

/// The set of window-size classes the grid reacts to, ordered from the
/// narrowest (mobile) to the widest.
enum WindowSizeClass {
  /// < 600 dp — phones in portrait. This is the baseline mobile layout.
  compact,

  /// 600–839 dp — small tablets / phones in landscape.
  medium,

  /// 840–1199 dp — large tablets / foldables unfolded.
  expanded,

  /// 1200–1599 dp — small desktop / large tablet landscape.
  large,

  /// >= 1600 dp — large desktop.
  extraLarge,
}

/// Fluid breakpoint boundaries, in logical pixels (dp).
///
/// Each constant is the *lower* bound of the size class named. A width is
/// "fluid" in the sense that layout code should interpolate/react to width
/// continuously (via [LayoutBuilder]/[MediaQuery]) rather than snapping
/// only at these edges.
class Breakpoints {
  const Breakpoints._();

  static const double compactMin = 0;
  static const double mediumMin = 600;
  static const double expandedMin = 840;
  static const double largeMin = 1200;
  static const double extraLargeMin = 1600;

  /// Resolves the [WindowSizeClass] for a given logical [width].
  static WindowSizeClass classify(double width) {
    if (width >= extraLargeMin) return WindowSizeClass.extraLarge;
    if (width >= largeMin) return WindowSizeClass.large;
    if (width >= expandedMin) return WindowSizeClass.expanded;
    if (width >= mediumMin) return WindowSizeClass.medium;
    return WindowSizeClass.compact;
  }

  /// Convenience accessor from a [BuildContext] using [MediaQuery].
  static WindowSizeClass of(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    return classify(width);
  }

  /// True when [width] falls in the mobile (compact) size class.
  static bool isMobile(double width) => classify(width) == WindowSizeClass.compact;
}
