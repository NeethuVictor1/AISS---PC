# Core Models — Master Interface Schema & Data Contract Directory

This repository (or subfolder, if merged into an existing monorepo) is the
**single source of structural truth** referenced in:

> Implementation Step 35: Anchor Mobile End Document (ED) UI Layout (EDEBS-032)
> Atomic Step EDEBS-032-A01 — "Open the master interface schema and data
> contract directory within the repository."

It satisfies the three microsteps defined for that atomic step:

| Microstep | What it does | Where |
|---|---|---|
| M1 — Locate schema/data-contract directory | `schemas/ed/` holds the ED Pydantic model | `schemas/ed/` |
| M2 — Open & validate the master ED schema file | `schemas/ed/ed_model.py` | `schemas/ed/ed_model.py` |
| M3 — Validate against BigQuery Native Table Schema + CDE restrictions | `scripts/validate_ed_schema.py` | `scripts/validate_ed_schema.py` |

## Directory layout

```
core-models/
├── README.md
├── schemas/
│   └── ed/
│       ├── __init__.py
│       ├── ed_model.py          # Pydantic model = source of truth
│       └── bigquery_schema.json # Mirrors the Pydantic model 1:1 for BigQuery native table enforcement
├── scripts/
│   └── validate_ed_schema.py    # CI/CD gate: CDE omission + type-mismatch check
└── tests/
    └── test_ed_model.py
```

## Usage

```bash
git clone <your-repo-url>
cd core-models
pip install -r requirements.txt   # pydantic, google-cloud-bigquery (optional)
python scripts/validate_ed_schema.py
```

A `Pass` result from `validate_ed_schema.py` is the Definition-of-Done gate
for M3 — it mirrors the exact check BigQuery streaming enforcement performs
in production, so failures here should be treated as CI/CD blockers.

## Customizing the ED fields

The field set in `ed_model.py` is a placeholder skeleton (id, type, status,
timestamps, a nested `metadata` block). Replace it with your actual
End Document (ED) Critical Data Elements (CDEs) — the model docstrings show
exactly where nested-structure bounds, null-condition rules, and
type-casting schemas should be tightened.
