from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from google.cloud import bigquery
import datetime
import os

app = FastAPI(title="HABOT Connect DMCC - Access Matrix Service")
bq_client = bigquery.Client()

TABLE_ID = os.getenv("BIGQUERY_TABLE_ID", "habot_connect_dmcc.tenant_access_matrix")

class MatrixUpdateRequest(BaseModel):
    user_id: str
    role_id: str
    assigned: bool
    session_id: str

@app.get("/api/v1/matrix/{user_id}")
async def get_user_access_matrix(user_id: str, x_tenant_id: str = Header(...)):
    query = f"""
        SELECT tenant_id, user_id, role_name, matrix_dimensions, matrix_values, matrix_type, matrix_status
        FROM `{TABLE_ID}`
        WHERE tenant_id = @tenant_id AND user_id = @user_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("tenant_id", "STRING", x_tenant_id),
            bigquery.ScalarQueryParameter("user_id", "STRING", user_id),
        ]
    )
    results = bq_client.query(query, job_config=job_config).result()
    rows = [dict(row) for row in results]
    return {"tenant_id": x_tenant_id, "user_id": user_id, "roles": rows}

@app.post("/api/v1/matrix/toggle")
async def toggle_role_assignment(payload: MatrixUpdateRequest, x_tenant_id: str = Header(...)):
    status = "ACTIVE" if payload.assigned else "SUSPENDED"
    query = f"""
        UPDATE `{TABLE_ID}`
        SET matrix_status = @status,
            updated_at = @updated_at,
            updated_by_session = @session_id
        WHERE tenant_id = @tenant_id AND user_id = @user_id AND role_name = @role_id
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("status", "STRING", status),
            bigquery.ScalarQueryParameter("updated_at", "TIMESTAMP", datetime.datetime.now(datetime.timezone.utc)),
            bigquery.ScalarQueryParameter("session_id", "STRING", payload.session_id),
            bigquery.ScalarQueryParameter("tenant_id", "STRING", x_tenant_id),
            bigquery.ScalarQueryParameter("user_id", "STRING", payload.user_id),
            bigquery.ScalarQueryParameter("role_id", "STRING", payload.role_id),
        ]
    )
    query_job = bq_client.query(query, job_config=job_config)
    query_job.result()
    return {"status": "SUCCESS", "role_id": payload.role_id, "assigned": payload.assigned}
