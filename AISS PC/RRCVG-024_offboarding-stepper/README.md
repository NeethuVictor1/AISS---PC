# Offboarding Checklist Stepper Module

This folder contains the complete binary offboarding checklist stepper system.

## Folder Structure
- `config/offboarding_schema.json`: Source-of-truth schema & rules.
- `src/api/revocationServices.js`: Frontend API revocation handler.
- `src/hooks/useOffboardingGate.js`: Zero-trust gate validation custom hook.
- `src/components/ChecklistToggleGroup.jsx`: Mobile-first responsive UI component.
- `server/main.py`: Python FastAPI backend with GCP BigQuery streaming integration.

## Backend Quickstart (Python FastAPI)
```bash
cd server
pip install fastapi uvicorn google-cloud-bigquery
uvicorn main:app --reload --port 5000
```
