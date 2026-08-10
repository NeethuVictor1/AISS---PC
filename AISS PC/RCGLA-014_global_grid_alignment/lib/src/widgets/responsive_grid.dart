import 'package:flutter/widgets.dart';

import '../tokens/breakpoints.dart';
import '../tokens/grid_tokens.dart';
import 'grid_container.dart';

/// A single item placed on the [ResponsiveGrid].
///
/// [columnSpan] is expressed in the *compact* (mobile, 4-column) grid, so
/// authors always think in terms of the mobile-first baseline. The widget
/// scales the span proportionally on wider size classes.
class GridItem {
  const GridItem({required this.child, this.columnSpan = 1});

  final Widget child;

  /// How many of the 4 mobile columns this item occupies (1–4).
  final int columnSpan;
}

/// Renders [items] on a responsive column grid that snaps every widget to
/// predefined mobile grid zones.
///
/// Traceability: RCGLA-034-A02
///   - "Set mobile 4-column constraints" (base layout is 4 columns)
///   - "Define standard 8px gutters" (spacing between cells)
///   - "Determine fluid breakpoints" (column count grows on wider classes)
///
/// This is the base layer every screen in the app should build on top of,
/// per the ticket's "Base layer for every screen globally" rationale.
class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({
    super.key,
    required this.items,
    this.lockMaxWidth = true,
  });

  final List<GridItem> items;

  /// When true (default), wraps the grid in [GridContainer] so mobile
  /// content is never stretched and wider layouts get a readable max-width.
  final bool lockMaxWidth;

  @override
  Widget build(BuildContext context) {
    final grid = LayoutBuilder(
      builder: (context, constraints) {
        final sizeClass = Breakpoints.classify(constraints.maxWidth);
        final totalColumns = GridTokens.columnsFor(sizeClass);
        final gutter = GridTokens.gutterFor(sizeClass);

        // Mobile-first spans are defined against 4 columns; scale them up
        // proportionally for wider size classes so a "2-of-4" item stays
        // roughly half-width everywhere.
        final scale = totalColumns / 4;

        return Wrap(
          spacing: gutter,
          runSpacing: gutter,
          children: [
            for (final item in items)
              _GridCell(
                totalColumns: totalColumns,
                span: (item.columnSpan * scale).round().clamp(1, totalColumns),
                gutter: gutter,
                maxWidth: constraints.maxWidth,
                child: item.child,
              ),
          ],
        );
      },
    );

    return lockMaxWidth ? GridContainer(child: grid) : grid;
  }
}

class _GridCell extends StatelessWidget {
  const _GridCell({
    required this.totalColumns,
    required this.span,
    required this.gutter,
    required this.maxWidth,
    required this.child,
  });

  final int totalColumns;
  final int span;
  final double gutter;
  final double maxWidth;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final totalGutter = gutter * (totalColumns - 1);
    final columnWidth = (maxWidth - totalGutter) / totalColumns;
    final width = columnWidth * span + gutter * (span - 1);

    return SizedBox(width: width, child: child);
  }
}
