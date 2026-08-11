import os
import json
import datetime
import sys
from google.cloud import bigquery

def log_fab_telemetry():
    config_path = os.path.join(os.getcwd(), 'src', 'components', 'layout', 'ContextualFAB.config.json')
    
    if not os.path.exists(config_path):
        print(f"[ERROR] Config file not found at {config_path}")
        sys.exit(1)

    with open(config_path, 'r') as f:
        config_data = json.load(f)

    required_keys = ["layout_type", "grid_dimensions", "spacing_rules", "alignment_settings"]
    validation_status = "Pass" if all(k in config_data for k in required_keys) else "Fail"

    telemetry_payload = {
        "layout_type": config_data.get("layout_type", "adaptive_circular_shortcut"),
        "layout_grid_dimensions": json.dumps(config_data.get("grid_dimensions", {})),
        "spacing_rules": json.dumps(config_data.get("spacing_rules", {})),
        "alignment_settings": json.dumps(config_data.get("alignment_settings", {})),
        "layout_validation_status": validation_status,
        "completion_status": validation_status,
        "action_event_timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "user_session_id": os.getenv("USER_SESSION_ID", "pooja_dev_session_384")
    }

    print(f"[BigQuery] Schema Payload Prepared:\n{json.dumps(telemetry_payload, indent=2)}")

    try:
        project_id = os.getenv("GCP_PROJECT_ID", "habotconnect-platform")
        dataset_id = os.getenv("BQ_DATASET_ID", "habotconnect_logs")
        table_id = "environment_setup_readiness"

        client = bigquery.Client(project=project_id)
        table_ref = f"{project_id}.{dataset_id}.{table_id}"

        errors = client.insert_rows_json(table_ref, [telemetry_payload])
        if not errors:
            print(f"[BigQuery Success] Streaming log pushed to {table_ref}")
        else:
            print(f"[BigQuery Warning] Insert errors: {errors}")
    except Exception as e:
        print(f"[BigQuery Local Runtime Note] GCP connection skipped: {str(e)}")

    with open('bigquery_execution_log.json', 'w') as f:
        json.dump(telemetry_payload, f, indent=2)

    if validation_status != "Pass":
        sys.exit(1)

if __name__ == "__main__":
    log_fab_telemetry()
