import 'package:flutter/widgets.dart';

import '../tokens/breakpoints.dart';
import '../tokens/grid_tokens.dart';

/// Wraps [child] with the correct max-width lock and outer screen margin
/// for the current [WindowSizeClass].
///
/// Traceability: RCGLA-034-A02 — "Lock mobile max-width" substep.
///
/// On mobile (compact) the content simply fills the available width (no
/// artificial cap); on wider classes it is centered and capped so lines of
/// text/content don't stretch edge-to-edge.
class GridContainer extends StatelessWidget {
  const GridContainer({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final sizeClass = Breakpoints.classify(constraints.maxWidth);
        final maxWidth = GridTokens.maxWidthFor(sizeClass);
        final margin = GridTokens.marginFor(sizeClass);

        final padded = Padding(
          padding: EdgeInsets.symmetric(horizontal: margin),
          child: child,
        );

        if (maxWidth == null) {
          // Mobile: no cap, content is locked to the device width itself.
          return padded;
        }

        return Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: maxWidth),
            child: padded,
          ),
        );
      },
    );
  }
}
