import datetime
from google.cloud import bigquery

def run_qa_execution_assessment(passed_tests: int, total_tests: int) -> dict:
    score = (passed_tests / total_tests) * 100.0 if total_tests > 0 else 0.0
    floor, target, ceiling = 95.0, 99.0, 100.0
    status = "PASS" if score >= floor else "FAIL"

    metrics = {
        "global_ref_id": "IRBCA-055",
        "metric_name": "Process Execution Quality (%)",
        "score": round(score, 2),
        "floor": floor,
        "target": target,
        "ceiling": ceiling,
        "status": status,
        "standard_reference": "ISO 9001:2015 Quality Management System",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

    client = bigquery.Client()
    table_id = "habot_connect_dmcc.qa_execution_telemetry"
    
    rows_to_insert = [{
        "global_ref_id": metrics["global_ref_id"],
        "metric_name": metrics["metric_name"],
        "score": metrics["score"],
        "status": metrics["status"],
        "execution_timestamp": metrics["timestamp"],
        "details": f"Floor: {floor}%, Target: {target}%, Ceiling: {ceiling}%"
    }]

    try:
        errors = client.insert_rows_json(table_id, rows_to_insert)
        if errors:
            print(f"[WARNING] BigQuery insertion returned errors: {errors}")
    except Exception as e:
        print(f"[NOTE] BigQuery logger operating in standalone/offline mode: {e}")

    return metrics

if __name__ == "__main__":
    result = run_qa_execution_assessment(passed_tests=99, total_tests=100)
    print("
--- QA Assessment Summary ---")
    print(f"Global Reference ID: {result['global_ref_id']}")
    print(f"Metric:              {result['metric_name']}")
    print(f"Calculated Score:    {result['score']}% (Floor: {result['floor']}%)")
    print(f"Status:              {result['status']}")
    print(f"Standard Reference:  {result['standard_reference']}
")
