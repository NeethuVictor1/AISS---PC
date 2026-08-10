from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from schemas.ed.ed_model import EDDocument, EDMetadata, EDStatus


def make_valid_document(**overrides) -> dict:
    base = dict(
        document_id="ED-0001",
        document_type="mobile_end_document",
        status=EDStatus.DRAFT,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
        owner_user_id="user-123",
        metadata=EDMetadata(source_system="mobile-app", schema_version="1.0.0"),
    )
    base.update(overrides)
    return base


def test_valid_document_parses():
    doc = EDDocument(**make_valid_document())
    assert doc.status == EDStatus.DRAFT


def test_rejects_unknown_fields():
    data = make_valid_document()
    data["unexpected_field"] = "nope"
    with pytest.raises(ValidationError):
        EDDocument(**data)


def test_rejects_missing_required_field():
    data = make_valid_document()
    del data["owner_user_id"]
    with pytest.raises(ValidationError):
        EDDocument(**data)


def test_notes_defaults_to_none():
    doc = EDDocument(**make_valid_document())
    assert doc.notes is None
