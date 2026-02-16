# Runbook: Backup and Recovery

| Field | Value |
|---|---|
| **Runbook ID** | RB-BACKUP-001 |
| **Owner** | DevOps Lead |
| **Last Updated** | 2026-02-16 |

## 1. Objective

This document outlines the procedures for backing up and recovering data for the Munsiq platform to meet the defined RPO and RTO.

- **Recovery Point Objective (RPO)**: 1 hour (Maximum acceptable data loss).
- **Recovery Time Objective (RTO)**: 4 hours (Maximum acceptable downtime for recovery).

## 2. Backup Strategy

| Component | Backup Method | Frequency | Retention | RPO |
|---|---|---|---|---|
| **PostgreSQL Database** | AWS Aurora Point-in-Time Recovery (PITR) | Continuous | 35 days | ~5 minutes |
| | AWS Aurora Automated Snapshots | Daily | 35 days | 24 hours |
| **S3 Documents** | S3 Bucket Versioning | Continuous | Indefinite | N/A (versioned) |
| | S3 Cross-Region Replication | Continuous | Indefinite | ~15 minutes |
| **Kubernetes Config** | Stored in Git | On change | Indefinite | N/A (Git history) |
| **Docker Images** | Stored in Container Registry | On build | Indefinite | N/A (versioned) |

## 3. Database Recovery Scenarios

### Scenario 1: Logical Error (e.g., accidental `DELETE`)

**Objective**: Restore a specific table or set of rows without a full database restore.

1.  **Identify Point-in-Time**: Determine the exact time before the logical error occurred.
2.  **Restore to New Instance**: Use AWS RDS console to perform a Point-in-Time Recovery of the database cluster to a *new*, temporary cluster (e.g., `munsiq-db-cluster-temp-restore`).
3.  **Connect and Export**: Connect to the temporary cluster using a SQL client. Use `pg_dump` to export only the required data from the affected table(s).
    ```bash
    pg_dump --host=<temp-host> --username=<user> --table=<schema.table_name> --data-only > recovery.sql
    ```
4.  **Import Data**: Review the `recovery.sql` file and then import it into the live production database to restore the lost data.
    ```bash
    psql --host=<prod-host> --username=<user> < recovery.sql
    ```
5.  **Decommission Temp Cluster**: Once data is verified, delete the temporary RDS cluster.

### Scenario 2: Full Cluster Failure or Region Outage

**Objective**: Restore the entire database to a working state.

1.  **Promote Read Replica (If available)**: If the failure only affects the primary writer instance, the fastest recovery is to promote one of the read replicas to be the new primary. This is handled automatically by Aurora with a failover time of < 1 minute.

2.  **Restore from Snapshot (Catastrophic failure)**:
    1.  Navigate to the AWS RDS console.
    2.  Select the most recent automated snapshot of the production cluster.
    3.  Choose "Restore Snapshot".
    4.  Configure the new cluster with the same settings as the original (instance size, VPC, security groups).
    5.  Once the new cluster is available, update the application configuration (in Kubernetes Secrets) to point to the new database endpoint.
    6.  Restart the API application pods to pick up the new database connection details.

## 4. S3 Document Recovery

### Scenario 1: Accidental Deletion or Overwrite

1.  **Identify File**: Get the S3 key (path) of the affected file.
2.  **List Versions**: Use the AWS CLI or S3 console to list all versions of the object.
3.  **Restore Previous Version**: Identify the correct previous version and either:
    -   Copy the previous version to become the new current version.
    -   Delete the incorrect current version (which will make the previous version the current one).

### Scenario 2: Bucket Loss or Region Outage

1.  **Failover to Replica**: The application configuration will be updated to point to the cross-region replica bucket.
2.  **Promote Replica**: The replica bucket will be promoted to be the new primary write target.
3.  **Re-establish Replication**: Once the original region is restored, cross-region replication will be set up again from the new primary.

## 5. Recovery Drills

- Recovery procedures will be tested quarterly.
- The test will involve restoring a snapshot to a temporary cluster and verifying data integrity.
- The results of each drill will be documented.
