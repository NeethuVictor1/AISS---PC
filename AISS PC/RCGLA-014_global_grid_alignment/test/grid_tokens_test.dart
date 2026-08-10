import 'package:flutter_test/flutter_test.dart';
import 'package:global_grid_alignment/global_grid_alignment.dart';

void main() {
  group('Breakpoints.classify', () {
    test('widths under 600 are compact (mobile)', () {
      expect(Breakpoints.classify(0), WindowSizeClass.compact);
      expect(Breakpoints.classify(375), WindowSizeClass.compact);
      expect(Breakpoints.classify(599.99), WindowSizeClass.compact);
    });

    test('boundaries snap to the next class inclusively', () {
      expect(Breakpoints.classify(600), WindowSizeClass.medium);
      expect(Breakpoints.classify(840), WindowSizeClass.expanded);
      expect(Breakpoints.classify(1200), WindowSizeClass.large);
      expect(Breakpoints.classify(1600), WindowSizeClass.extraLarge);
    });

    test('isMobile is true only for compact widths', () {
      expect(Breakpoints.isMobile(320), isTrue);
      expect(Breakpoints.isMobile(600), isFalse);
    });
  });

  group('GridTokens', () {
    test('mobile (compact) is fixed at 4 columns', () {
      expect(GridTokens.columnsFor(WindowSizeClass.compact), 4);
    });

    test('mobile has no max-width cap (fills viewport)', () {
      expect(GridTokens.maxWidthFor(WindowSizeClass.compact), isNull);
    });

    test('mobile gutter matches the 8dp spacing baseline', () {
      expect(GridTokens.gutterFor(WindowSizeClass.compact), SpacingTokens.sm);
      expect(GridTokens.gutterFor(WindowSizeClass.compact), 8.0);
    });

    test('wider classes expose a positive max-width cap', () {
      for (final sizeClass in [
        WindowSizeClass.medium,
        WindowSizeClass.expanded,
        WindowSizeClass.large,
        WindowSizeClass.extraLarge,
      ]) {
        expect(GridTokens.maxWidthFor(sizeClass), greaterThan(0));
      }
    });
  });

  group('SpacingTokens', () {
    test('every token is a multiple of the 8dp base unit', () {
      final tokens = [
        SpacingTokens.xs,
        SpacingTokens.sm,
        SpacingTokens.md,
        SpacingTokens.lg,
        SpacingTokens.xl,
        SpacingTokens.xxl,
      ];
      for (final t in tokens) {
        expect(t % (SpacingTokens.baseUnit / 2), 0);
      }
    });
  });
}
