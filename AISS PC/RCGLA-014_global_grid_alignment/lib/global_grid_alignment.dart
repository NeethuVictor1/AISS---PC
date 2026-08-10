/// Global Grid Alignment — mobile-first responsive grid system.
///
/// Implements ticket RCGLA-034-A02 ("Define Global Grid Alignment Rules"):
///   1. Mobile 4-column constraints          -> [GridTokens], [ResponsiveGrid]
///   2. Standard 8px gutters                 -> [SpacingTokens], [GridTokens]
///   3. Locked mobile max-width               -> [GridContainer]
///   4. Fluid breakpoints                     -> [Breakpoints], [WindowSizeClass]
///
/// Import this single file to get the whole public API:
/// ```dart
/// import 'package:global_grid_alignment/global_grid_alignment.dart';
/// ```
library global_grid_alignment;

export 'src/tokens/breakpoints.dart';
export 'src/tokens/grid_tokens.dart';
export 'src/tokens/spacing_tokens.dart';
export 'src/widgets/grid_container.dart';
export 'src/widgets/grid_debug_overlay.dart';
export 'src/widgets/responsive_grid.dart';
