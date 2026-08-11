import json
import os
import datetime
import uuid
from google.cloud import bigquery
from google.auth import default

# HabotConnect DMCC Architecture: Workload Identity Federation (ADC Auth, zero JSON keys)
DATASET_ID = os.getenv("HABOT_BIGQUERY_DATASET", "habotconnect_dmcc_analytics")
TABLE_ID = os.getenv("HABOT_BIGQUERY_TABLE", "overlay_telemetry_logs")

def log_step_telemetry(status: str, session_id: str = None) -> bool:
    config_path = "src/design-system/overlays/floating_callout_overlay.json"
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    credentials, project_id = default()
    client = bigquery.Client(credentials=credentials, project=project_id)
    table_ref = f"{project_id}.{DATASET_ID}.{TABLE_ID}"

    rows_to_insert = [{
        "system_name": data["system_name"],
        "system_version": data["system_version"],
        "component_list": json.dumps(data["component_list"]),
        "token_values": json.dumps(data["token_values"]),
        "documentation_links": json.dumps(data["documentation_links"]),
        "system_configuration_details": json.dumps(data["system_configuration_details"]),
        "completion_status": status, # 'Partial' (Optimal) or 'Complete' (Ceiling)
        "action_event_timestamp": datetime.datetime.utcnow().isoformat(),
        "user_session_id": session_id or str(uuid.uuid4())
    }]

    errors = client.insert_rows_json(table_ref, rows_to_insert)
    if errors:
        raise RuntimeError(f"[BIGQUERY ERROR] Telemetry insert failed: {errors}")
    
    print(f"[BIGQUERY SUCCESS] Logged telemetry status '{status}' to {table_ref}")
    return True

if __name__ == "__main__":
    log_step_telemetry(status="Partial")
