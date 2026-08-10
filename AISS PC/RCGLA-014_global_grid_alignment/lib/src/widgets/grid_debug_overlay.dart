import 'package:flutter/widgets.dart';

import '../tokens/breakpoints.dart';
import '../tokens/grid_tokens.dart';

/// Paints faint column/gutter guides on top of [child] so a developer can
/// visually confirm every widget snaps to the grid.
///
/// Traceability: RCGLA-034-A02 — "Mistake-Proofing (Poka-Yoke)" decision:
/// "Design tool physically locks elements to the mobile grid, preventing
/// misalignment." This overlay is the runtime equivalent of that check —
/// wrap a screen in it during development to spot drift at a glance.
///
/// Not intended for release builds; gate it behind a debug flag.
class GridDebugOverlay extends StatelessWidget {
  const GridDebugOverlay({
    super.key,
    required this.child,
    this.lineColor = const Color(0x33FF0000),
  });

  final Widget child;
  final Color lineColor;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        Positioned.fill(
          child: IgnorePointer(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final sizeClass = Breakpoints.classify(constraints.maxWidth);
                final columns = GridTokens.columnsFor(sizeClass);
                final gutter = GridTokens.gutterFor(sizeClass);
                final margin = GridTokens.marginFor(sizeClass);

                return CustomPaint(
                  size: Size(constraints.maxWidth, constraints.maxHeight),
                  painter: _GridPainter(
                    columns: columns,
                    gutter: gutter,
                    margin: margin,
                    color: lineColor,
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _GridPainter extends CustomPainter {
  _GridPainter({
    required this.columns,
    required this.gutter,
    required this.margin,
    required this.color,
  });

  final int columns;
  final double gutter;
  final double margin;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final usable = size.width - margin * 2 - gutter * (columns - 1);
    final columnWidth = usable / columns;

    var x = margin;
    for (var i = 0; i < columns; i++) {
      canvas.drawRect(Rect.fromLTWH(x, 0, columnWidth, size.height), paint);
      x += columnWidth + gutter;
    }
  }

  @override
  bool shouldRepaint(covariant _GridPainter oldDelegate) {
    return oldDelegate.columns != columns ||
        oldDelegate.gutter != gutter ||
        oldDelegate.margin != margin ||
        oldDelegate.color != color;
  }
}
