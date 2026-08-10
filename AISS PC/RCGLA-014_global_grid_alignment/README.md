# global_grid_alignment

Mobile-first responsive grid system for Flutter, implementing ticket **RCGLA-034-A02 — "Define Global Grid Alignment Rules"**:

1. Mobile 4-column constraints
2. Standard 8px gutters
3. Locked mobile max-width
4. Fluid breakpoints

This is the base layout layer every screen in the app is meant to build on top of.

## What's in this repo

```
global_grid_alignment/
├── lib/
│   ├── global_grid_alignment.dart      # public API barrel file
│   └── src/
│       ├── tokens/
│       │   ├── breakpoints.dart        # WindowSizeClass + fluid breakpoints
│       │   ├── grid_tokens.dart        # columns / gutter / margin / max-width per class
│       │   └── spacing_tokens.dart     # 8dp baseline spacing scale
│       └── widgets/
│           ├── grid_container.dart     # locks mobile max-width
│           ├── responsive_grid.dart    # the 4-column responsive grid
│           └── grid_debug_overlay.dart # visual QA overlay
├── example/                            # runnable demo app
├── test/                               # unit + widget tests
├── docs/RCGLA-034-A02-traceability.md  # ticket -> code mapping
└── .github/workflows/ci.yaml           # flutter analyze + test on push/PR
```

## Usage

```dart
import 'package:global_grid_alignment/global_grid_alignment.dart';

ResponsiveGrid(
  items: [
    GridItem(columnSpan: 4, child: Header()),
    GridItem(columnSpan: 2, child: CardA()),
    GridItem(columnSpan: 2, child: CardB()),
  ],
);
```

Wrap any screen in `GridDebugOverlay` during development to visually confirm every widget snaps to the grid:

```dart
GridDebugOverlay(child: MyScreen());
```

## Running the demo

```bash
cd example
flutter pub get
flutter run
```

## Running tests

```bash
flutter pub get
flutter test
```

## Getting this code into your GitHub repository

This folder is already laid out as a standalone repo (it includes `.gitignore` and a GitHub Actions workflow). To publish it:

```bash
cd global_grid_alignment
git init
git add .
git commit -m "Add global grid alignment system (RCGLA-034-A02)"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

Or, if you're adding it into an **existing** frontend repo (per microstep M1/M2 in the ticket — pulling the design-system branch and locating the token config files), copy the `lib/`, `test/`, and `docs/` contents into your existing package instead of `git init`-ing a new repo.

## Traceability

See [`docs/RCGLA-034-A02-traceability.md`](docs/RCGLA-034-A02-traceability.md) for the full mapping from each ticket substep/microstep to the code that implements it.

## Requirements

- Flutter >= 3.19
- Dart SDK >= 3.3.0
