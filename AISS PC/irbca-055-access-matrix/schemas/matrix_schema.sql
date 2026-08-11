-- BigQuery Schema DDL: Tenant Access Matrix
CREATE TABLE IF NOT EXISTS `habot_connect_dmcc.tenant_access_matrix` (
    tenant_id STRING NOT NULL,
    user_id STRING NOT NULL,
    role_name STRING NOT NULL,
    matrix_dimensions ARRAY<STRING> NOT NULL, -- e.g., ["ALLOWANCE_VIEW", "CLAIMS_APPROVE"]
    matrix_values STRUCT<
        level STRING,
        spending_limit NUMERIC,
        approval_threshold NUMERIC
    > NOT NULL,
    matrix_type STRING NOT NULL,             -- e.g., "CORPORATE_ADMIN", "MANAGER_APPROVER"
    matrix_status STRING NOT NULL,           -- "ACTIVE", "SUSPENDED", "PENDING_REVIEW"
    updated_at TIMESTAMP NOT NULL,
    updated_by_session STRING NOT NULL
)
PARTITION BY DATE(updated_at)
CLUSTER BY tenant_id, user_id;
