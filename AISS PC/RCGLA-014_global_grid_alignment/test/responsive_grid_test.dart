import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:global_grid_alignment/global_grid_alignment.dart';

void main() {
  Widget wrap(Widget child, {double width = 375}) {
    return MaterialApp(
      home: MediaQuery(
        data: MediaQueryData(size: Size(width, 800)),
        child: SizedBox(width: width, child: child),
      ),
    );
  }

  testWidgets('renders all grid items on a mobile-width viewport', (tester) async {
    await tester.pumpWidget(
      wrap(
        ResponsiveGrid(
          items: const [
            GridItem(child: ColoredBox(color: Colors.red, child: SizedBox(height: 40)), columnSpan: 2),
            GridItem(child: ColoredBox(color: Colors.blue, child: SizedBox(height: 40)), columnSpan: 2),
            GridItem(child: ColoredBox(color: Colors.green, child: SizedBox(height: 40)), columnSpan: 4),
          ],
        ),
        width: 375, // iPhone-class compact width -> 4 columns
      ),
    );

    expect(find.byType(ColoredBox), findsNWidgets(3));
  });

  testWidgets('a full-width (4-span) item spans the available grid width', (tester) async {
    const width = 400.0;
    await tester.pumpWidget(
      wrap(
        ResponsiveGrid(
          lockMaxWidth: false,
          items: const [
            GridItem(child: SizedBox(height: 10), columnSpan: 4),
          ],
        ),
        width: width,
      ),
    );

    final size = tester.getSize(find.byType(SizedBox).first);
    // Full-span item should occupy (close to) the full available width.
    expect(size.width, closeTo(width, 1));
  });

  testWidgets('GridContainer removes the max-width cap on mobile widths', (tester) async {
    await tester.pumpWidget(
      wrap(
        const GridContainer(child: SizedBox(height: 10)),
        width: 360,
      ),
    );

    expect(find.byType(ConstrainedBox), findsNothing);
  });

  testWidgets('GridContainer applies a max-width cap on medium+ widths', (tester) async {
    await tester.pumpWidget(
      wrap(
        const GridContainer(child: SizedBox(height: 10)),
        width: 900,
      ),
    );

    expect(find.byType(ConstrainedBox), findsOneWidget);
  });
}
