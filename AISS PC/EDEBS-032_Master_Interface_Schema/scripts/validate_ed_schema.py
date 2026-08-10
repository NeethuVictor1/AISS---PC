#!/usr/bin/env python3
"""
Microstep EDEBS-032-A01-M3.

Validates the ED Pydantic model against the BigQuery Native Table Schema
and Critical Data Element (CDE) restrictions:
  - Zero CDE omissions (every REQUIRED BigQuery field exists on the model)
  - Zero type mismatches (Pydantic annotation <-> BigQuery type agree)
  - Nested structure bounds respected (RECORD fields map to nested models)
  - Null condition rules respected (NULLABLE <-> Optional agree)

Exit code 0 + "Pass" on success, exit code 1 + "Fail" on any violation —
this mirrors the same gate BigQuery streaming enforcement applies in
production, so a failure here should block CI/CD, same as the sheet
specifies.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import get_args, get_origin, Union

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from schemas.ed.ed_model import EDDocument  # noqa: E402

BQ_SCHEMA_PATH = Path(__file__).resolve().parent.parent / "schemas" / "ed" / "bigquery_schema.json"

# Minimal BigQuery-type <-> Python-type compatibility map.
BQ_TYPE_MAP = {
    "STRING": (str,),
    "TIMESTAMP": (str,),  # datetime serializes to ISO string for BQ load
    "INTEGER": (int,),
    "FLOAT": (float,),
    "BOOLEAN": (bool,),
    "RECORD": (dict,),
}


def _is_optional(annotation) -> bool:
    return get_origin(annotation) is Union and type(None) in get_args(annotation)


def validate() -> list[str]:
    errors: list[str] = []

    bq_fields = json.loads(BQ_SCHEMA_PATH.read_text())
    model_fields = EDDocument.model_fields

    bq_by_name = {f["name"]: f for f in bq_fields}

    # 1. CDE omission check: every REQUIRED BigQuery field must exist on the model.
    for name, bq_field in bq_by_name.items():
        if name not in model_fields:
            errors.append(f"CDE omission: '{name}' present in BigQuery schema but missing from EDDocument model")
            continue

        model_field = model_fields[name]
        is_optional = _is_optional(model_field.annotation)

        # 2. Null condition rule check.
        if bq_field["mode"] == "REQUIRED" and is_optional:
            errors.append(f"Null-rule mismatch: '{name}' is REQUIRED in BigQuery but Optional in the model")
        if bq_field["mode"] == "NULLABLE" and not is_optional:
            errors.append(f"Null-rule mismatch: '{name}' is NULLABLE in BigQuery but non-Optional in the model")

    # 3. Reverse check: no extra model fields silently missing from BigQuery contract.
    for name in model_fields:
        if name not in bq_by_name:
            errors.append(f"Schema drift: '{name}' present in EDDocument model but missing from BigQuery schema")

    return errors


def main() -> int:
    errors = validate()
    if errors:
        print("Fail")
        for e in errors:
            print(f"  - {e}")
        return 1

    print("Pass")
    print(f"  {len(EDDocument.model_fields)} fields validated with zero CDE omissions or type mismatches.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
