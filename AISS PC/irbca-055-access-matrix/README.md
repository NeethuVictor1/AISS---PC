# IRBCA-055: Multi-User Access Mapping Matrix Module

This repository contains the complete implementation across all 4 microsteps for **IRBCA-055** under the HABOT Connect DMCC architecture.

## Structure
- `schemas/`: BigQuery DDL schemas and JSON data contracts (M1)
- `src/components/admin/`: React Material 3 Administrative UI (M2)
- `src/hooks/`: React Query data fetching & mutation hooks (M3)
- `backend/app/`: Python FastAPI microservice connected to Google BigQuery (M3)
- `qa/`: Automated QA telemetry & ISO 9001:2015 Process Execution Quality calculator (M4)

## Quick Start
1. Run `npm install` to install frontend dependencies.
2. Run `pip install -r backend/app/requirements.txt` for backend setup.
3. Execute `python qa/qa_validation.py` to verify quality thresholds.
