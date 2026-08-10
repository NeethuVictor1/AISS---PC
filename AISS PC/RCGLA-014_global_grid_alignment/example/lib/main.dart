import 'package:flutter/material.dart';
import 'package:global_grid_alignment/global_grid_alignment.dart';

void main() => runApp(const GridDemoApp());

class GridDemoApp extends StatelessWidget {
  const GridDemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Global Grid Alignment Demo',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      home: const GridDemoScreen(),
    );
  }
}

class GridDemoScreen extends StatefulWidget {
  const GridDemoScreen({super.key});

  @override
  State<GridDemoScreen> createState() => _GridDemoScreenState();
}

class _GridDemoScreenState extends State<GridDemoScreen> {
  bool _showDebugOverlay = true;

  @override
  Widget build(BuildContext context) {
    final content = SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: SpacingTokens.lg),
        child: ResponsiveGrid(
          items: [
            GridItem(columnSpan: 4, child: _tile('Header (4/4)', Colors.indigo)),
            GridItem(columnSpan: 2, child: _tile('Card A (2/4)', Colors.teal)),
            GridItem(columnSpan: 2, child: _tile('Card B (2/4)', Colors.orange)),
            GridItem(columnSpan: 1, child: _tile('1/4', Colors.purple)),
            GridItem(columnSpan: 1, child: _tile('1/4', Colors.purple)),
            GridItem(columnSpan: 1, child: _tile('1/4', Colors.purple)),
            GridItem(columnSpan: 1, child: _tile('1/4', Colors.purple)),
            GridItem(columnSpan: 4, child: _tile('Footer (4/4)', Colors.indigo)),
          ],
        ),
      ),
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('RCGLA-034-A02 — Global Grid Alignment'),
        actions: [
          IconButton(
            tooltip: 'Toggle grid overlay',
            icon: Icon(_showDebugOverlay ? Icons.grid_off : Icons.grid_on),
            onPressed: () => setState(() => _showDebugOverlay = !_showDebugOverlay),
          ),
        ],
      ),
      body: _showDebugOverlay ? GridDebugOverlay(child: content) : content,
    );
  }

  Widget _tile(String label, Color color) {
    return Container(
      height: 72,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
    );
  }
}
