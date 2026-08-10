"""
Master interface schema / data contract for the End Document (ED).

This is the single source of structural truth referenced by:
  - Mobile ED UI layout (React components render 1:1 against this model)
  - BigQuery Native Table Schema enforcement (see bigquery_schema.json,
    which must stay field-for-field aligned with this file)
  - CI/CD validation gate (scripts/validate_ed_schema.py)

Rules encoded here (per EDEBS-032-A01):
  - Definitive CDE (Critical Data Element) restrictions
  - Nested structure bounds
  - Null condition rules
  - Precise type-casting schemas

Replace the placeholder fields below with your real ED CDEs. Keep this
file and bigquery_schema.json in lockstep — the validation script checks
that they match.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class EDStatus(str, Enum):
    """Allowed lifecycle states for an End Document. No null/free-text values."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class EDMetadata(BaseModel):
    """
    Nested structure bounds example: metadata is a bounded sub-object,
    not a free-form dict, so BigQuery can enforce it as a RECORD type.
    """

    model_config = ConfigDict(extra="forbid")  # reject unknown fields (CDE guardrail)

    source_system: str = Field(..., min_length=1, max_length=64)
    schema_version: str = Field(..., pattern=r"^\d+\.\d+\.\d+$")
    locale: Optional[str] = Field(default=None, max_length=10)


class EDDocument(BaseModel):
    """
    Master ED (End Document) schema.

    Every field is a Critical Data Element (CDE) unless explicitly marked
    Optional. Optional fields must still declare an explicit default —
    silent nulls are not permitted (mirrors BigQuery REQUIRED vs NULLABLE
    mode semantics).
    """

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    # --- Identity CDEs -----------------------------------------------
    document_id: str = Field(..., min_length=1, max_length=128)
    document_type: str = Field(..., min_length=1, max_length=64)

    # --- Lifecycle CDEs ------------------------------------------------
    status: EDStatus = Field(default=EDStatus.DRAFT)
    created_at: datetime
    updated_at: datetime

    # --- Ownership CDEs --------------------------------------------------
    owner_user_id: str = Field(..., min_length=1, max_length=128)

    # --- Nested structure ------------------------------------------------
    metadata: EDMetadata

    # --- Explicitly nullable field (must be declared, never implicit) ---
    notes: Optional[str] = Field(default=None, max_length=2000)
