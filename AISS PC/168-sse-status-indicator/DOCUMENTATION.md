# Architecture & Non-Coded Integrations Documentation

## Overview
This document contains system integration and telemetry specifications for technologies not requiring core UI code generation during Atomic Step 168 (React UI Component Build).

---

**1. Python & BigQuery Integration Specifications**

* **Status:** Coded implementation skipped for frontend UI step; telemetry schema defined for event tracking.
* **BigQuery Telemetry Table Schema (`sse_status_events`):**
  * `user_id` (STRING): Session/User identifier.
  * `event_timestamp` (TIMESTAMP): Execution timestamp.
  * `connection_status` (STRING): SSE status ('success', 'warning', 'error').
  * `md3_compliance_score` (FLOAT): Calculated score (Floor: 0.9, Optimal: 1.0).
  * `pass_fail_status` (STRING): Output field validation ('Pass' | 'Fail').

* **Python Ingestion Job snippet (for future analytics pipeline):**
```python
# Example BigQuery log ingestion payload
def log_sse_status_metric(client, user_id, status, compliance_score):
    table_id = "project.dataset.sse_status_events"
    rows_to_insert = [{
        "user_id": user_id,
        "event_timestamp": "AUTO",
        "connection_status": status,
        "md3_compliance_score": compliance_score,
        "pass_fail_status": "Pass" if compliance_score >= 0.9 else "Fail"
    }]
    client.insert_rows_json(table_id, rows_to_insert)
```

---

**2. Flutter Mobile Application Alignment**

* **Status:** Web/React component primary; Flutter token mapping specified below for cross-platform parity.
* **Flutter Material Design 3 Mapping (`lib/theme/status_colors.dart`):**
```dart
import 'package:flutter/material.dart';

class MD3StatusColors {
  static const Color success = Color(0xFF0F5257);
  static const Color warning = Color(0xFF7D5260);
  static const Color error = Color(0xFFB3261E);
  static const Color idle = Color(0xFF79747E);
}
```
